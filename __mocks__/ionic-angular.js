// Stub for @ionic/angular — keeps Jest from trying to parse @ionic/core native ESM.
// FusePlatformService injects Platform with @Optional(), so null is safe.
module.exports = {
  Platform: class Platform {
    is() { return false; }
    ready() { return Promise.resolve('dom'); }
  },
};
