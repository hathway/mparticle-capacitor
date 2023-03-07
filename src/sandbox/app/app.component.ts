/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component } from '@angular/core';

import { MParticleCapacitorWeb } from '../../web';

// @TODO:
// 1. add ability in the UI to supply overrides(page/url), and the user email, they need their own input fields
// 2. display the payload we send to mparticle in UI

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public key = 'us2-3d4baeb0eb1ccf4d89c6f4ca1b63d430';
  public developmentMode = true;
  public planID = 'web_app_sdk';
  public logLevel = '';
  public planVersion = '';
  public planVersionRequired = false;

  public constructor(
    public mparticleCapacitorWeb: MParticleCapacitorWeb
  ) {}

  protected async init(): Promise<void> {
    const { key, planID, planVersionRequired, logLevel, planVersion } = this;
    const config: any = {
      isDevelopmentMode: this.developmentMode,
      planID,
      planVersionRequired,
      logLevel
    };
    if (!isNaN(parseInt(planVersion, 10))) {
      config.planVer = planVersion;
    }
    const mpConfig = await this.mparticleCapacitorWeb.mParticleConfig(config);
    await this.mparticleCapacitorWeb.mParticleInit({key, mParticleConfig:mpConfig });
  }

  protected async login(): Promise<void> {
    await this.mparticleCapacitorWeb.loginMParticleUser({email: "testuser.123@bounteous.com", customerId: ''});
  }

  protected async logout(): Promise<void> {
    await this.mparticleCapacitorWeb.logoutMParticleUser({});
  }

  protected async pageViewEvent(): Promise<void> {
    await this.mparticleCapacitorWeb.logMParticlePageView({pageName: 'Page View', pageLink: 'testpage.com'});
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
