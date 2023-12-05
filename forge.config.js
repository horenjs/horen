// eslint-disable-next-line no-undef
module.exports = {
  packagerConfig: {
    ignore: [
      /^\/app$/,
      /^\/bin$/,
      /^\/node_modules$/,
      /^\/scripts$/,
      /^\/\.eslintrc\.js$/,
      /^\/\.gitattributes$/,
      /^\/\.gitignore$/,
      /^\/\.prettierrc\.js$/,
      /^\/forge\.config\.js$/,
      /^\/pnpm-lock\.yaml$/,
      /^\/pnpm-workspace\.yaml$/
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
