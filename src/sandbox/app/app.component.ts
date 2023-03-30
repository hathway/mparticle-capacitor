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
  public key = '';
  public developmentMode = true;
  public planID = '';
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

  protected pageViewEvent(): void {
    this.mparticleCapacitorWeb.logMParticlePageView({pageName: 'Page View', pageLink: 'testpage.com'});
  }

  protected purchaseEvent(): void {
    this.mparticleCapacitorWeb.submitPurchaseEvent({
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

  public sendEvent(eventName: string): void {
    switch(eventName) {
      case 'init':
        this.init();
      case 'login': 
        this.login();
      case 'pageView':
        this.pageViewEvent();
      case 'purchase':
        this.purchaseEvent();
      default:
        throw Error("No valid event name passed");
    }
  }
}
