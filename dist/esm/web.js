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
    async logMPEvent(call) {
        console.log('event fired', call);
        return mParticle.logEvent(call.eventName, call.eventType, call.eventProperties);
    }
    async logMParticlePageView(call) {
        return mParticle.logPageView(call.pageName, { page: call.pageLink });
    }
    get currentUser() {
        return mParticle.Identity.getCurrentUser();
    }
    async setUserAttribute(call) {
        return this.currentUser.setUserAttribute(call.attributeName, call.attributeValue);
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