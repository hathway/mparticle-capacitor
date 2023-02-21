import { WebPlugin } from '@capacitor/core';
import mParticle from '@mparticle/web-sdk';
import type { IdentityResult } from '@mparticle/web-sdk';

import defaultConfiguration from './config/mparticle-capacitor-web-configuration.default';
import type { MParticleCapacitorWebConfigurationInterface } from './config/mparticle-capacitor-web-configuration.interface';
import type { MParticleCapacitorPlugin, MPConfigType } from './definitions';

export class MParticleCapacitorWeb extends WebPlugin implements MParticleCapacitorPlugin {
  // This is a configuration for this library itself, not configurations to be sent to MParticle.  It will decide how the event details are mapped
  // for each client.  See mparticle-capacitor-web-configuration.default.ts for an example of the structure
  public mparticleCapacitorConfiguration: MParticleCapacitorWebConfigurationInterface = defaultConfiguration;

  // If this is never called by the integrating application, then default behavior will be determined by the file: mparticle-capacitor-web-configuration.default.ts
  // This is done to maintain backwards compatibility with existing integrators, while allowing for new integrators to customize behavior to suit their own mParticle
  // event plans.
  public setMParticleCapacitorConfiguration(config: MParticleCapacitorWebConfigurationInterface): void {
    this.mparticleCapacitorConfiguration = config;
  }

  async mParticleConfig(call: { isDevelopmentMode?: boolean, planID?: string, planVer?: number, logLevel?: string, identifyRequest?: any, identityCallback?: (i: IdentityResult) => void }): Promise<MPConfigType> {
    const mParticleConfig: any = {
      isDevelopmentMode: call.isDevelopmentMode,
      dataPlan: {
        planId: call.planID || 'master_data_plan',
      },
      identifyRequest: call.identifyRequest || undefined,
      logLevel: (call.logLevel == "verbose" || "warning" || "none") ? call.logLevel : "verbose",
      identityCallback: call.identityCallback || undefined,
    };
    // Plan Version is optional and can be passed in this function call or pulled from the default config loaded earlier through loadConfiguration()
    // default config is needed, to not break existing clients who aren't using the loadConfiguration and want the plan version to default to 2.  If
    // it is not passed to mParticle, then it will default to latest plan version.
    const planVersion = call.planVer !== undefined && !isNaN(call.planVer) ? call.planVer : this.mparticleCapacitorConfiguration.planVersion;
    if (planVersion !== undefined && typeof planVersion === 'number') {
      mParticleConfig.dataPlan.planVersion = planVersion;
    }
    return mParticleConfig;
  }

  async mParticleInit(call: { key: string, mParticleConfig: any }): Promise<any> {
    if (!this.mparticleCapacitorConfiguration) {
      this.setMParticleCapacitorConfiguration(defaultConfiguration);
    }
    return mParticle.init(call.key, call.mParticleConfig as any);
  }

  async loginMParticleUser(call: { email: string, customerId: string }): Promise<any> {
    return mParticle.Identity.login(this.identityRequest(call.email, call.customerId));
  }

  async logoutMParticleUser(_call: any): Promise<any> {
    const identityCallback = (result: any) => {
      if (result.getUser()) {
        console.log('logging out of mParticle', _call);
      }
    };
    return mParticle.Identity.logout({} as any, identityCallback);
  }

  async registerMParticleUser(call: { email: string, customerId: string, userAttributes: any }): Promise<any> {
    return mParticle.Identity.login(this.identityRequest(call.email, call.customerId), function (result: any) {
      if (!result) return;
      const currentUser = result.getUser();
      for (const [key, value] of Object.entries(call.userAttributes)) {
        if (key && value) currentUser.setUserAttribute(key, value);
      }
    });
  }

  async logMParticleEvent(call: { eventName: string, eventType: any, eventProperties: any }): Promise<any> {
    return mParticle.logEvent(call.eventName, call.eventType, call.eventProperties);
  }

  async logMParticlePageView(call: { pageName: string, pageLink: string }): Promise<any> {
    const attributes = {[ this.mparticleCapacitorConfiguration.eventAttributesMap.pageView.url]: call.pageLink };
    return mParticle.logPageView(
      call.pageName,
      attributes, // pageLink comes in as window.location.toString()
      // call.googleAnalyticsValue // {"Google.Page": window.location.pathname.toString()} // if you're using Google Analytics to track page views
    );
  }

  async getAllUserAttributes(): Promise<any> {
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
    return this.logProductAction(mParticle.ProductActionType.AddToCart, product, call.customAttributes, null, null);
  }

  async removeMParticleProduct(call: { productData: any, customAttributes: any }): Promise<any> {
    const productToRemove = this.createMParticleProduct(call.productData);
    return this.logProductAction(mParticle.ProductActionType.RemoveFromCart, productToRemove, call.customAttributes, null, null);
  }

  async submitPurchaseEvent(call: { productData: any[], customAttributes: any, transactionAttributes: any }): Promise<any> {
    const productArray: any = [];
    (call.productData).forEach((element: any) => {
      productArray.push(this.createMParticleProduct(element));
    });
    return this.logProductAction(mParticle.ProductActionType.Purchase, productArray, call.customAttributes, call.transactionAttributes, null);
  }

  public get currentUser(): mParticle.User {
    return mParticle.Identity.getCurrentUser();
  }

  private identityRequest(email: string, customerId: string): any {
    return {
      userIdentities: {
        email,
        customerid: customerId
      },
    };
  }

  private createMParticleProduct(productData: any) {
    return mParticle.eCommerce.createProduct(
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
    mParticle.eCommerce.logProductAction(
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
