import { WebPlugin } from '@capacitor/core';
import mParticle from '@mparticle/web-sdk';
import type { AllUserAttributes, IdentityResult, MParticleCapacitorPlugin, MPConfigType } from './definitions';
export interface MParticleConfigArguments {
    isDevelopmentMode?: boolean;
    planID?: string;
    planVer?: number;
    planVersionRequired?: boolean;
    logLevel?: string;
    identifyRequest?: any;
    identityCallback?: (i: IdentityResult) => void;
}
export declare class MParticleCapacitorWeb extends WebPlugin implements MParticleCapacitorPlugin {
    mParticle: typeof mParticle;
    mParticleConfig(call: MParticleConfigArguments): Promise<MPConfigType>;
    mParticleInit(call: {
        key: string;
        mParticleConfig: any;
    }): Promise<IdentityResult>;
    loginMParticleUser(call: {
        email: string;
        customerId?: string;
    }): Promise<{
        value: string;
    }>;
    logoutMParticleUser(_call?: any): Promise<mParticle.IdentityResult>;
    registerMParticleUser(call: {
        email: string;
        customerId?: string;
        userAttributes: any;
    }): Promise<any>;
    logMParticleEvent(call: {
        eventName: string;
        eventType: any;
        eventProperties: any;
    }): void;
    logMParticlePageView(call: {
        pageName: string;
        pageLink: string;
        overrides?: {
            attributeName: string;
        };
    }): void;
    logMParticleScreenView(call: any): void;
    getAllUserAttributes(_call?: any): AllUserAttributes;
    setUserAttribute(call: {
        attributeName: string;
        attributeValue: string;
    }): void;
    setUserAttributeList(call: {
        attributeName: string;
        attributeValues: any;
    }): void;
    removeUserAttribute(call: {
        attributeName: string;
    }): void;
    updateMParticleCart(call: {
        productData: any;
        customAttributes: any;
        eventType: any;
    }): void;
    addMParticleProduct(call: {
        productData: any;
        customAttributes: any;
    }): void;
    removeMParticleProduct(call: {
        productData: any;
        customAttributes: any;
    }): void;
    submitPurchaseEvent(call: {
        productData: any[];
        customAttributes: any;
        transactionAttributes: any;
    }): void;
    submitCheckoutEvent(call: {
        productData: any[];
        customAttributes: any;
        transactionAttributes: any;
    }): void;
    get currentUser(): mParticle.User;
    protected identityRequest(email: string, customerId?: string): any;
    protected createMParticleProduct(productData: any): mParticle.Product;
    protected createCustomMParticleProduct(productData: any): mParticle.Product;
    protected logProductAction(eventType: any, product: any, customAttributes: any, transactionAttributes?: any, customFlags?: any): void;
    echo(options: {
        value: string;
    }): Promise<{
        value: string;
    }>;
}
