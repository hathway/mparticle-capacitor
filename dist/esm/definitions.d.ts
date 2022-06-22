export declare type mParticleInitListener = (info: any) => any;
export interface MParticleCapacitorPlugin {
    echo(options: {
        value: string;
    }): Promise<{
        value: string;
    }>;
    mParticleInit(call: {
        key: string;
        production?: boolean;
        planID?: string;
        planVer?: number;
        logLevel?: any;
    }): Promise<any>;
    loginMParticleUser(call: {
        email: string;
        customerId: string;
    }): Promise<any>;
    logoutMParticleUser(call?: any): Promise<any>;
    logMParticleEvent(call: {
        eventName: string;
        eventType: any;
        eventProperties: any;
    }): Promise<any>;
    logMParticlePageView(call: {
        pageName: string;
        pageLink: any;
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
    registerMParticleUser(call: {
        email: string;
        customerId: string;
        userAttributes: any;
    }): Promise<any>;
}
export declare enum MParticleEventType {
    Navigation = 1,
    Location = 2,
    Search = 3,
    Transaction = 4,
    UserContent = 5,
    UserPreference = 6,
    Social = 7,
    Other = 8
}
export declare enum MParticleProductActionType {
    Unknown = 0,
    AddToCart = 1,
    RemoveFromCart = 2,
    Checkout = 3,
    CheckoutOption = 4,
    Click = 5,
    ViewDetail = 6,
    Purchase = 7,
    Refund = 8,
    AddToWishlist = 9,
    RemoveFromWishlist = 10
}
