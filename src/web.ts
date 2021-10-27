import { WebPlugin } from '@capacitor/core';
import type { MParticleCapacitorPlugin } from './definitions';
import mParticle from '@mparticle/web-sdk';
// @ts-ignore
import mParticleBraze from '@mparticle/web-appboy-kit';

export class MParticleCapacitorWeb
  extends WebPlugin
  implements MParticleCapacitorPlugin {

  async mParticleInit(call:any): Promise<any> {
    call.mParticleKey = call.key;
    const mParticleConfig = {
      isDevelopmentMode: true,
      dataPlan: {
        planId: 'master_data_plan',
        planVersion: 2
      }
    };
    console.log('web MPinit',call,mParticleConfig,mParticleBraze);
    mParticleBraze.register(mParticleConfig);
    return mParticle.init(call.mParticleKey, mParticleConfig);
  }

  async loginMParticleUser(call:any): Promise<any> {
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

  async logMParticleEvent(call:any): Promise<any> {
    console.log('event fired',call);
    return mParticle.logEvent(call.eventName, call.eventType, call.eventProperties);
  }

  async logMParticlePageView(call:any): Promise<any> {
    console.log(mParticle,call);
    return mParticle.logPageView(
      call.pageName,
      { page: call.pageLink }, // pageLink comes in as window.location.toString()
      // call.googleAnalyticsValue // {"Google.Page": window.location.pathname.toString()} // if you're using Google Analytics to track page views
    ); 
  }

  async setUserAttribute(call:any): Promise<any> {
    return this.currentUser.setUserAttribute(call.attributeName, call.attributeValue);
  }

  async setUserAttributeList(call:any): Promise<any> {
    return this.currentUser.setUserAttributeList(call.attributeName, call.attributeValues);
  }

  async getUserAttributeLists(_call:any): Promise<any> {
    console.log("0w",this.currentUser.getAllUserAttributes())
    console.log("1w",this.currentUser.getUserAttributesLists())
    return this.currentUser.getUserAttributesLists();
  }

  async updateMParticleCart(call:any): Promise<any> {
    const productToUpdate = this.createMParticleProduct(call.product);
    return this.logProductAction(call.eventType, productToUpdate, call.customAttributes, null, null);
  }

  async addMParticleProduct(call:any): Promise<any> { 
    const product = this.createMParticleProduct(call.productData);
    return this.logProductAction(mParticle.ProductActionType.AddToCart, product, call.customAttributes, null, null);
  }

  async removeMParticleProduct(call:any): Promise<any> {
    const productToRemove = this.createMParticleProduct(call.product);
    return this.logProductAction(mParticle.ProductActionType.RemoveFromCart, productToRemove, call.customAttributes, null, null);
  } 

  async submitPurchaseEvent(call:any): Promise<any>{
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
    console.log('ECHO', options);
    return options;
  }
  
  async helloMP(): Promise<string> {
    return 'hello from mParticle';
  }

}
