import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import Button from "../../components/ui/button";
import { FontAwesome5 } from '@expo/vector-icons';

interface CampaignProps {
  score: number;
  onBack: () => void
  onLevelSelect: (level: number) => void
  unlockedLevel: number
}

const LEVEL_COUNT = 12;
const QUESTS = Array.from({ length: LEVEL_COUNT }, (_, i) => ({ id: i + 1, name: `Level ${i + 1}` }));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4E1',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    color: '#543310',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 32,
    textAlign: 'center',
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  questText: {
    color: '#74512D',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 18,
  },
  backButton: {
    backgroundColor: '#AF8F6F',
    paddingHorizontal: 48,
    paddingVertical: 20,
    borderRadius: 12,
    alignSelf: 'center',
    minWidth: 200,
    marginBottom: 24,
  },
  backButtonText: {
    color: '#543310',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  landscapeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F4E1',
  }
});

import { ThemeContext } from '../_layout';

const Campaign: React.FC<CampaignProps> = ({ onBack, onLevelSelect, unlockedLevel, score }) => {
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    const unlockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    };

    lockOrientation();

    return () => {
      unlockOrientation();
    };
  }, []);
  const { theme } = React.useContext(ThemeContext);
  const bgColor = theme === 'rocksmith' ? '#181A1B' : '#F8F4E1';
  const titleColor = theme === 'rocksmith' ? '#FFD900' : '#543310';
  const questTextColor = theme === 'rocksmith' ? '#FFD900' : '#74512D';
  const iconColor = theme === 'rocksmith' ? '#FFD900' : '#543310';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }] }>
      <Text style={[styles.title, { color: titleColor }]}>Campaign</Text>
      <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 32, paddingBottom: 32 }}>
        {QUESTS.map((quest, idx) => (
          <View key={quest.id} style={[styles.questRow, { marginBottom: idx === QUESTS.length - 1 ? 0 : 32 }, quest.id > unlockedLevel ? { opacity: 0.5 } : {} ] }>
            <TouchableOpacity
              disabled={quest.id > unlockedLevel}
              onPress={() => { onLevelSelect(quest.id); }}
              activeOpacity={0.8}
              style={{ padding: 8 }}
            >
              <FontAwesome5 name="guitar" size={48} color={iconColor} />
            </TouchableOpacity>
            <Text style={[styles.questText, { color: questTextColor }]}>{quest.name}</Text>
          </View>
        ))}
      </ScrollView>
      <Button onPress={onBack} style={{ marginTop: 16 }}>
        <Text style={{ color: theme === 'rocksmith' ? '#FFD900' : '#543310', fontWeight: 'bold', fontSize: 18 }}>Back to Menu</Text>
      </Button>
    </View>
  );
};

export default Campaign;