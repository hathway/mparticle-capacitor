import { WebPlugin } from '@capacitor/core';
import type { MParticleCapacitorPlugin } from './definitions';
import mParticle from '@mparticle/web-sdk';

export class MParticleCapacitorWeb
  extends WebPlugin
  implements MParticleCapacitorPlugin {

  async mParticleInit(call: { key:string, production:boolean } ): Promise<any> {
    const mParticleConfig = {
      isDevelopmentMode: !call.production || true,
      dataPlan: {
        planId: 'master_data_plan',
        planVersion: 2
      }
    };
    return mParticle.init(call.key, mParticleConfig);
  }

  async loginMParticleUser(call: { email:string, customerId:string } ): Promise<any> {
    return mParticle.Identity.login(this.identityRequest(call.email, call.customerId));
  }

  async logoutMParticleUser(_call:any): Promise<any>{
    const identityCallback = (result:any) => {
      if (result.getUser()) {
        // console.log('logging out of mParticle',_call);
      }
    };
    return mParticle.Identity.logout(<any>{}, identityCallback);
  }

  async registerMParticleUser(call: { email:string, customerId:string, userAttributes:any } ): Promise<any> {
    return mParticle.Identity.login(this.identityRequest(call.email, call.customerId), function(result:any) {
      if (!result) return;
      let currentUser = result.getUser();
      for (let [key, value] of Object.entries(call.userAttributes)) {
        if (key && value) currentUser.setUserAttribute(key, value);
      }      
    });
  }

  async logMParticleEvent(call: { eventName:string, eventType:any, eventProperties:any } ): Promise<any> {
    return mParticle.logEvent(call.eventName, call.eventType, call.eventProperties);
  }

  async logMParticlePageView(call: { pageName:string, pageLink:string } ): Promise<any> {
    return mParticle.logPageView(
      call.pageName,
      { page: call.pageLink }, // pageLink comes in as window.location.toString()
      // call.googleAnalyticsValue // {"Google.Page": window.location.pathname.toString()} // if you're using Google Analytics to track page views
    ); 
  }

  async setUserAttribute(call: { attributeName:string, attributeValue:string } ): Promise<any> {
    return this.currentUser.setUserAttribute(call.attributeName, call.attributeValue);
  }

  async setUserAttributeList(call: { attributeName:string, attributeValues:any } ): Promise<any> {
    return this.currentUser.setUserAttributeList(call.attributeName, call.attributeValues);
  }

  async updateMParticleCart(call: { productData:any, customAttributes:any, eventType:any } ): Promise<any> {
    const productToUpdate = this.createMParticleProduct(call.productData);
    return this.logProductAction(call.eventType, productToUpdate, call.customAttributes, null, null);
  }

  async addMParticleProduct(call: { productData:any, customAttributes:any } ): Promise<any> { 
    const product = this.createMParticleProduct(call.productData);
    return this.logProductAction(mParticle.ProductActionType.AddToCart, product, call.customAttributes, null, null);
  }

  async removeMParticleProduct(call: { productData:any, customAttributes:any } ): Promise<any> {
    const productToRemove = this.createMParticleProduct(call.productData);
    return this.logProductAction(mParticle.ProductActionType.RemoveFromCart, productToRemove, call.customAttributes, null, null);
  } 

  async submitPurchaseEvent(call: { productData:any, customAttributes:any, transactionAttributes:any } ): Promise<any>{
    let productArray:any = [];
    (call.productData).forEach((element:any) => {
      productArray.push(this.createMParticleProduct(element));
    });
    return this.logProductAction(mParticle.ProductActionType.Checkout,  productArray, call.customAttributes, call.transactionAttributes, null);
  }

  public get currentUser() {
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

  private logProductAction(eventType:any, product:any, customAttributes:any, transactionAttributes?:any, customFlags?:any) {
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
