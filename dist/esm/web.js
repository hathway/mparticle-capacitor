import { WebPlugin } from '@capacitor/core';
import mParticle from '@mparticle/web-sdk';
export class MParticleCapacitorWeb extends WebPlugin {
    async mParticleInit(call) {
        call.mParticleKey = 'us1-5ab5289891733e44b00e610dc69e4746';
        const mParticleConfig = {
            isDevelopmentMode: true,
            dataPlan: {
                planId: 'master_data_plan',
                planVersion: 2
            }
        };
        console.log('web MPinit', call, mParticleConfig);
        return mParticle.init(call.mParticleKey, mParticleConfig);
    }
    async loginMParticleUser(call) {
        return mParticle.Identity.login(this.identityRequest(call.email, call.customerId));
    }
    async logMParticleEvent(call) {
        console.log('event fired', call);
        return mParticle.logEvent(call.eventName, call.eventType, call.eventProperties);
    }
    async logMParticlePageView(call) {
        return mParticle.logPageView(call.pageName, { page: call.pageLink });
    }
    async setUserAttribute(call) {
        return this.currentUser.setUserAttribute(call.attributeName, call.attributeValue);
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
    async echo(options) {
        console.log('ECHO', options);
        return options;
    }
    async helloMP() {
        return 'hello from mParticle';
    }
}
//# sourceMappingURL=web.js.map