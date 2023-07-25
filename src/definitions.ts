import type { AllUserAttributes, IdentityResult } from "@mparticle/web-sdk";

import type { MParticleConfigArguments } from "./web";

export type mParticleInitListener = (info: any) => any;

export interface MParticleCapacitorPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;

  currentUser: mParticle.User;

  mParticleConfig(call: MParticleConfigArguments): Promise<MPConfigType>;
  mParticleInit(call: { key: string, mParticleConfig: any }): Promise<IdentityResult>;
  loginMParticleUser(call: { email: string, customerId?: string }): Promise<IdentityResult>;
  logoutMParticleUser(call?: any): Promise<IdentityResult>;

  getAllUserAttributes(call?: any): AllUserAttributes;

  logMParticleEvent(call: { eventName: string, eventType: any, eventProperties: any }): void;
  logMParticlePageView(call: { pageName: string, pageLink: any, overrides?: any}): void;

  // new in npm-2.1.0
  logMParticleScreenView(call: { pageName: string, pageLink: any, overrides?: any}): void;

  setUserAttribute(call: { attributeName: string, attributeValue: string }): void;
  setUserAttributeList(call: { attributeName: string, attributeValues: any }): void;
  removeUserAttribute(call: {attributeName: string}): void;

  updateMParticleCart(call: { productData: any, customAttributes: any, eventType: any }): void;
  addMParticleProduct(call: { productData: any, customAttributes: any }): void;
  removeMParticleProduct(call: { productData: any, customAttributes: any }): void;

  submitPurchaseEvent(call: { productData: any, customAttributes: any, transactionAttributes: any }): void;

  registerMParticleUser(call: { email: string, customerId?: string, userAttributes: any }): Promise<any>;
}

export enum MParticleEventType {
  Navigation = 1,
  Location = 2,
  Search = 3,
  Transaction = 4,
  UserContent = 5,
  UserPreference = 6,
  Social = 7,
  Other = 8
}

export enum MParticleProductActionType {
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
  RemoveFromWishlist = 10,
}

export type MPConfigType = {
  isDevelopmentMode?: boolean,
  dataPlan?: {
    planId?: string,
    planVersion?: number
  },
  identifyRequest?: any,
  logLevel?: string,
  identityCallback?: (i: IdentityResult) => void,
}

export interface EventAttributesMap {
  eventAttributesMap: {
    pageView: {
      url: string;
    }
  };
}

export interface IdentityRequestAttributesMap {
  email: {
    required: boolean;
  };
  customerId: {
    required: boolean;
  };
  mobile: {
    required: boolean;
  };
}
