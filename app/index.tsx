import * as React from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as ScreenOrientation from 'expo-screen-orientation'
import "../app.css";
import Fretboard from "./components/Fretboard";
import Button from "../components/ui/button";
import Menu from "./components/Menu";
import Campaign from "./components/Campaign";
import GenDotList, { ManualDotPosition } from "./components/DotPositions";
import { NoteDot } from "./components/DotPositions";
import LoginScreen from '../LoginScreen';
import { onAuthStateChanged, Auth } from "firebase/auth";
import { auth } from "../firebase";
import Settings from "./components/Settings";

export const screenOptions = {
  headerShown: false,
}
const frets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const strings = [1, 2, 3, 4, 5, 6]
const NOTE_NAMES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
// Force light mode for the app

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F4E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fretboardContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F8F4E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: '#AF8F6F',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 48,
    alignSelf: 'center',
    marginLeft: 50,
    marginRight: 50,
  },
  menuButtonText: {
    color: '#543310',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answerBar: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 24,
    backgroundColor: '#AF8F6F',
    width: '100%',
  },
  resultText: {
    color: '#543310',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  noteButton: {
    margin: 4,
    backgroundColor: '#74512D',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  noteButtonText: {
    color: '#F8F4E1',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// Animated feedback component for result icon
const AnimatedFeedback: React.FC<{ resultMessage: string | null }> = ({ resultMessage }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const textOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if ("✅" === resultMessage || "❌" === resultMessage) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 12,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 380,
          delay: 62000,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing( textOpacity, {
        toValue: 1,
        delay: 100,
        useNativeDriver: true,
      }).start()   
    }
  }, [resultMessage])

  if (!resultMessage) return null;
  return (
    <Animated.View style={{
      position: 'absolute',
      top: '45%',
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 100,
      opacity,
      pointerEvents: 'none',
    }}>
      {resultMessage === '✅' ? (
        <View style={{
          backgroundColor: 'rgba(58,125,58,0.07)',
          borderRadius: 999,
          paddingHorizontal: 28,
          paddingVertical: 14,
        }}>
          <Icon name="check" size={56} color="#00C853" />
        </View>
      ) : resultMessage === '❌' ? (
        <View style={{
          backgroundColor: 'rgba(178,34,34,0.07)',
          borderRadius: 999,
          paddingHorizontal: 28,
          paddingVertical: 14,
        }}>
          
          <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#FF1744', textAlign: 'center' }}>✖</Text>
        </View>
      ) : resultMessage ? (
        <View style={{
          backgroundColor: 'rgba(0, 0, 0, 0.07)',
          borderRadius: 999,
          paddingHorizontal: 28,
          paddingVertical: 14,
        }}>
          <Text style={{ fontSize: 56, fontWeight: 'bold', color: 'red', textAlign: 'center' }}>{resultMessage}</Text>
        </View>
      ) 
      : null }
    </Animated.View>
  )
}

export default function Screen() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [authChecked, setAuthChecked] = React.useState(false);
  const [screen, setScreen] = React.useState<'menu' | 'campaign' | 'free' | 'settings' | 'profile'>('menu');
  // Free mode state (always defined, only used when in free mode)
  const [difficulty, setDifficulty] = React.useState(0);
  const [fretboardHeight, setFretboardHeight] = React.useState(140);
  const [manualMode, setManualMode] = React.useState(false);
  const [manualString, setManualString] = React.useState(0); // First string (High E, 0-indexed, at the top)
  const [manualFret, setManualFret] = React.useState(0);    // First fret
  const [verticalOffset, setVerticalOffset] = React.useState(0); // No additional offset by default
  const [horizontalOffset, setHorizontalOffset] = React.useState(0); // Horizontal offset
  const [noteDot, setNoteDot] = React.useState<NoteDot>(
    manualMode 
      ? ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
      : GenDotList(fretboardHeight, strings.length, difficulty)
  );
  const [resultMessage, setResultMessage] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0);
  const [numberOfPositions, setNumberOfPositions] = React.useState(30)
  const [unlockedLevel, setUnlockedLevel] = React.useState(1);
  const [campaignMode, setCampaignMode] = React.useState(true)
  const [selectedLevel, setSelectedLevel] = React.useState(1)
  const SetLevel = (level: number) => {
    setDifficulty(level - 1);
    setScreen('free');
    setNumberOfPositions(5)
    setScore(0)
    setSelectedLevel(level)
  }

