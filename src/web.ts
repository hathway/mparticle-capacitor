import { WebPlugin } from '@capacitor/core';
import type { MParticleCapacitorPlugin } from './definitions';
import mParticle from '@mparticle/web-sdk';

export class MParticleCapacitorWeb
  extends WebPlugin
  implements MParticleCapacitorPlugin {

    // check on this later
    // constructor() {
    //   super({
    //     name: 'MParticlePlugin',
    //     platforms: ['web']
    //   });
    // }

    
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
  
  async helloMP(): Promise<string> {
    return 'hello from mParticle';
  }

  async mParticleInit(call:any): Promise<any> {
    call.mParticleKey = 'us1-5ab5289891733e44b00e610dc69e4746';
    const mParticleConfig = {
      isDevelopmentMode: true,
      dataPlan: {
        planId: 'master_data_plan',
        planVersion: 2
      }
    };
    console.log('web MPinit',call,mParticleConfig);
    return mParticle.init(call.mParticleKey, mParticleConfig);
  }

  async logMPEvent(call:any): Promise<any> {
    console.log('event fired',call);
    return mParticle.logEvent(call.eventName, call.eventType, call.eventProperties);
  }
}

// builds without. check on later
// const MParticlePlugin = new MParticleCapacitorWeb();
 
// export { MParticlePlugin };
 
// import { registerWebPlugin } from '@capacitor/core';
// registerWebPlugin(MParticlePlugin);