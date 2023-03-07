import { describe, it, beforeEach, vi } from 'vitest'

import { MParticleCapacitorWeb } from "./web";

const mockMParticle = {
  init: vi.fn(),
  logPageView: vi.fn()
};

describe.concurrent('MParticleCapacitorWeb', () => {
  let mp;
  const key = "";
  const mpConfig = {
    isDevelopmentMode: true,
    planID: "test_app",
    logLevel: "verbose",
  };
  beforeEach(() => {
    mp = new MParticleCapacitorWeb();
    mp.mParticle = mockMParticle;
  });

  it.concurrent('builds configuration with default plan version when plan version not passed and plan version is required', async (expect) => {
    const config = await mp.mParticleConfig({
      ...mpConfig,
      planVersionRequired: true,
    });
    expect.expect(config.dataPlan.planVersion).toEqual(2);
  });

  it.concurrent('builds configuration without plan version when plan version not passed and plan version is not required', async (expect) => {
    const config = await mp.mParticleConfig({
      ...mpConfig,
      planVersionRequired: false,
    });
    expect.expect(config.dataPlan.planVersion).toBeUndefined();
  });

  it.concurrent('sends pageView event url with attribute name "page" when no override is passed', async (expect) => {
    const call = {
      pageName: "test page",
      pageLink: "www.test.com",
    };
    await mp.mParticleInit(key, mpConfig);
    const logMParticlePageView = vi.spyOn(mp.mParticle, "logPageView");
    await mp.logMParticlePageView(call);
    expect.expect(logMParticlePageView).toBeCalledWith(call.pageName, {page: call.pageLink});
  });

  it.concurrent('sends pageView event url with specified attribute name when override is passed', async (expect) => {
    const call = {
      pageName: "test page",
      pageLink: "www.test.com",
      overrides: {
        attributeName: "testAttr"
      }
    };
    await mp.mParticleInit(key, mpConfig);
    const logMParticlePageView = vi.spyOn(mp.mParticle, "logPageView");
    await mp.logMParticlePageView(call);
    expect.expect(logMParticlePageView).toBeCalledWith(call.pageName, {[call.overrides.attributeName]: call.pageLink});
  });
})