React.useEffect(() => {
  if (numberOfPositions === 0) {
    const passed = score > 27
    const baseMessage = `Final Score: ${score}/30`

    if (passed) {
      let message = baseMessage

      if (selectedLevel === unlockedLevel) {
        setUnlockedLevel(prev => prev + 1)
        message += ` — You unlocked level ${unlockedLevel + 1}`
      }

      setResultMessage(message);
    } else {
      setResultMessage(`${baseMessage} — Try again to get at least 27 points`)
    }
  }
}, [numberOfPositions])


  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
      setLoggedIn(!!user)
      setAuthChecked(true);
    })
    return unsubscribe
  }, [])


  if (!authChecked) {
    // Optionally show a loading spinner here
    return null;
  }

  if (!loggedIn) {
    return <LoginScreen onLoginSuccess={() => setLoggedIn(true)} />;
  }

  if (screen === 'campaign'){
    return (
      <Campaign
        onBack={() => {
          setScreen('menu')
          setNumberOfPositions(30)
          setScore(0)
        }}
        onLevelSelect={SetLevel}
        unlockedLevel={unlockedLevel}
      />
    );
  }

  if (screen === 'settings') {
    return (
      <Settings 
        onBack={() => setScreen('menu')} 
        manualMode={manualMode}
        setManualMode={setManualMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
    );
  }

  if (screen === 'free') {
    return (
      <View style={styles.root}>
        <View style={styles.fretboardContainer}>
          {/* Floating Menu/Reset Buttons - Top Left */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, position: 'absolute', top: 8, left: 8, zIndex: 11 }}>
            {campaignMode && (
            <Button style={[styles.menuButton, { minWidth: 80, paddingVertical: 6, paddingHorizontal: 12, height: undefined, alignItems: 'center', justifyContent: 'center' }]} onPress={() => setScreen('campaign')}>
              <Text style={[styles.menuButtonText, { fontSize: 16 }]} numberOfLines={1} adjustsFontSizeToFit>Menu</Text>
            </Button>   
            )}
            {!campaignMode && (
              <Button style={[styles.menuButton, { minWidth: 80, paddingVertical: 6, paddingHorizontal: 12, height: undefined, alignItems: 'center', justifyContent: 'center' }]} onPress={() => {
                setScreen('menu');
                setNumberOfPositions(30);
                setScore(0);
              }}
              >
                <Text style={[styles.menuButtonText, { fontSize: 16 }]} numberOfLines={1} adjustsFontSizeToFit>Menu</Text>
              </Button>
            )}
            {!campaignMode && (
              <Button style={[styles.menuButton, { minWidth: 80, paddingVertical: 6, paddingHorizontal: 12, height: undefined, alignItems: 'center', justifyContent: 'center' }]} onPress={() => {
              setNoteDot(GenDotList(fretboardHeight, strings.length, difficulty));
              setScore(0);
              setNumberOfPositions(30);
            }}>
              <Text style={[styles.menuButtonText, { fontSize: 16 }]} numberOfLines={1} adjustsFontSizeToFit>{"Reset"}</Text>
            </Button>
            )}
          </View>
          {/* Score display in top right corner */}
          <View style={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            backgroundColor: '#74512D',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#543310',
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 20
          }}>
            <Text style={{ 
              color: "#F8F4E1", 
              fontWeight: "bold", 
              fontSize: 14 
            }}>
              Score: {score}/{30}
            </Text>
          </View>
          {/* Overlay result message in the middle of the screen */}
          {/* Animated feedback icon */}
          <AnimatedFeedback resultMessage={resultMessage} />
          {/* UI for manual dot positioning */}
          {manualMode && (
            <View style={{
              flexDirection: 'column', // Stack vertically for better fit
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 6,
              gap: 6,
              padding: 6,
              backgroundColor: '#AF8F6F',
              borderRadius: 8,
              width: '98%', // Max width for mobile
              alignSelf: 'center',
            }}>
              <View style={{ alignItems: 'center', width: '100%' }}>
                <Text style={{ color: '#543310', marginBottom: 3, fontSize: 14 }}>Manual Position</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                  <Button
                    style={{ backgroundColor: manualMode ? '#543310' : '#74512D', padding: 8, minWidth: 80 }}
                    onPress={() => {
                      setManualMode(!manualMode);
                      // Update dot position based on new mode
                      setNoteDot(
                        !manualMode 
                          ? ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
                          : GenDotList(fretboardHeight, strings.length, difficulty )
                      );
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>{manualMode ? 'On' : 'Off'}</Text>
                  </Button>
                </View>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#543310', marginBottom: 5 }}>String</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newString = Math.max(0, manualString - 1);
                      setManualString(newString);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, newString, manualFret, verticalOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>-</Text>
                  </Button>
                  <Text style={{ color: '#543310', marginHorizontal: 10, fontWeight: 'bold' }}>{manualString + 1}</Text>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newString = Math.min(strings.length - 1, manualString + 1);
                      setManualString(newString);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, newString, manualFret, verticalOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>+</Text>
                  </Button>
                </View>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#543310', marginBottom: 5 }}>Fret</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newFret = Math.max(0, manualFret - 1);
                      setManualFret(newFret);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, manualString, newFret, verticalOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>-</Text>
                  </Button>
                  <Text style={{ color: '#543310', marginHorizontal: 10, fontWeight: 'bold' }}>{manualFret}</Text>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newFret = Math.min(12, manualFret + 1);
                      setManualFret(newFret);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, manualString, newFret, verticalOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>+</Text>
                  </Button>
                </View>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#543310', marginBottom: 5 }}>Vertical Offset</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newOffset = verticalOffset - 2; // Move up by 2px
                      setVerticalOffset(newOffset);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, newOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>↑</Text>
                  </Button>
                  <Text style={{ color: '#543310', marginHorizontal: 10, fontWeight: 'bold' }}>{verticalOffset}</Text>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newOffset = verticalOffset + 2; // Move down by 2px
                      setVerticalOffset(newOffset);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, newOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>↓</Text>
                  </Button>
                </View>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#543310', marginBottom: 5 }}>Horizontal Offset</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newOffset = horizontalOffset - 2; // Move left by 2px
                      setHorizontalOffset(newOffset);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, newOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>←</Text>
                  </Button>
                  <Text style={{ color: '#543310', marginHorizontal: 10, fontWeight: 'bold' }}>{horizontalOffset}</Text>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newOffset = horizontalOffset + 2; // Move right by 2px
                      setHorizontalOffset(newOffset)
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, newOffset))
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>→</Text>
                  </Button>
                </View>
              </View>
            </View>
          )}
          {/* Answer bar (note buttons) */}
          <View style={[styles.answerBar, { position: 'absolute', left: 0, right: 0, bottom: 0, margin: 0, borderRadius: 0, zIndex: 20 }]}> 
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 2 }}>
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginBottom: 2 }}>
                Guesses left: {numberOfPositions} | Current Note: {noteDot[2]} | String: {noteDot[3]+1} Fret: {noteDot[4]}
              </Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: 'center' }}>
              {NOTE_NAMES.map(note => (
                <Button
                  disabled={numberOfPositions === 0}
                  key={note}
                  onPress={() => {
                    if (noteDot[2] === note) {
                      setResultMessage("✅");
                      setNoteDot(
                        manualMode 
                          ? ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
                          : GenDotList(fretboardHeight, strings.length, difficulty)
                      );
                      setScore(score + 1);
                      setNumberOfPositions(numberOfPositions - 1);
                    } else {
                      setResultMessage("❌");
                      setNoteDot(
                        manualMode 
                          ? ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
                          : GenDotList(fretboardHeight, strings.length, difficulty)
                      );
                      setNumberOfPositions(numberOfPositions - 1);
                    }
                  }}
                  style={styles.noteButton}
                >
                  <Text style={styles.noteButtonText}>{note}</Text>
                </Button>
              ))}
            </View>
          </View>
          {/* Fretboard, slightly bigger height for better fit */}
          <View style={{ flexShrink: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
            <Fretboard frets={frets} strings={strings} fretboardHeight={170} noteDot={noteDot} difficulty={difficulty} />
          </View>
        </View>
      </View>
    );
  }

  // Profile screen
  if (screen === 'profile') {
    const user = auth.currentUser;
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F4E1' }]}> 
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 24,
          padding: 32,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.10,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
          minWidth: 320,
          maxWidth: 380,
        }}>
          {/* Profile avatar/icon */}
          <View style={{
            width: 80, height: 80, borderRadius: 40, backgroundColor: '#AF8F6F',
            alignItems: 'center', justifyContent: 'center', marginBottom: 18, borderWidth: 2, borderColor: '#74512D',
          }}>
            <Text style={{ fontSize: 40, color: '#F8F4E1', fontWeight: 'bold' }}>
              {user?.email ? user.email[0].toUpperCase() : 'U'}
            </Text>
          </View>
          {/* Profile title */}
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#543310', marginBottom: 10, letterSpacing: 1 }}>User Profile</Text>
          {/* Display name */}
          <Text style={{ fontSize: 20, color: '#543310', fontWeight: '600', marginBottom: 8, backgroundColor: '#F8F4E1', padding: 8, borderRadius: 8 }}>
            {user?.displayName || 'No display name set'}
          </Text>
          {/* Email */}
          <Text style={{ fontSize: 18, color: '#74512D', marginBottom: 24, fontWeight: '600', backgroundColor: '#F8F4E1', padding: 8, borderRadius: 8 }}>
            {user?.email || 'N/A'}
          </Text>
          <Button
            style={{ backgroundColor: "#74512D", padding: 14, borderRadius: 12, width: 180, marginTop: 4, shadowColor: '#74512D', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }}
            onPress={() => {
              import('react-native').then(({ Alert }) => {
                Alert.alert(
                  'Log out',
                  'Are you sure you want to log out?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Log out', style: 'destructive', onPress: async () => {
                        const { signOut } = await import('firebase/auth');
                        await signOut(auth);
                        setLoggedIn(false);
                        setScreen('menu');
                      }
                    },
                  ]
                );
              });
            }}
          >
            <Text style={{ color: "#F8F4E1", fontWeight: "bold", fontSize: 18 }}>Logout</Text>
          </Button>
          <Button
            style={{ backgroundColor: "#AF8F6F", padding: 14, borderRadius: 12, width: 180, marginTop: 16, shadowColor: '#74512D', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }}
            onPress={() => setScreen('menu')}
          >
            <Text style={{ color: "#543310", fontWeight: "bold", fontSize: 18 }}>Back to Menu</Text>
          </Button>
        </View>
      </View>
    );
  }

      // Default to menu
      return (
        <Menu
          onCampaign={() => {
        setScreen('campaign');
        setCampaignMode(true);
      }}
          onFreeMode={() => { 
        setScreen('free')
        setCampaignMode(false);
      }}
          onSettings={() => setScreen('settings')}
          // Add a Profile button to the menu
          extraButtons={
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <Button
                style={{ backgroundColor: "#AF8F6F", padding: 12, borderRadius: 8, minWidth: 110 }}
                onPress={() => setScreen('profile')}
              >
                <Text style={{ color: "#543310", fontWeight: "bold" }}>Profile</Text>
              </Button>
              <Button
                style={{ backgroundColor: "#b22222", padding: 12, borderRadius: 8, minWidth: 110 }}
                onPress={() => {
                  import('react-native').then(({ Alert }) => {
                    Alert.alert(
                      'Exit',
                      'Are you sure you want to exit the app?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Exit', style: 'destructive', onPress: () => {
                            // On mobile, use BackHandler.exitApp(); on web, show a message
                            import('react-native').then(({ BackHandler, Platform }) => {
                              if (Platform.OS === 'android') {
                                BackHandler.exitApp();
                              } else {
                                Alert.alert('Exit', 'Exit is only available on Android devices.');
                              }
                            });
                          }
                        },
                      ]
                    );
                  });
                }}
              >
                <Text style={{ color: "#F8F4E1", fontWeight: "bold" }}>Exit</Text>
              </Button>
            </View>
          }
        />
      );
    }