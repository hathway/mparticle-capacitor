import { WebPlugin } from '@capacitor/core';
import mParticle from '@mparticle/web-sdk';
export class MParticleCapacitorWeb extends WebPlugin {
    async mParticleInit(call) {
        const mParticleConfig = {
            isDevelopmentMode: !(call.production) || true,
            dataPlan: {
                planId: call.planID || 'master_data_plan',
                planVersion: call.planVer || 2
            },
            logLevel: (call.logLevel == "verbose" || "warning" || "none") ? call.logLevel : "verbose",
        };
        return mParticle.init(call.key, mParticleConfig);
    }
    async loginMParticleUser(call) {
        return mParticle.Identity.login(this.identityRequest(call.email, call.customerId));
    }
    async logoutMParticleUser(_call) {
        const identityCallback = (result) => {
            if (result.getUser()) {
                // console.log('logging out of mParticle',_call);
            }
        };
        return mParticle.Identity.logout({}, identityCallback);
    }
    async registerMParticleUser(call) {
        return mParticle.Identity.login(this.identityRequest(call.email, call.customerId), function (result) {
            if (!result)
                return;
            let currentUser = result.getUser();
            for (let [key, value] of Object.entries(call.userAttributes)) {
                if (key && value)
                    currentUser.setUserAttribute(key, value);
            }
        });
    }
    async logMParticleEvent(call) {
        return mParticle.logEvent(call.eventName, call.eventType, call.eventProperties);
    }
    async logMParticlePageView(call) {
        return mParticle.logPageView(call.pageName, { page: call.pageLink });
    }
    async setUserAttribute(call) {
        return this.currentUser?.setUserAttribute(call.attributeName, call.attributeValue);
    }
    async setUserAttributeList(call) {
        return this.currentUser.setUserAttributeList(call.attributeName, call.attributeValues);
    }
    async updateMParticleCart(call) {
        const productToUpdate = this.createMParticleProduct(call.productData);
        return this.logProductAction(call.eventType, productToUpdate, call.customAttributes, null, null);
    }
    async addMParticleProduct(call) {
        const product = this.createMParticleProduct(call.productData);
        return this.logProductAction(mParticle.ProductActionType.AddToCart, product, call.customAttributes, null, null);
    }
    async removeMParticleProduct(call) {
        const productToRemove = this.createMParticleProduct(call.productData);
        return this.logProductAction(mParticle.ProductActionType.RemoveFromCart, productToRemove, call.customAttributes, null, null);
    }
    async submitPurchaseEvent(call) {
        let productArray = [];
        (call.productData).forEach((element) => {
            productArray.push(this.createMParticleProduct(element));
        });
        return this.logProductAction(mParticle.ProductActionType.Purchase, productArray, call.customAttributes, call.transactionAttributes, null);
    }
    get currentUser() {
        return mParticle.Identity.getCurrentUser();
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
        return mParticle.eCommerce.createProduct(productData.name, //productName
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
        mParticle.eCommerce.logProductAction(eventType, product, // product created on mparticle
        customAttributes, // mimData
        customFlags, transactionAttributes);
    }
    async echo(options) {
        return options;
    }
}
//# sourceMappingURL=web.js.map