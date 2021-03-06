if (process.env.VITE_APP_VERSION === undefined) {
  const now = new Date;
  process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${now.getUTCMonth() + 1}.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  "appId": "com.laravel-sqlens.app",
  "productName": "Laravel SQLens",
  directories: {
    output: "dist",
    buildResources: "buildResources",
  },
  files: [
    "packages/**/dist/**",
    "buildResources/icon.png",
  ],
  "win": {
    "target": [{ "target": "nsis" }, { "target": "portable" }],
    "publisherName": "Muhammad Faiz",
    "rfc3161TimeStampServer": "http://timestamp.digicert.com",
  },
  "nsis": {
    "artifactName": "laravel-sqlens.setup.${version}.${ext}",
  },
  "portable": {
    "artifactName": "laravel-sqlens.portable.${version}.${ext}",
  },
  "mac": {
    "target": "dmg",
    "type": "distribution",
    "artifactName": "laravel-sqlens.setup.${version}.${ext}",
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
  },
  "dmg": {
    "sign": false,
  },
  "linux": {
    "target": [
      {
        "target": "AppImage",
      },
      {
        "target": "snap",
      },
      {
        "target": "deb",
      },
      {
        "target": "rpm",
      },
    ],
    "category": "Development",
    "icon": "buildResources",
    "artifactName": "laravel-sqlens-${version}.${ext}",
    "desktop": {
      "Name": "Laravel SQLens",
      "Type": "Application",
      "Categories": "Development",
    },
  },
};

module.exports = config;
