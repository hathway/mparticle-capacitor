declare module "@capacitor/core" {
  interface PluginRegistry {
    MParticlePlugin: MParticleCapacitorPlugin;
  }
}

export interface MParticleCapacitorPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  helloMP(): Promise<string>;
}
