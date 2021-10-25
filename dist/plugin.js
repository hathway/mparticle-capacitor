var capacitorMParticleCapacitor = (function (exports, core, mParticle, mParticleBraze) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var mParticle__default = /*#__PURE__*/_interopDefaultLegacy(mParticle);
    var mParticleBraze__default = /*#__PURE__*/_interopDefaultLegacy(mParticleBraze);

    exports.MParticleEventType = void 0;
    (function (MParticleEventType) {
        MParticleEventType[MParticleEventType["Navigation"] = 1] = "Navigation";
        MParticleEventType[MParticleEventType["Location"] = 2] = "Location";
        MParticleEventType[MParticleEventType["Search"] = 3] = "Search";
        MParticleEventType[MParticleEventType["Transaction"] = 4] = "Transaction";
        MParticleEventType[MParticleEventType["UserContent"] = 5] = "UserContent";
        MParticleEventType[MParticleEventType["UserPreference"] = 6] = "UserPreference";
        MParticleEventType[MParticleEventType["Social"] = 7] = "Social";
        MParticleEventType[MParticleEventType["Other"] = 8] = "Other";
    })(exports.MParticleEventType || (exports.MParticleEventType = {}));
    exports.MParticleProductActionType = void 0;
    (function (MParticleProductActionType) {
        MParticleProductActionType[MParticleProductActionType["Unknown"] = 0] = "Unknown";
        MParticleProductActionType[MParticleProductActionType["AddToCart"] = 1] = "AddToCart";
        MParticleProductActionType[MParticleProductActionType["RemoveFromCart"] = 2] = "RemoveFromCart";
        MParticleProductActionType[MParticleProductActionType["Checkout"] = 3] = "Checkout";
        MParticleProductActionType[MParticleProductActionType["CheckoutOption"] = 4] = "CheckoutOption";
        MParticleProductActionType[MParticleProductActionType["Click"] = 5] = "Click";
        MParticleProductActionType[MParticleProductActionType["ViewDetail"] = 6] = "ViewDetail";
        MParticleProductActionType[MParticleProductActionType["Purchase"] = 7] = "Purchase";
        MParticleProductActionType[MParticleProductActionType["Refund"] = 8] = "Refund";
        MParticleProductActionType[MParticleProductActionType["AddToWishlist"] = 9] = "AddToWishlist";
        MParticleProductActionType[MParticleProductActionType["RemoveFromWishlist"] = 10] = "RemoveFromWishlist";
    })(exports.MParticleProductActionType || (exports.MParticleProductActionType = {}));

    const MParticleCapacitor = core.registerPlugin('MParticleCapacitor', {
        web: () => Promise.resolve().then(function () { return web; }).then(m => new m.MParticleCapacitorWeb()),
    });

    class MParticleCapacitorWeb extends core.WebPlugin {
        async mParticleInit(call) {
            call.mParticleKey = 'us1-5ab5289891733e44b00e610dc69e4746';
            const mParticleConfig = {
                isDevelopmentMode: true,
                dataPlan: {
                    planId: 'master_data_plan',
                    planVersion: 2
                }
            };
            console.log('web MPinit', call, mParticleConfig, mParticleBraze__default["default"]);
            mParticleBraze__default["default"].register(mParticleConfig);
            return mParticle__default["default"].init(call.mParticleKey, mParticleConfig);
        }
        async loginMParticleUser(call) {
            return mParticle__default["default"].Identity.login(this.identityRequest(call.email, call.customerId));
        }
        async logoutMParticleUser(_call) {
            const identityCallback = (result) => {
                if (result.getUser()) ;
            };
            return mParticle__default["default"].Identity.logout({}, identityCallback);
        }
        async logMParticleEvent(call) {
            console.log('event fired', call);
            return mParticle__default["default"].logEvent(call.eventName, call.eventType, call.eventProperties);
        }
        async logMParticlePageView(call) {
            console.log(mParticle__default["default"], call);
            return mParticle__default["default"].logPageView(call.pageName, { page: call.pageLink });
        }
        async setUserAttribute(call) {
            return this.currentUser.setUserAttribute(call.attributeName, call.attributeValue);
        }
        async setUserAttributeList(call) {
            return this.currentUser.setUserAttributeList(call.attributeName, call.attributeValues);
        }
        async getUserAttributeLists(_call) {
            console.log("0w", this.currentUser.getAllUserAttributes());
            console.log("1w", this.currentUser.getUserAttributesLists());
            return this.currentUser.getUserAttributesLists();
        }
        async updateMParticleCart(call) {
            const productToUpdate = this.createMParticleProduct(call.product);
            return this.logProductAction(call.eventType, productToUpdate, call.customAttributes, null, null);
        }
        async addMParticleProduct(call) {
            const product = this.createMParticleProduct(call.productData);
            return this.logProductAction(mParticle__default["default"].ProductActionType.AddToCart, product, call.customAttributes, null, null);
        }
        async removeMParticleProduct(call) {
            const productToRemove = this.createMParticleProduct(call.product);
            return this.logProductAction(mParticle__default["default"].ProductActionType.RemoveFromCart, productToRemove, call.customAttributes, null, null);
        }
        async submitPurchaseEvent(call) {
            let productArray = [];
            (call.productData).forEach((element) => {
                productArray.push(this.createMParticleProduct(element));
            });
            return this.logProductAction(mParticle__default["default"].ProductActionType.Checkout, productArray, call.customAttributes, call.transactionAttributes, null);
        }
        get currentUser() {
            return mParticle__default["default"].Identity.getCurrentUser();
        }
        identityRequest(email, customerId) {
            return {
                userIdentities: {
                    email,
                    customerid: customerId
                },
            };
        }
        createMParticleProduct(productData) {
            return mParticle__default["default"].eCommerce.createProduct(productData.name, //productName
            productData.sku, //productSku
            productData.cost, //productPrice
            productData.quantity, //quantity
            undefined, // variant
            undefined, // category
            undefined, // brand
            undefined, // position
            undefined, // couponCode
            productData.attributes);
        }
        logProductAction(eventType, product, customAttributes, transactionAttributes, customFlags) {
            mParticle__default["default"].eCommerce.logProductAction(eventType, product, // product created on mparticle
            customAttributes, // mimData
            customFlags, transactionAttributes);
        }
        async echo(options) {
            console.log('ECHO', options);
            return options;
        }
        async helloMP() {
            return 'hello from mParticle';
        }
    }

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        MParticleCapacitorWeb: MParticleCapacitorWeb
    });

    exports.MParticleCapacitor = MParticleCapacitor;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, capacitorExports, mParticle, mParticleBraze);
//# sourceMappingURL=plugin.js.map
