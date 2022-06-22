import { WebPlugin } from '@capacitor/core';
import type { MParticleCapacitorPlugin } from './definitions';
import mParticle from '@mparticle/web-sdk';
export declare class MParticleCapacitorWeb extends WebPlugin implements MParticleCapacitorPlugin {
    mParticleInit(call: {
        key: string;
        production: boolean;
        planID: string;
        planVer: number;
        logLevel: any;
    }): Promise<any>;
    loginMParticleUser(call: {
        email: string;
        customerId: string;
    }): Promise<any>;
    logoutMParticleUser(_call: any): Promise<any>;
    registerMParticleUser(call: {
        email: string;
        customerId: string;
        userAttributes: any;
    }): Promise<any>;
    logMParticleEvent(call: {
        eventName: string;
        eventType: any;
        eventProperties: any;
    }): Promise<any>;
    logMParticlePageView(call: {
        pageName: string;
        pageLink: string;
    }): Promise<any>;
    setUserAttribute(call: {
        attributeName: string;
        attributeValue: string;
    }): Promise<any>;
    setUserAttributeList(call: {
        attributeName: string;
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
