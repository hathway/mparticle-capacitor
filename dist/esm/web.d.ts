import { WebPlugin } from '@capacitor/core';
import type { MParticleCapacitorPlugin } from './definitions';
import mParticle from '@mparticle/web-sdk';
export declare class MParticleCapacitorWeb extends WebPlugin implements MParticleCapacitorPlugin {
    mParticleInit(call: {
        key: any;
        production: any;
    }): Promise<any>;
    loginMParticleUser(call: {
        email: any;
        customerId: any;
    }): Promise<any>;
    logoutMParticleUser(_call: any): Promise<any>;
    registerMParticleUser(call: {
        email: any;
        customerId: any;
        userAttributes: any;
    }): Promise<any>;
    logMParticleEvent(call: {
        eventName: any;
        eventType: any;
        eventProperties: any;
    }): Promise<any>;
    logMParticlePageView(call: {
        pageName: any;
        pageLink: any;
    }): Promise<any>;
    setUserAttribute(call: {
        attributeName: any;
        attributeValue: any;
    }): Promise<any>;
    setUserAttributeList(call: {
        attributeName: any;
        attributeValues: any;
    }): Promise<any>;
    updateMParticleCart(call: {
        productData: any;
        customAttributes: any;
        eventType: any;
    }): Promise<any>;
    addMParticleProduct(call: {
        productData: any;
        customAttributes: any;
    }): Promise<any>;
    removeMParticleProduct(call: {
        productData: any;
        customAttributes: any;
    }): Promise<any>;
    submitPurchaseEvent(call: {
        productData: any;
        customAttributes: any;
        transactionAttributes: any;
    }): Promise<any>;
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
