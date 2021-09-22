import type { PluginListenerHandle } from '@capacitor/core';

export type mParticleInitListener = (info:any) => any;

export interface MParticleCapacitorPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  helloMP(): Promise<string>;

  mParticleInit(call:any): Promise<any>;

  addListener(
    eventName: 'mParticleInit',
    listenerFunc: mParticleInitListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
}