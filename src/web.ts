import { WebPlugin } from '@capacitor/core';
import type { MParticleCapacitorPlugin } from './definitions';

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

  async mParticleInit(call:any): Promise<string> {
    return call;
  }
}

// builds without. check on later
// const MParticlePlugin = new MParticleCapacitorWeb();
 
// export { MParticlePlugin };
 
// import { registerWebPlugin } from '@capacitor/core';
// registerWebPlugin(MParticlePlugin);