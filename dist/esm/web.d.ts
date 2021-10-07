import { WebPlugin } from '@capacitor/core';
import type { MParticleCapacitorPlugin } from './definitions';
import mParticle from '@mparticle/web-sdk';
export declare class MParticleCapacitorWeb extends WebPlugin implements MParticleCapacitorPlugin {
    mParticleInit(call: any): Promise<any>;
    logMParticleEvent(call: any): Promise<any>;
    logMParticlePageView(call: any): Promise<any>;
    get currentUser(): mParticle.User;
    setUserAttribute(call: any): Promise<any>;
    echo(options: {
        value: string;
    }): Promise<{
        value: string;
    }>;
    helloMP(): Promise<string>;
}
