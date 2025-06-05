'use strict';

var core = require('@capacitor/core');
var mParticle = require('@mparticle/web-sdk');

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
    constructor() {
        super(...arguments);
        this.mParticle = mParticle;
    }
    async mParticleConfig(call) {
        const mParticleConfig = {
            isDevelopmentMode: call.isDevelopmentMode,
            dataPlan: {
                planId: call.planID || 'master_data_plan',
            },
            identifyRequest: call.identifyRequest || undefined,
            logLevel: (call.logLevel == "verbose" || "warning" || "none") ? call.logLevel : "verbose",
        };
        // Plan Version is optional but we need to set a default for existing clients which expect it to default to "2"
        // if it is not passed.  Therefore we use planVersionRequired flag to determine if we can just not set it at all
        // which will cause MP to default to latest version
        if (call.planVer !== undefined && !isNaN(call.planVer)) {
            mParticleConfig.dataPlan.planVersion = call.planVer;
        }
        else if (call.planVersionRequired) {
            mParticleConfig.dataPlan.planVersion = 2;
        }
        return mParticleConfig;
    }
    mParticleInit(call) {
        return new Promise((resolve, reject) => {
            call.mParticleConfig.identityCallback = (result) => {
                resolve(result);
            };
            try {
                this.mParticle.init(call.key, Object.assign({}, call.mParticleConfig));
            }
            catch (e) {
                reject(e);
            }
        });
    }
    loginMParticleUser(call) {
        return new Promise((resolve, reject) => {
            try {
                this.mParticle.Identity.login(this.identityRequest(call.email, call.customerId), (result) => {
                    resolve({ value: result.getUser().getMPID() });
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    logoutMParticleUser(_call) {
        return new Promise((resolve, reject) => {
            try {
                this.mParticle.Identity.logout({}, (result) => {
                    resolve(result);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    registerMParticleUser(call) {
        return new Promise((resolve, reject) => {
            this.mParticle.Identity.login(this.identityRequest(call.email, call.customerId), (result) => {
                if (!result) {
                    reject();
                }
                const currentUser = result.getUser();
                for (const [key, value] of Object.entries(call.userAttributes)) {
                    if (key && value)
                        currentUser.setUserAttribute(key, value.toString());
                }
                resolve(result);
            });
        });
    }
    logMParticleEvent(call) {
        this.mParticle.logEvent(call.eventName, call.eventType, call.eventProperties);
    }
    logMParticlePageView(call) {
        var _a;
        let attributeName = "page";
        if ((_a = call === null || call === void 0 ? void 0 : call.overrides) === null || _a === void 0 ? void 0 : _a.attributeName) {
            attributeName = call.overrides.attributeName;
        }
        const attributes = { [attributeName]: call.pageLink };
        this.mParticle.logPageView(call.pageName, attributes);
    }
    // this method is not used for web... this is just a stub
    logMParticleScreenView(call) {
        console.log(call);
        // this.logMParticlePageView(call)
        return;
    }
    getAllUserAttributes(_call) {
        return this.currentUser.getAllUserAttributes();
    }
    setUserAttribute(call) {
        var _a;
        (_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.setUserAttribute(call.attributeName, call.attributeValue);
    }
    setUserAttributeList(call) {
        var _a;
        (_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.setUserAttributeList(call.attributeName, call.attributeValues);
    }
    removeUserAttribute(call) {
        var _a;
        (_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.removeUserAttribute(call.attributeName);
    }
    updateMParticleCart(call) {
        const productToUpdate = this.createMParticleProduct(call.productData);
        this.logProductAction(call.eventType, productToUpdate, call.customAttributes, null, null);
    }
    addMParticleProduct(call) {
        const product = this.createMParticleProduct(call.productData);
        this.logProductAction(this.mParticle.ProductActionType.AddToCart, product, call.customAttributes, null, null);
    }
    removeMParticleProduct(call) {
        const productToRemove = this.createMParticleProduct(call.productData);
        this.logProductAction(this.mParticle.ProductActionType.RemoveFromCart, productToRemove, call.customAttributes, null, null);
    }
    submitPurchaseEvent(call) {
        const productArray = [];
        (call.productData).forEach((element) => {
            productArray.push(this.createMParticleProduct(element));
        });
        this.logProductAction(this.mParticle.ProductActionType.Purchase, productArray, call.customAttributes, call.transactionAttributes, null);
    }
    submitCheckoutEvent(call) {
        const productArray = [];
        (call.productData).forEach((element) => {
            productArray.push(this.createCustomMParticleProduct(element));
        });
        this.logProductAction(this.mParticle.ProductActionType.Checkout, productArray, call.customAttributes, call.transactionAttributes, null);
    }
    get currentUser() {
        return this.mParticle.Identity.getCurrentUser();
    }
    identityRequest(email, customerId) {
        const identity = {
            userIdentities: {
                email
            },
        };
        if (customerId) {
            identity.userIdentities.customerid = customerId;
        }
        return identity;
    }
    createMParticleProduct(productData) {
        return this.mParticle.eCommerce.createProduct(productData.name, //productName
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
    createCustomMParticleProduct(productData) {
        return this.mParticle.eCommerce.createProduct(productData.name, //productName
        productData.sku, //productSku
        productData.cost, //productPrice
        productData.quantity, //quantity
        productData.variant || undefined, // variant
        productData.category || undefined, // category
        productData.brand || undefined, // brand
        productData.position || undefined, // position
        productData.couponCode || undefined, // couponCode
        productData.attributes);
    }
    logProductAction(eventType, product, customAttributes, transactionAttributes, customFlags) {
        this.mParticle.eCommerce.logProductAction(eventType, product, // product created on mparticle
        customAttributes, // mimData
        customFlags, transactionAttributes);
    }
    async echo(options) {
        return new Promise((resolve) => resolve(options));
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MParticleCapacitorWeb: MParticleCapacitorWeb
});

exports.MParticleCapacitor = MParticleCapacitor;
//# sourceMappingURL=plugin.cjs.js.map
