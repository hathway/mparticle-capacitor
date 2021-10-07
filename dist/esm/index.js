import { registerPlugin } from '@capacitor/core';
const MParticleCapacitor = registerPlugin('MParticleCapacitor', {
    web: () => import('./web').then(m => new m.MParticleCapacitorWeb()),
});
export * from './definitions';
export { MParticleCapacitor };
//# sourceMappingURL=index.js.map