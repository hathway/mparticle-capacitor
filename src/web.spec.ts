import { describe, it, beforeEach, vi } from 'vitest'

import { MParticleCapacitorWeb } from "./web";

const mockMParticle = {
  init: (call) => {
    return new Promise((resolve, reject) => {
      resolve(call);
    })
  }
};

describe.concurrent('MParticleCapacitorWeb', () => {
  let mp;
  const key = "";
  beforeEach(() => {
    mp = new MParticleCapacitorWeb();
    mp.mParticle = mockMParticle;
  });
  it.concurrent('loads passed configuration object', async (expect) => {
    const config = {
      planVersion: 1,
      eventAttributesMap: {
        pageView: {
          url: "testUrl"
        },
      }
    };
    mp.setMParticleCapacitorConfiguration(config);
    expect.expect(mp.mparticleCapacitorConfiguration).to.equal(config);

  });

  it.concurrent('builds configuration with default plan version when plan version not passed', async (expect) => {
    const input = {
      test: "123",
      other: "abc"
    };
    const config = await mp.mParticleConfig(input);
    expect.expect(config.dataPlan.planVersion).toEqual(2);
  });

  it.concurrent('builds configuration with default plan version when plan version not passed', async (expect) => {
    const input = {
      test: "123",
      other: "abc",
      planVer: 99
    };
    const config = await mp.mParticleConfig(input);
    expect.expect(config.dataPlan.planVersion).toEqual(99);
  });

  it.concurrent('sends init request with supplied plan version', async (expect) => {
    const config = {
      planVersion: 100,
      eventAttributesMap: {
        pageView: {
          url: "testUrl"
        },
      }
    };
    mp.setMParticleCapacitorConfiguration(config);

    const initSpy = vi.spyOn(mp.mParticle, "init");
    const mParticleConfig = await mp.mParticleConfig({
      isDevelopmentMode: true
    });
    expect.expect(mParticleConfig.dataPlan.planVersion).toEqual(100);
    const call = {
      key,
      mParticleConfig
    };
    await mp.mParticleInit(call);
    expect.expect(initSpy).toHaveBeenCalledOnce();
    expect.expect(initSpy).toHaveBeenCalledWith(key, mParticleConfig);
  });
})