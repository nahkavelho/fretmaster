import * as React from 'react';
import { View, Text, Alert, ScrollView, useWindowDimensions, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User as FirebaseUser, Auth, signOut } from 'firebase/auth';
import Button from '../../components/ui/button'; // Adjusted path
import { ThemeName, ThemePalette } from '../ThemeContext'; // Adjusted path

interface ProfileScreenProps {
  themeName: ThemeName;
  palette: ThemePalette;
  styles: any; // Consider a more specific type
  user: FirebaseUser | null;
  auth: Auth;
  setLoggedIn: (loggedIn: boolean) => void;
  setScreen: (screen: string) => void;
  bestScores: Record<string, number>;
  unlockedLevel: number;
  userStats: { totalTimeSeconds: number; bestStreak: number; recentSessions: Array<{ ts: number; mode: 'campaign'|'free'; level?: number|null; score: number; durationSec: number; streak: number }> };
  onResetProgress: () => Promise<void>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  themeName,
  palette,
  styles,
  user,
  auth,
  setLoggedIn,
  setScreen,
  bestScores,
  unlockedLevel,
  userStats,
  onResetProgress,
}) => {
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= 600;
  const cardWidth = Math.min(width * 0.92, isTablet ? 560 : 420);
  if (!user) {
    // Should ideally be handled by a loading state or auth check before rendering this screen
    // For now, matching the original logic if user somehow becomes null while on this screen
    return (
      <View style={themeName === 'rocksmith' ? styles.root : { flex: 1, justifyContent: 'center' as const, alignItems: 'center' as const, backgroundColor: '#F8F4E1' }}>
        <Text style={themeName === 'rocksmith' ? { fontSize: 18, color: styles.menuButtonText.color } : { fontSize: 18, color: '#543310' }}>Loading profile...</Text>
      </View>
    );
  }

  // Compute simple progress aggregates
  const levelKeys = Object.keys(bestScores || {});
  const completedLevels = levelKeys.length;
  const totalCorrect = levelKeys.reduce((sum, k) => sum + (typeof bestScores[k] === 'number' ? bestScores[k] : 0), 0);
  const bestScore = levelKeys.reduce((max, k) => Math.max(max, bestScores[k] || 0), 0);
  const avgScore = completedLevels ? Math.round((totalCorrect / completedLevels) * 10) / 10 : 0;
  const topThree = levelKeys
    .map((k) => ({ level: Number(k), score: bestScores[k] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const totalTimeMinutes = Math.floor((userStats?.totalTimeSeconds || 0) / 60);
  const formatTs = (ts: number) => {
    try {
      const d = new Date(ts);
      return d.toLocaleString();
    } catch {
      return String(ts);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeName === 'rocksmith' ? styles.root?.backgroundColor || '#181A1B' : '#F8F4E1' }}>
      {Platform.OS === 'android' && (
        <StatusBar backgroundColor={themeName === 'rocksmith' ? '#232526' : '#F8F4E1'} barStyle={themeName === 'rocksmith' ? 'light-content' : 'dark-content'} />
      )}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center', paddingVertical: 24 }}>
      <View style={themeName === 'rocksmith' ?
        [styles.menuButton, { backgroundColor: '#232526', padding: 32, alignItems: 'center' as const, width: cardWidth, marginBottom:0, marginLeft:0, marginRight:0, alignSelf: 'auto' }] 
        :
        {
          backgroundColor: '#E0C097',
          borderRadius: 16,
          padding: 32,
          alignItems: 'center' as const,
          shadowColor: '#000',
          shadowOpacity: 0.10,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
          width: cardWidth,
        }
      }>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: themeName === 'rocksmith' ? '#3a3d3e' : '#AF8F6F',
          alignItems: 'center' as const, justifyContent: 'center' as const, marginBottom: 18, borderWidth: 2,
          borderColor: themeName === 'rocksmith' ? (styles.menuButton?.borderColor || '#FFD900') : '#74512D',
        }}>
          <Text style={{ fontSize: 40, color: themeName === 'rocksmith' ? (styles.menuButtonText?.color || '#FFD900') : '#F8F4E1', fontWeight: 'bold' }}>
            {user?.email ? user.email[0].toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: themeName === 'rocksmith' ? (styles.menuButtonText?.color || '#FFD900') : '#543310', marginBottom: 10, letterSpacing: 1 }}>User Profile</Text>
        <Text style={{
          fontSize: 20,
          color: palette.text,
          fontWeight: '600',
          marginBottom: 8,
          backgroundColor: themeName === 'rocksmith' ? 'transparent' : '#F8F4E1',
          paddingVertical: 8, 
          paddingHorizontal: 12, 
          borderRadius: 8,
          textAlign: themeName === 'rocksmith' ? 'center' : 'left' as const, 
          minWidth: 200, 
        }}>
          {user?.displayName || 'No display name set'}
        </Text>
        <Text style={{
          fontSize: 18,
          color: themeName === 'rocksmith' ? '#DDDDDD' : palette.textSecondary,
          fontWeight: '600',
          marginBottom: 24,
          backgroundColor: themeName === 'rocksmith' ? 'transparent' : '#F8F4E1',
          paddingVertical: 8, 
          paddingHorizontal: 12, 
          borderRadius: 8,
          textAlign: themeName === 'rocksmith' ? 'center' : 'left' as const, 
          minWidth: 200, 
        }}>
          {user?.email || 'N/A'}
        </Text>

        {/* Progress Section */}
        <View style={{ width: '100%', marginTop: 8, marginBottom: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: themeName === 'rocksmith' ? (styles.menuButtonText?.color || '#FFD900') : '#543310', marginBottom: 10 }}>Progress</Text>
          <View style={{
            backgroundColor: themeName === 'rocksmith' ? '#2b2e2f' : '#F8F4E1',
            borderRadius: 12,
            padding: 12,
            borderWidth: themeName === 'rocksmith' ? 1 : 1,
            borderColor: themeName === 'rocksmith' ? '#3a3d3e' : '#d8c7b3',
          }}>
            <Text style={{ color: palette.text, fontSize: 16, marginBottom: 6 }}>Levels unlocked: <Text style={{ fontWeight: 'bold' }}>{unlockedLevel}</Text></Text>
            <Text style={{ color: palette.text, fontSize: 16, marginBottom: 6 }}>Levels with a score: <Text style={{ fontWeight: 'bold' }}>{completedLevels}</Text></Text>
            <Text style={{ color: palette.text, fontSize: 16, marginBottom: 6 }}>Total correct notes: <Text style={{ fontWeight: 'bold' }}>{totalCorrect}</Text></Text>
            <Text style={{ color: palette.text, fontSize: 16, marginBottom: 6 }}>Best single level score: <Text style={{ fontWeight: 'bold' }}>{bestScore}/30</Text></Text>
            <Text style={{ color: palette.text, fontSize: 16, marginBottom: 6 }}>Average score: <Text style={{ fontWeight: 'bold' }}>{avgScore}</Text></Text>
            <Text style={{ color: palette.text, fontSize: 16, marginBottom: 6 }}>Total time played: <Text style={{ fontWeight: 'bold' }}>{totalTimeMinutes} min</Text></Text>
            <Text style={{ color: palette.text, fontSize: 16 }}>Best streak: <Text style={{ fontWeight: 'bold' }}>{userStats?.bestStreak || 0}</Text></Text>
          </View>
        </View>

        

        {/* Recent Sessions */}
        <View style={{ width: '100%', marginTop: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: themeName === 'rocksmith' ? (styles.menuButtonText?.color || '#FFD900') : '#543310', marginBottom: 10 }}>Recent Sessions</Text>
          {(!userStats?.recentSessions || userStats.recentSessions.length === 0) ? (
            <Text style={{ color: palette.textSecondary }}>No recent sessions.</Text>
          ) : (
            userStats.recentSessions.map((s, idx) => (
              <View key={idx} style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: themeName === 'rocksmith' ? '#3a3d3e' : '#d8c7b3' }}>
                <Text style={{ color: palette.text }}>{formatTs(s.ts)} — {s.mode === 'campaign' ? `Level ${s.level}` : 'Free'} — Score {s.score}/30 — {s.durationSec}s — Streak {s.streak}</Text>
              </View>
            ))
          )}
        </View>
        <Button
          style={themeName === 'rocksmith' ?
            [styles.menuButton, { width: 180, marginTop: 4, marginBottom: 8, marginLeft:0, marginRight:0, alignSelf: 'auto' }] 
            :
            { backgroundColor: "#74512D", padding: 14, borderRadius: 12, width: 180, marginTop: 4, shadowColor: '#74512D', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }
          }
          onPress={() => {
            Alert.alert(
              'Log out',
              'Are you sure you want to log out?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Log out',
                  style: 'destructive',
                  onPress: async () => {
                    await signOut(auth);
                    setLoggedIn(false);
                    setScreen('menu');
                  }
                },
              ]
            );
          }}
        >
          <Text style={themeName === 'rocksmith' ? styles.menuButtonText : { color: "#F8F4E1", fontWeight: "bold", fontSize: 18 }}>Logout</Text>
        </Button>

        {/* Reset Progress */}
        <Button
          style={themeName === 'rocksmith' ?
            [styles.menuButton, { width: 200, marginTop: 8, marginBottom: 8, marginLeft:0, marginRight:0, alignSelf: 'auto' }]
            :
            { backgroundColor: "#b22222", padding: 14, borderRadius: 12, width: 200, marginTop: 12, shadowColor: '#b22222', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }
          }
          onPress={() => {
            Alert.alert(
              'Reset Progress',
              'This will clear your best scores, stats, and set unlocked level to 1. Continue?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: async () => { await onResetProgress(); } },
              ]
            )
          }}
        >
          <Text style={{ color: '#F8F4E1', fontWeight: 'bold', fontSize: 16 }}>Reset Progress</Text>
        </Button>
        <Button
          style={themeName === 'rocksmith' ?
            [styles.menuButton, { width: 180, marginTop: 8, marginBottom: 0, marginLeft:0, marginRight:0, alignSelf: 'auto' }] 
            :
            { backgroundColor: "#AF8F6F", padding: 14, borderRadius: 12, width: 180, marginTop: 16, shadowColor: '#74512D', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }
          }
          onPress={() => setScreen('menu')}
        >
          <Text style={themeName === 'rocksmith' ? styles.menuButtonText : { color: "#543310", fontWeight: "bold", fontSize: 18 }}>Back to Menu</Text>
        </Button>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
