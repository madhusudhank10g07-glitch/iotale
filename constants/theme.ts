
// import { Platform } from 'react-native';

// const tintColorLight = '#0a7ea4';
// const tintColorDark = '#fff';

// export const Colors = {
//   light: {
//     text: '#11181C',
//     background: '#fff',
//     tint: tintColorLight,
//     icon: '#687076',
//     tabIconDefault: '#687076',
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text: '#ECEDEE',
//     background: '#151718',
//     tint: tintColorDark,
//     icon: '#9BA1A6',
//     tabIconDefault: '#9BA1A6',
//     tabIconSelected: tintColorDark,
//   },
// };

// export const Fonts = Platform.select({
//   ios: {
//     /** iOS `UIFontDescriptorSystemDesignDefault` */
//     sans: 'system-ui',
//     /** iOS `UIFontDescriptorSystemDesignSerif` */
//     serif: 'ui-serif',
//     /** iOS `UIFontDescriptorSystemDesignRounded` */
//     rounded: 'ui-rounded',
//     /** iOS `UIFontDescriptorSystemDesignMonospaced` */
//     mono: 'ui-monospace',
//   },
//   default: {
//     sans: 'normal',
//     serif: 'serif',
//     rounded: 'normal',
//     mono: 'monospace',
//   },
//   web: {
//     sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
//     serif: "Georgia, 'Times New Roman', serif",
//     rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
//     mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
//   },
// });


// constants/Colors.ts

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// ─── Custom App Fonts (Hupaisa) ───────────────────────────────────────────────
export const Fonts = {
  regular: 'FredokaRegular',
  medium: 'FredokaMedium',
  bold: 'FredokaBold',
};

// ─── Typography Presets ────────────────────────────────────────────────────────

export const Typography = {
  h1: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    color: '#FFFFFF',
  },
  h2: {
    fontFamily: Fonts.bold,
    fontSize: 30,
    color: '#FFFFFF',
  },
  h3: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: '#FFFFFF',
  },
  bodyLarge: {
    fontFamily: Fonts.regular,
    fontSize: 18,
    color: '#FFFFFF',
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: '#FFFFFF',
  },
  bodySmall: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#FFFFFF',
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#FFFFFF',
  },
  button: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
};