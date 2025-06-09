import * as React from 'react';
import { View, Text, Alert } from 'react-native';
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
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  themeName,
  palette,
  styles,
  user,
  auth,
  setLoggedIn,
  setScreen,
}) => {
  if (!user) {
    // Should ideally be handled by a loading state or auth check before rendering this screen
    // For now, matching the original logic if user somehow becomes null while on this screen
    return (
      <View style={themeName === 'rocksmith' ? styles.root : { flex: 1, justifyContent: 'center' as const, alignItems: 'center' as const, backgroundColor: '#F8F4E1' }}>
        <Text style={themeName === 'rocksmith' ? { fontSize: 18, color: styles.menuButtonText.color } : { fontSize: 18, color: '#543310' }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={themeName === 'rocksmith' ? styles.root : { backgroundColor: '#F8F4E1', flex: 1, justifyContent: 'center' as const, alignItems: 'center' as const }}>
      <View style={themeName === 'rocksmith' ?
        [styles.menuButton, { backgroundColor: '#232526', padding: 32, alignItems: 'center' as const, minWidth: 320, maxWidth: 380, marginBottom:0, marginLeft:0, marginRight:0, alignSelf: 'auto' }] 
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
          minWidth: 320,
          maxWidth: 380,
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
    </View>
  );
};

export default ProfileScreen;
