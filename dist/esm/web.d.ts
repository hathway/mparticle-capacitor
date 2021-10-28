import { WebPlugin } from '@capacitor/core';
import type { MParticleCapacitorPlugin } from './definitions';
import mParticle from '@mparticle/web-sdk';
export declare class MParticleCapacitorWeb extends WebPlugin implements MParticleCapacitorPlugin {
    mParticleInit(call: any): Promise<any>;
    loginMParticleUser(call: any): Promise<any>;
    logoutMParticleUser(_call: any): Promise<any>;
    registerMParticleUser(call: any): Promise<any>;
    logMParticleEvent(call: any): Promise<any>;
    logMParticlePageView(call: any): Promise<any>;
    setUserAttribute(call: any): Promise<any>;
    setUserAttributeList(call: any): Promise<any>;
    getUserAttributeLists(_call: any): Promise<any>;
    updateMParticleCart(call: any): Promise<any>;
    addMParticleProduct(call: any): Promise<any>;
    removeMParticleProduct(call: any): Promise<any>;
    submitPurchaseEvent(call: any): Promise<any>;
    get currentUser(): mParticle.User;
    private identityRequest;
    private createMParticleProduct;
    private logProductAction;
    echo(options: {
        value: string;
    }): Promise<{
        value: string;
    }>;
}
