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
  onStartFreeMode: (difficulty: number) => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ setScreen, styles, themeName, palette, onStartFreeMode }) => {
  const [showDifficulty, setShowDifficulty] = React.useState(false);
  const handleCampaign = () => {
    setScreen('campaign', true);
  };

  const handleFreeMode = () => {
    setShowDifficulty(true);
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
    <>
      <Menu
        onCampaign={handleCampaign}
        onFreeMode={handleFreeMode}
        onSettings={handleSettings}
        extraButtons={extraButtons}
      />

      {showDifficulty && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          zIndex: 999,
        }}>
          <View style={{
            backgroundColor: themeName === 'rocksmith' ? '#232526' : palette.card,
            borderRadius: 16,
            padding: 16,
            width: 320,
            borderWidth: themeName === 'rocksmith' ? 2 : 1,
            borderColor: themeName === 'rocksmith' ? palette.primary : palette.fretboardBorder,
          }}>
            <Text style={{ color: palette.text, fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' as const }}>Select Difficulty</Text>
            <Text style={{ color: palette.textSecondary, fontSize: 12, marginBottom: 12, textAlign: 'center' as const }}>Number of frets/positions</Text>
            <View style={{ flexDirection: 'row' as const, flexWrap: 'wrap' as const, justifyContent: 'center' as const }}>
              {[...Array(13).keys()].map((level) => (
                <Button
                  key={level}
                  style={{
                    margin: 4,
                    minWidth: 44,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: themeName === 'rocksmith' ? palette.modalBackground : palette.button,
                    borderWidth: themeName === 'rocksmith' ? 2 : 0,
                    borderColor: themeName === 'rocksmith' ? palette.primary : undefined,
                  }}
                  onPress={() => { setShowDifficulty(false); onStartFreeMode(level); }}
                >
                  <Text style={{ color: themeName === 'rocksmith' ? palette.primary : palette.buttonText, fontWeight: 'bold' }}>{level}</Text>
                </Button>
              ))}
            </View>
            <View style={{ alignItems: 'center' as const, marginTop: 8 }}>
              <Button
                style={{ backgroundColor: themeName === 'rocksmith' ? '#232526' : '#AF8F6F', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 }}
                onPress={() => setShowDifficulty(false)}
              >
                <Text style={{ color: themeName === 'rocksmith' ? '#FFD900' : '#543310', fontWeight: 'bold' }}>Cancel</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

export default MenuScreen;
