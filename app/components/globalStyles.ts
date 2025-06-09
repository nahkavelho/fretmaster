import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeName, ThemePalette } from '../ThemeContext'; // Adjust path if ThemeContext is not in ../
import { UI_SIZES } from './uiConstants'; // Importing from the same directory

export const getGlobalStyles = (themeName: ThemeName, palette: ThemePalette) => {
  const styleConfig = {
    root: {
      flex: 1,
      backgroundColor: palette.background,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    } as ViewStyle,
    fretboardContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: palette.background, // Use main screen background
    } as ViewStyle,
    menuButton: {
      borderColor: palette.primary,
      backgroundColor: palette.button,
      padding: 10,
      marginVertical: 5,
      borderRadius: 5,
      alignItems: 'center' as const,
    } as ViewStyle,
    menuButtonText: {
      color: palette.buttonText,
      fontSize: 16,
      fontWeight: 'bold',
    } as TextStyle,
    answerBar: {
      height: UI_SIZES.answerBarHeight,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      gap: UI_SIZES.answerBarGap,
      padding: UI_SIZES.answerBarPadding,
      backgroundColor: palette.answerBarBackground,
      borderTopWidth: 3,
      borderColor: palette.answerBarBorderColor,
      borderRadius: 20,
      shadowColor: palette.answerBarShadowColor,
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
      width: '100%',
    } as ViewStyle,
    resultText: {
      color: palette.resultTextColor,
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 6,
    } as TextStyle,
    noteButton: {
      margin: UI_SIZES.noteButtonMargin,
      minWidth: UI_SIZES.noteButtonMinWidth,
      minHeight: UI_SIZES.noteButtonMinHeight,
      backgroundColor: palette.noteButtonBackground,
      borderColor: palette.noteButtonBorderColor,
      borderWidth: 2,
      borderRadius: UI_SIZES.noteButtonBorderRadius,
      paddingHorizontal: UI_SIZES.noteButtonPaddingHorizontal,
      paddingVertical: UI_SIZES.noteButtonPaddingVertical,
    } as ViewStyle,
    noteButtonText: {
      color: palette.noteButtonText,
      fontWeight: 'bold',
      fontSize: UI_SIZES.noteButtonFontSize,
    } as TextStyle,
  };
  return StyleSheet.create(styleConfig);
};
