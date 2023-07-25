import type { MParticleConfigArguments } from "./web";
export declare type mParticleInitListener = (info: any) => any;
export interface MParticleCapacitorPlugin {
    echo(options: {
        value: string;
    }): Promise<{
        value: string;
    }>;
    currentUser: User;
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
    logoutMParticleUser(call?: any): Promise<IdentityResult>;
    getAllUserAttributes(call?: any): AllUserAttributes;
    logMParticleEvent(call: {
        eventName: string;
        eventType: any;
        eventProperties: any;
    }): void;
    logMParticlePageView(call: {
        pageName: string;
        pageLink: any;
        overrides?: any;
    }): void;
    logMParticleScreenView(call: {
        pageName: string;
        pageLink: any;
        overrides?: any;
    }): void;
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
        productData: any;
        customAttributes: any;
        transactionAttributes: any;
    }): void;
    registerMParticleUser(call: {
        email: string;
        customerId?: string;
        userAttributes: any;
    }): Promise<any>;
}
export interface IdentityResultBody {
    context: string | null;
    is_ephemeral: boolean;
    is_logged_in: boolean;
    matched_identities: Record<string, unknown>;
}
export declare type IdentityResult = {
    httpCode: any;
    getPreviousUser(): User;
    getUser(): User;
    body: IdentityResultBody;
};
export declare type GDPRConsentState = {
    [key: string]: PrivacyConsentState;
};
export declare type PrivacyConsentState = {
    Consented: boolean;
    Timestamp: number;
    ConsentDocument: string;
    Location: string;
    HardwareId: string;
};
export declare type CCPAConsentState = PrivacyConsentState;
export declare type ConsentState = {
    setGDPRConsentState: (gdprConsentState: GDPRConsentState) => ConsentState;
    setCCPAConsentState: (ccpaConsentState: CCPAConsentState) => ConsentState;
    addGDPRConsentState: (purpose: string, gdprConsent: PrivacyConsentState) => ConsentState;
    getGDPRConsentState: () => GDPRConsentState;
    getCCPAConsentState: () => CCPAConsentState;
    removeGDPRConsentState: (purpose: string) => ConsentState;
    removeCCPAConsentState: () => ConsentState;
};
export declare type Product = {
    name: string;
    sku: string;
    price: number;
    quantity?: number | undefined;
    variant?: string | undefined;
    category?: string | undefined;
    brand?: string | undefined;
    position?: number | undefined;
    coupon?: string | undefined;
    attributes?: Record<string, unknown> | undefined;
};
export declare type Cart = {
    /**
     *
     * @deprecated Cart persistence in mParticle has been deprecated. Please use mParticle.eCommerce.logProductAction(mParticle.ProductActionType.AddToCart, [products])
     */
    add: (product: Product, logEventBoolean?: boolean) => void;
    /**
     *
     * @deprecated Cart persistence in mParticle has been deprecated. Please use mParticle.eCommerce.logProductAction(mParticle.ProductActionType.RemoveFromCart, [products])
     */
    remove: (product: Product, logEventBoolean?: boolean) => void;
    /**
     *
     * @deprecated Cart persistence in mParticle has been deprecated.
     */
    clear: () => void;
};
export declare type MPID = string;
export declare type User = {
    getUserIdentities: () => UserIdentities;
    getMPID: () => MPID;
    setUserTag: (tag: string) => void;
    removeUserTag: (tag: string) => void;
    setUserAttribute: (key: string, value: string) => void;
    setUserAttributes: (attributeObject: Record<string, unknown>) => void;
    removeUserAttribute: (key: string) => void;
    setUserAttributeList: (key: string, value: UserAttributesValue[]) => void;
    removeAllUserAttributes: () => void;
    getUserAttributesLists: () => Record<string, UserAttributesValue[]>;
    getAllUserAttributes: () => AllUserAttributes;
    /**
     *
     * @deprecated Cart persistence in mParticle has been deprecated
     */
    getCart: () => Cart;
    getConsentState: () => ConsentState;
    setConsentState: (ConsentState: ConsentState) => void;
    isLoggedIn: () => boolean;
    getLastSeenTime: () => number;
    getFirstSeenTime: () => number;
};
export declare type UserAttributesValue = string | number | boolean | null;
export declare type AllUserAttributes = Record<string, UserAttributesValue | UserAttributesValue[]>;
export declare type UserIdentities = {
    customerid?: string | undefined;
    email?: string | undefined;
    other?: string | undefined;
    other2?: string | undefined;
    other3?: string | undefined;
    other4?: string | undefined;
    other5?: string | undefined;
    other6?: string | undefined;
    other7?: string | undefined;
    other8?: string | undefined;
    other9?: string | undefined;
    other10?: string | undefined;
    mobile_number?: string | undefined;
    phone_number_2?: string | undefined;
    phone_number_3?: string | undefined;
    facebook?: string | undefined;
    facebookcustomaudienceid?: string | undefined;
    google?: string | undefined;
    twitter?: string | undefined;
    microsoft?: string | undefined;
    yahoo?: string | undefined;
};
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
export declare type MPConfigType = {
    isDevelopmentMode?: boolean;
    dataPlan?: {
        planId?: string;
        planVersion?: number;
    };
    identifyRequest?: any;
    logLevel?: string;
    identityCallback?: (i: IdentityResult) => void;
};
export declare type EventAttributesMap = {
    eventAttributesMap: {
        pageView: {
            url: string;
        };
    };
};
export declare type IdentityRequestAttributesMap = {
    email: {
        required: boolean;
    };
    customerId: {
        required: boolean;
    };
    mobile: {
        required: boolean;
    };
};
