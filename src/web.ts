import { WebPlugin } from '@capacitor/core';
import mParticle from '@mparticle/web-sdk';

import type { AllUserAttributes, IdentityResult, MParticleCapacitorPlugin, MPConfigType, Product, User } from './definitions';

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

  public mParticleInit(call: { key: string, mParticleConfig: any }): Promise<IdentityResult> {
    return new Promise((resolve, reject) => {
      call.mParticleConfig.identityCallback = (result: IdentityResult) => {
        resolve(result);
      };
      try {
        this.mParticle.init(
          call.key,
          { ...call.mParticleConfig as any }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  public loginMParticleUser(call: { email: string, customerId?: string }): Promise<{value: string}> {
    return new Promise((resolve, reject) => {
      try {
        this.mParticle.Identity.login(this.identityRequest(call.email, call.customerId), (result: IdentityResult) => {
          resolve({value: result.getUser().getMPID()});
        });
      } catch (e) {
        reject(e);
      }
    })
  }

  public logoutMParticleUser(_call?: any): Promise<IdentityResult> {
    return new Promise((resolve, reject) => {
      try {
        this.mParticle.Identity.logout({} as any, (result) => {
          resolve(result);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public registerMParticleUser(call: { email: string, customerId?: string, userAttributes: any }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mParticle.Identity.login(this.identityRequest(call.email, call.customerId), (result) => {
        if (!result) {
          reject();
        }
        const currentUser = result.getUser();
        for (const [key, value] of Object.entries(call.userAttributes)) {
          if (key && value) currentUser.setUserAttribute(key, (value as any).toString());
        }
        resolve(result);
      });
    });
  }

  public logMParticleEvent(call: { eventName: string, eventType: any, eventProperties: any }): void {
    this.mParticle.logEvent(call.eventName, call.eventType, call.eventProperties);
  }

  public logMParticlePageView(call: { pageName: string, pageLink: string, overrides?: { attributeName: string }}): void {
    let attributeName = "page";
    if (call?.overrides?.attributeName) {
      attributeName = call.overrides.attributeName;
    }
    const attributes = {[attributeName]: call.pageLink };
    this.mParticle.logPageView(
      call.pageName,
      attributes, // pageLink comes in as window.location.toString()
      // call.googleAnalyticsValue // {"Google.Page": window.location.pathname.toString()} // if you're using Google Analytics to track page views
    );
  }

  public getAllUserAttributes(_call?: any): AllUserAttributes {
    return this.currentUser.getAllUserAttributes();
  }

  public setUserAttribute(call: { attributeName:string, attributeValue:string } ): void {
    this.currentUser?.setUserAttribute(call.attributeName, call.attributeValue);
  }

  public setUserAttributeList(call: { attributeName: string, attributeValues: any }): void {
    this.currentUser?.setUserAttributeList(call.attributeName, call.attributeValues);
  }

  public removeUserAttribute(call: { attributeName: string }): void {
    this.currentUser?.removeUserAttribute(call.attributeName);
  }

  public updateMParticleCart(call: { productData: any, customAttributes: any, eventType: any }): void {
    const productToUpdate = this.createMParticleProduct(call.productData);
    this.logProductAction(call.eventType, productToUpdate, call.customAttributes, null, null);
  }

  public addMParticleProduct(call: { productData: any, customAttributes: any }): void {
    const product = this.createMParticleProduct(call.productData);
    this.logProductAction(this.mParticle.ProductActionType.AddToCart, product, call.customAttributes, null, null);
  }

  public removeMParticleProduct(call: { productData: any, customAttributes: any }): void {
    const productToRemove = this.createMParticleProduct(call.productData);
    this.logProductAction(this.mParticle.ProductActionType.RemoveFromCart, productToRemove, call.customAttributes, null, null);
  }

  public submitPurchaseEvent(call: { productData: any[], customAttributes: any, transactionAttributes: any }): void {
    const productArray: any = [];
    (call.productData).forEach((element: any) => {
      productArray.push(this.createMParticleProduct(element));
    });
    this.logProductAction(this.mParticle.ProductActionType.Purchase, productArray, call.customAttributes, call.transactionAttributes, null);
  }

  public get currentUser(): User {
    return this.mParticle.Identity.getCurrentUser();
  }

  protected identityRequest(email: string, customerId?: string): any {
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

  protected createMParticleProduct(productData: any): Product {
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

  protected logProductAction(eventType: any, product: any, customAttributes: any, transactionAttributes?: any, customFlags?: any): void {
    this.mParticle.eCommerce.logProductAction(
      eventType,
      product, // product created on mparticle
      customAttributes, // mimData
      customFlags,
      transactionAttributes);
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    return new Promise((resolve) => resolve(options));
  }
}
