/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component } from '@angular/core';

import type { MParticleCapacitorWebConfigurationInterface } from '../../config/mparticle-capacitor-web-configuration.interface';
import type { MParticleCapacitorWeb } from '../../web';
// import mParticle from '@mparticle/web-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public apiKey = '';
  public developmentMode = true;
  public planId = '';
  public logLevel = '';
  public planVersion = '';

  public constructor(
    public mparticleCapacitorWeb: MParticleCapacitorWeb
  ) {}

  protected async init(): Promise<void> {
    const mParticleCapacitorConfiguration: MParticleCapacitorWebConfigurationInterface = {
      eventAttributesMap: {
        pageView: {
          url: "url"
        }
      },
      identityRequestAttributesMap: {
        email: {
          required: true
        },
        customerId: {
          required: true
        },
        mobile: {
          required: false
        }
      }
    };
    if (!isNaN(parseInt(this.planVersion, 10))) {
      mParticleCapacitorConfiguration.planVersion = parseInt(this.planVersion, 10);
    }
    this.mparticleCapacitorWeb.setMParticleCapacitorConfiguration(mParticleCapacitorConfiguration);
    const mpConfig = await this.mparticleCapacitorWeb.mParticleConfig({
      isDevelopmentMode: this.developmentMode,
      planID: this.planId,
      planVer: parseInt(this.planVersion, 10),
      logLevel: this.logLevel
    });
    await this.mparticleCapacitorWeb.mParticleInit({key: this.apiKey, mParticleConfig:mpConfig });
  }

  protected async login(): Promise<void> {
    await this.mparticleCapacitorWeb.loginMParticleUser({email: "testuser.123@bounteous.com", customerId: ''});
  }

  protected async logout(): Promise<void> {
    await this.mparticleCapacitorWeb.logoutMParticleUser({});
  }

  protected async pageViewEvent(): Promise<void> {
    await this.mparticleCapacitorWeb.logMParticlePageView({pageName: 'Test Page', pageLink: 'testpage.com'});
  }

  protected async purchaseEvent(): Promise<void> {
    await this.mparticleCapacitorWeb.submitPurchaseEvent({
      productData: [{
        name: 'Test Product',
        sku: '0123456789',
        cost: 2,
        quantity: 3,
        attributes: {}
      }],
      customAttributes: {
        af_currency: 'USD',
        purchase_source: 'Mparticle Capacitor - Development Sandbox',
        time_placed: Date.now()
      },
      transactionAttributes: {}
    });
  }

  public sendEvent(eventName: string): Promise<void> {
    switch(eventName) {
      case 'init':
        return this.init();
      case 'login': 
        return this.login();
      case 'pageView':
        return this.pageViewEvent();
      case 'purchase':
        return this.purchaseEvent();
      default:
        return new Promise((_, reject) => {
          reject("No valid event name passed");
        });
    }
  }
}
