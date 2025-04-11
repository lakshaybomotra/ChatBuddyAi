const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

module.exports = (async () => {
    // Get the default config first
    const config = await getDefaultConfig(__dirname);
    const { resolver: { sourceExts, assetExts } } = config;

    // Add SVG transformer configuration
    config.transformer = {
        ...config.transformer,
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    };

    // Update resolver for SVG files
    config.resolver = {
        ...config.resolver,
        assetExts: assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg'],
    };

    // Apply NativeWind and return the final config
    return withNativeWind(config, { input: './app/globals.css' });
})();