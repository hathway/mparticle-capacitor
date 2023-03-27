import { WebPlugin } from '@capacitor/core';
import mParticle from '@mparticle/web-sdk';
import type { IdentityResult } from '@mparticle/web-sdk';

import type { MParticleCapacitorPlugin, MPConfigType } from './definitions';

export interface MParticleConfigArguments {
  isDevelopmentMode?: boolean;
  planID?: string;
  planVer?: number;
  planVersionRequired?: boolean;
  logLevel?: string;
  identifyRequest?: any;
  identityCallback?: (i: IdentityResult) => void;
}

export class MParticleCapacitorWeb extends WebPlugin implements MParticleCapacitorPlugin {
  public mParticle = mParticle;

  async mParticleConfig(call: MParticleConfigArguments): Promise<MPConfigType> {
    const mParticleConfig: any = {
      isDevelopmentMode: call.isDevelopmentMode,
      dataPlan: {
        planId: call.planID || 'master_data_plan',
      },
      identifyRequest: call.identifyRequest || undefined,
      logLevel: (call.logLevel == "verbose" || "warning" || "none") ? call.logLevel : "verbose",
      identityCallback: call.identityCallback || undefined,
    };
    // Plan Version is optional but we need to set a default for existing clients which expect it to default to "2"
    // if it is not passed.  Therefore we use planVersionRequired flag to determine if we can just not set it at all
    // which will cause MP to default to latest version
    if (call.planVer !== undefined && !isNaN(call.planVer)) {
      mParticleConfig.dataPlan.planVersion = call.planVer;
    } else if (call.planVersionRequired) {
      mParticleConfig.dataPlan.planVersion = 2;
    }
    return mParticleConfig;
  }

  async mParticleInit(call: { key: string, mParticleConfig: any }): Promise<any> {
    return this.mParticle.init(call.key, call.mParticleConfig as any);
  }

  async loginMParticleUser(call: { email: string, customerId?: string }): Promise<any> {
    return this.mParticle.Identity.login(this.identityRequest(call.email, call.customerId));
  }

  async logoutMParticleUser(_call: any): Promise<any> {
    const identityCallback = (result: any) => {
      if (result.getUser()) {
        console.log('logging out of mParticle', _call);
      }
    };
    return this.mParticle.Identity.logout({} as any, identityCallback);
  }

  async registerMParticleUser(call: { email: string, customerId?: string, userAttributes: any }): Promise<any> {
    return this.mParticle.Identity.login(this.identityRequest(call.email, call.customerId), function (result: any) {
      if (!result) return;
      const currentUser = result.getUser();
      for (const [key, value] of Object.entries(call.userAttributes)) {
        if (key && value) currentUser.setUserAttribute(key, value);
      }
    });
  }

  async logMParticleEvent(call: { eventName: string, eventType: any, eventProperties: any }): Promise<any> {
    return this.mParticle.logEvent(call.eventName, call.eventType, call.eventProperties);
  }

  async logMParticlePageView(call: { pageName: string, pageLink: string, overrides?: { attributeName: string }}): Promise<any> {
    let attributeName = "page";
    if (call?.overrides?.attributeName) {
      attributeName = call.overrides.attributeName;
    }
    const attributes = {[attributeName]: call.pageLink };
    return this.mParticle.logPageView(
      call.pageName,
      attributes, // pageLink comes in as window.location.toString()
      // call.googleAnalyticsValue // {"Google.Page": window.location.pathname.toString()} // if you're using Google Analytics to track page views
    );
  }

  async getAllUserAttributes(_call?: any): Promise<any> {
    return this.currentUser.getAllUserAttributes();
  }

  async setUserAttribute(call: { attributeName:string, attributeValue:string } ): Promise<any> {
    return this.currentUser?.setUserAttribute(call.attributeName, call.attributeValue);
  }

  async setUserAttributeList(call: { attributeName: string, attributeValues: any }): Promise<any> {
    return this.currentUser.setUserAttributeList(call.attributeName, call.attributeValues);
  }

  async updateMParticleCart(call: { productData: any, customAttributes: any, eventType: any }): Promise<any> {
    const productToUpdate = this.createMParticleProduct(call.productData);
    return this.logProductAction(call.eventType, productToUpdate, call.customAttributes, null, null);
  }

  async addMParticleProduct(call: { productData: any, customAttributes: any }): Promise<any> {
    const product = this.createMParticleProduct(call.productData);
    return this.logProductAction(this.mParticle.ProductActionType.AddToCart, product, call.customAttributes, null, null);
  }

  async removeMParticleProduct(call: { productData: any, customAttributes: any }): Promise<any> {
    const productToRemove = this.createMParticleProduct(call.productData);
    return this.logProductAction(this.mParticle.ProductActionType.RemoveFromCart, productToRemove, call.customAttributes, null, null);
  }

  async submitPurchaseEvent(call: { productData: any[], customAttributes: any, transactionAttributes: any }): Promise<any> {
    const productArray: any = [];
    (call.productData).forEach((element: any) => {
      productArray.push(this.createMParticleProduct(element));
    });
    return this.logProductAction(this.mParticle.ProductActionType.Purchase, productArray, call.customAttributes, call.transactionAttributes, null);
  }

  public get currentUser(): mParticle.User {
    return this.mParticle.Identity.getCurrentUser();
  }

  private identityRequest(email: string, customerId?: string): any {
    const identity: any = {
      userIdentities: {
        email
      },
    };
    if (customerId) {
      identity.userIdentities.customerid = customerId;
    }
    return identity;
  }

  private createMParticleProduct(productData: any) {
    return this.mParticle.eCommerce.createProduct(
      productData.name, //productName
      productData.sku, //productSku
      productData.cost, //productPrice
      productData.quantity,  //quantity
      undefined, // variant
      undefined, // category
      undefined, // brand
      undefined, // position
      undefined, // couponCode
      productData.attributes
    );
  }

  private logProductAction(eventType: any, product: any, customAttributes: any, transactionAttributes?: any, customFlags?: any) {
    this.mParticle.eCommerce.logProductAction(
      eventType,
      product, // product created on mparticle
      customAttributes, // mimData
      customFlags,
      transactionAttributes);
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    return options;
  }
}
