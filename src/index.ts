import { registerPlugin } from '@capacitor/core';

import type { MParticleCapacitorPlugin } from './definitions';

const MParticleCapacitor = registerPlugin<MParticleCapacitorPlugin>(
  'MParticleCapacitor',
  {
    web: () => import('./web').then(m => new m.MParticleCapacitorWeb()),
  },
);

export * from './definitions';
export { MParticleCapacitor };
