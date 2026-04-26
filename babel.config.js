module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // Reanimated 4 emits `import.meta` syntax; enable Expo's built-in
          // transform so the web bundle stays valid in classic browser scripts.
          unstable_transformImportMeta: true,
        },
      ],
    ],
  };
};
