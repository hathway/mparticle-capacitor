import { WebPlugin } from '@capacitor/core';
import type { MParticleCapacitorPlugin } from './definitions';
import mParticle from '@mparticle/web-sdk';
// @ts-ignore
import mParticleBraze from '@mparticle/web-appboy-kit';

export class MParticleCapacitorWeb
  extends WebPlugin
  implements MParticleCapacitorPlugin {

  async mParticleInit(call:any): Promise<any> {
    call.mParticleKey = 'us1-5ab5289891733e44b00e610dc69e4746';
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

  async logoutMParticleUser(call?:any): Promise<any>{
    const identityCallback = (result:any) => {
      if (result.getUser()) {
        console.log('logging out of mParticle',call);
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

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
  
  async helloMP(): Promise<string> {
    return 'hello from mParticle';
  }

}
