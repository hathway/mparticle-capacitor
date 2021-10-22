import type { PluginListenerHandle } from '@capacitor/core';
export declare type mParticleInitListener = (info: any) => any;
export interface MParticleCapacitorPlugin {
    echo(options: {
        value: string;
    }): Promise<{
        value: string;
    }>;
    helloMP(): Promise<string>;
    mParticleInit(call: any): Promise<any>;
    logMParticleEvent(call: any): Promise<any>;
    logMParticlePageView(call: any): Promise<any>;
    setUserAttribute(call: any): Promise<any>;
    setUserAttributeList(call: any): Promise<any>;
    getUserAttributeLists(_call: any): Promise<any>;
    updateMParticleCart(call: any): Promise<any>;
    addMParticleProduct(call: any): Promise<any>;
    removeMParticleProduct(call: any): Promise<any>;
    loginMParticleUser(call: any): Promise<any>;
    logoutMParticleUser(call?: any): Promise<any>;
    addListener(eventName: 'mParticleInit', listenerFunc: mParticleInitListener): Promise<PluginListenerHandle> & PluginListenerHandle;
}
export declare enum MParticleEventType {
    Navigation = 1,
    Location = 2,
    Search = 3,
    Transaction = 4,
    UserContent = 5,
    UserPreference = 6,
    Social = 7,
    Other = 8
}
