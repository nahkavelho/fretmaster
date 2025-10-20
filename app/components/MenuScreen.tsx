import * as React from 'react';
import { View, Text, Alert, BackHandler, Platform, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button'; // Path to root components/ui/button
import Menu from './Menu'; // Path to components/Menu
import { UI_SIZES } from './uiConstants'; // Path to components/uiConstants
import { ThemeName, ThemePalette } from '../ThemeContext'; // Path to app/ThemeContext

interface MenuScreenProps {
  setScreen: (screen: string, campaignMode?: boolean) => void;
  styles: any; // Consider a more specific type based on getGlobalStyles
  themeName: ThemeName;
  palette: ThemePalette; // Added palette for direct use if needed
  onStartFreeMode: (difficulty: number, timeSeconds: number | null) => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ setScreen, styles, themeName, palette, onStartFreeMode }) => {
  const [showDifficulty, setShowDifficulty] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState<number | null>(null); // null = No Timer
  const [selectedLevel, setSelectedLevel] = React.useState<number>(1); // Level 1-46
  
  const getLevelColor = (level: number) => {
    // Acoustic theme: Vibrant warm tones
    const acousticColors = [
      '#A67C1B', '#B8861F', '#CA9023', '#DC9A27', '#E6A82E', '#F0B636', '#F5C03E',
      '#EFAA46', '#E9944E', '#E37E56', '#DD685E', '#D75F66', '#D1566E', '#CB4D76',
      '#C0527E', '#B55786', '#AA5C8E', '#A46496', '#9E6C9E', '#9874A6', '#927CAE',
      '#8C84B6', '#8690BE', '#8098C6', '#7AA0CE', '#74A8D6', '#6EB0DE', '#68B8E6',
      '#6BBFD4', '#6EC6C2', '#71CDB0', '#74D49E', '#79D588', '#7ED672', '#83D75C',
      '#8CD854', '#95D94C', '#9EDA44', '#A7DB3C', '#B0DC34', '#B9DD2C', '#C2DE24',
      '#CADA38', '#D2D64C', '#DAD260', '#E2CE74', '#EDD899'
    ];
    
    // Rocksmith theme: Cool muted gradient
    const rocksmithColors = [
      '#5ba35b', '#65a85f', '#6fad63', '#79b267', '#83b76b', '#8dbc6f', '#97c173',
      '#a1c677', '#abcb7b', '#b5c87f', '#bfc583', '#c9c287', '#d3bf8b', '#d3b88f',
      '#d3b193', '#d3aa97', '#d3a39b', '#d39c9f', '#cd95a3', '#c78ea7', '#c187ab',
      '#bb80af', '#b579b3', '#af7bb7', '#a97dbb', '#a37fbf', '#9d81c3', '#9783c7',
      '#9185cb', '#8b87cf', '#858acd', '#7f8dcb', '#7990c9', '#7393c7', '#6d96c5',
      '#6799c3', '#619cc1', '#5b9fbf', '#5fa2bd', '#63a5bb', '#67a8b9', '#6babb7',
      '#6faeb5', '#73b1b3', '#77b4b1', '#c9b775'
    ];
    
    const colors = themeName === 'acoustic' ? acousticColors : rocksmithColors;
    return colors[level - 1] || colors[0];
  };
  
  const getLevelDescription = (level: number) => {
    const descriptions: Record<number, string> = {
      1: 'Low E: Part 1', 2: 'Low E: Part 2', 3: 'Low E: Parts 1-2', 4: 'Low E: Part 3',
      5: 'Low E: Part 4', 6: 'Low E: Parts 3-4', 7: 'Low E: Complete',
      8: 'A: Part 1', 9: 'A: Part 2', 10: 'A: Parts 1-2', 11: 'A: Part 3',
      12: 'A: Part 4', 13: 'A: Parts 3-4', 14: 'A: Complete', 15: 'E + A Combined',
      16: 'D: Part 1', 17: 'D: Part 2', 18: 'D: Parts 1-2', 19: 'D: Part 3',
      20: 'D: Part 4', 21: 'D: Parts 3-4', 22: 'D: Complete',
      23: 'G: Part 1', 24: 'G: Part 2', 25: 'G: Parts 1-2', 26: 'G: Part 3',
      27: 'G: Part 4', 28: 'G: Parts 3-4', 29: 'G: Complete', 30: 'D + G Combined',
      31: 'B: Part 1', 32: 'B: Part 2', 33: 'B: Parts 1-2', 34: 'B: Part 3',
      35: 'B: Part 4', 36: 'B: Parts 3-4', 37: 'B: Complete',
      38: 'High E: Part 1', 39: 'High E: Part 2', 40: 'High E: Parts 1-2', 41: 'High E: Part 3',
      42: 'High E: Part 4', 43: 'High E: Parts 3-4', 44: 'High E: Complete',
      45: 'B + High E Combined', 46: 'Master: All Strings'
    };
    return descriptions[level] || 'Unknown';
  };
  const handleCampaign = () => {
    setScreen('campaign', true);
  };

  const handleFreeMode = () => {
    setShowDifficulty(true);
  };

  const handleSettings = () => {
    setScreen('settings');
  };

  const handleReference = () => {
    setScreen('reference');
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
        style={themeName === 'rocksmith' 
          ? 
          [menuButtonStyle, { marginBottom: 0, marginLeft:0, marginRight:0, paddingHorizontal: UI_SIZES.menuButtonPaddingHorizontal / 2, paddingVertical: UI_SIZES.menuButtonPaddingVertical / 2, minWidth: 110 }] 
          : 
          { backgroundColor: "#AF8F6F", padding: 12, borderRadius: 8, minWidth: 110 }
        }
        onPress={handleExit}
      >
        <Text style={themeName === 'rocksmith' ? menuButtonTextStyle : { color: "#543310", fontWeight: "bold" }}>Exit</Text>
      </Button>
    </View>
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {Platform.OS === 'android' && (
        <StatusBar backgroundColor={themeName === 'rocksmith' ? '#232526' : palette.background} barStyle={themeName === 'rocksmith' ? 'light-content' : 'dark-content'} />
      )}
      <Menu
        onCampaign={handleCampaign}
        onFreeMode={handleFreeMode}
        onSettings={handleSettings}
        onReference={handleReference}
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
            borderRadius: 18,
            padding: 16,
            width: 340,
            borderWidth: themeName === 'rocksmith' ? 1 : 1,
            borderColor: themeName === 'rocksmith' ? palette.primary : palette.fretboardBorder,
            shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 8,
          }}>
            <Text style={{ color: palette.text, fontSize: 18, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' as const }}>Select Level</Text>
            <Text style={{ color: palette.textSecondary, fontSize: 12, marginBottom: 8, textAlign: 'center' as const }}>Practice any campaign level with custom time</Text>
            
            {/* Level selector with left/right buttons */}
            <View style={{ flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, marginBottom: 12 }}>
              <Button
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: themeName === 'rocksmith' ? palette.modalBackground : palette.card,
                  borderWidth: 1,
                  borderColor: getLevelColor(selectedLevel),
                  marginRight: 8,
                }}
                onPress={() => setSelectedLevel(Math.max(1, selectedLevel - 1))}
              >
                <Text style={{ color: palette.text, fontSize: 20, fontWeight: 'bold' }}>←</Text>
              </Button>
              
              <View style={{
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: getLevelColor(selectedLevel),
                minWidth: 140,
                alignItems: 'center' as const,
              }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Level {selectedLevel}</Text>
                <Text style={{ color: '#fff', fontSize: 13, marginTop: 3, fontWeight: '600' }}>{getLevelDescription(selectedLevel)}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>{selectedLevel}/46</Text>
              </View>
              
              <Button
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: themeName === 'rocksmith' ? palette.modalBackground : palette.card,
                  borderWidth: 1,
                  borderColor: getLevelColor(selectedLevel),
                  marginLeft: 8,
                }}
                onPress={() => setSelectedLevel(Math.min(46, selectedLevel + 1))}
              >
                <Text style={{ color: palette.text, fontSize: 20, fontWeight: 'bold' }}>→</Text>
              </Button>
            </View>

            <Text style={{ color: palette.text, fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 6, textAlign: 'center' as const }}>Time Per Guess (Optional)</Text>
            <View style={{ flexDirection: 'row' as const, justifyContent: 'center' as const, flexWrap: 'wrap' as const }}>
              {[
                { label: 'No Timer', value: null },
                { label: '3s', value: 3 },
                { label: '5s', value: 5 },
                { label: '8s', value: 8 },
              ].map((opt) => {
                const isActive = selectedTime === opt.value;
                return (
                  <Button
                    key={String(opt.value)}
                    style={{
                      margin: 4,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      backgroundColor: isActive ? (themeName === 'rocksmith' ? palette.primary : '#2ecc40') : (themeName === 'rocksmith' ? '#1b1d1e' : palette.modalBackground),
                      borderWidth: themeName === 'rocksmith' ? 1 : 1,
                      borderColor: themeName === 'rocksmith' ? palette.primary : palette.fretboardBorder,
                    }}
                    onPress={() => setSelectedTime(opt.value as number | null)}
                  >
                    <Text style={{ color: isActive ? (themeName === 'rocksmith' ? '#232526' : '#fff') : palette.text, fontWeight: 'bold' }}>{opt.label}</Text>
                  </Button>
                );
              })}
            </View>
            <View style={{ flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, marginTop: 12 }}>
              <Button
                style={{ backgroundColor: getLevelColor(selectedLevel), borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24, marginRight: 6 }}
                onPress={() => { setShowDifficulty(false); onStartFreeMode(selectedLevel - 1, selectedTime); }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Start Practice</Text>
              </Button>
              <Button
                style={{ backgroundColor: themeName === 'rocksmith' ? '#232526' : '#AF8F6F', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24, marginLeft: 6 }}
                onPress={() => setShowDifficulty(false)}
              >
                <Text style={{ color: themeName === 'rocksmith' ? '#FFD900' : '#543310', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default MenuScreen;
