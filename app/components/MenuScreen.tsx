import * as React from 'react';
import { View, Text, Alert, BackHandler, Platform, StyleSheet } from 'react-native';
import Button from '../../components/ui/button'; // Path to root components/ui/button
import Menu from './Menu'; // Path to components/Menu
import { UI_SIZES } from './uiConstants'; // Path to components/uiConstants
import { ThemeName, ThemePalette } from '../ThemeContext'; // Path to app/ThemeContext

interface MenuScreenProps {
  setScreen: (screen: string, campaignMode?: boolean) => void;
  styles: any; // Consider a more specific type based on getGlobalStyles
  themeName: ThemeName;
  palette: ThemePalette; // Added palette for direct use if needed
}

const MenuScreen: React.FC<MenuScreenProps> = ({ setScreen, styles, themeName, palette }) => {
  const handleCampaign = () => {
    setScreen('campaign', true);
  };

  const handleFreeMode = () => {
    setScreen('free', false);
  };

  const handleSettings = () => {
    setScreen('settings');
  };

  const handleProfile = () => {
    setScreen('profile');
  };

  const handleExit = () => {
    Alert.alert(
      'Exit',
      'Are you sure you want to exit the app?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            if (Platform.OS === 'android') {
              BackHandler.exitApp();
            } else {
              Alert.alert('Exit', 'Exit is only available on Android devices.');
            }
          },
        },
      ]
    );
  };

  // Accessing specific styles from the passed 'styles' prop
  const menuButtonStyle = styles.menuButton; 
  const menuButtonTextStyle = styles.menuButtonText;

  const extraButtons = (
    <View style={{ flexDirection: 'row' as const, gap: 12, marginTop: 16 }}>
      <Button
        style={themeName === 'rocksmith' 
          ? 
          [menuButtonStyle, { marginBottom: 0, marginLeft:0, marginRight:0, paddingHorizontal: UI_SIZES.menuButtonPaddingHorizontal / 2, paddingVertical: UI_SIZES.menuButtonPaddingVertical / 2, minWidth: 110 }] 
          : 
          { backgroundColor: "#AF8F6F", padding: 12, borderRadius: 8, minWidth: 110 }
        }
        onPress={handleProfile}
      >
        <Text style={themeName === 'rocksmith' ? menuButtonTextStyle : { color: "#543310", fontWeight: "bold" }}>Profile</Text>
      </Button>
      <Button
        style={{ backgroundColor: "#b22222", padding: 12, borderRadius: 8, minWidth: 110 }}
        onPress={handleExit}
      >
        <Text style={{ color: "#F8F4E1", fontWeight: "bold" }}>Exit</Text>
      </Button>
    </View>
  );

  return (
    <Menu
      onCampaign={handleCampaign}
      onFreeMode={handleFreeMode}
      onSettings={handleSettings}
      extraButtons={extraButtons}
    />
  );
};

export default MenuScreen;
