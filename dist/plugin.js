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
        async logoutMParticleUser(call) {
            const identityCallback = (result) => {
                if (result.getUser()) {
                    console.log('logging out of mParticle', call);
                }
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
