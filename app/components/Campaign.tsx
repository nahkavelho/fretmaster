import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Button from "../../components/ui/button";
import { FontAwesome5 } from '@expo/vector-icons';

interface CampaignProps {
  score: number;
  onBack: () => void
  onLevelSelect: (level: number) => void
  unlockedLevel: number
}

const LEVEL_COUNT = 36;
const QUESTS = Array.from({ length: LEVEL_COUNT }, (_, i) => ({ id: i + 1, name: `Level ${i + 1}` }));

const getStyles = (themeName: ThemeName, palette: ThemePalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    color: palette.text,
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
    color: palette.textSecondary,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 18,
  },
  backButton: {
    backgroundColor: palette.button, // Or a more specific palette color if available
    paddingHorizontal: 48,
    paddingVertical: 20,
    borderRadius: 12,
    alignSelf: 'center',
    minWidth: 200,
    marginBottom: 24,
  },
  backButtonText: {
    color: palette.buttonText, // Or a more specific palette color if available
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconStyle: { // Added for icon color
    color: palette.icon,
  }
});

import { ThemeContext, ThemeName, ThemePalette } from '../ThemeContext'; // Added ThemeName and ThemePalette

const Campaign: React.FC<CampaignProps> = ({ onBack, onLevelSelect, unlockedLevel, score }) => {
  const { themeName, palette } = React.useContext(ThemeContext);
  const styles = getStyles(themeName, palette); // Call getStyles
  const getLevelColor = React.useCallback((level: number) => {
    if (level >= 1 && level <= 12) return '#2ecc40'; // Green - Beginner
    if (level >= 13 && level <= 24) return '#FFC107'; // Yellow - Intermediate
    return '#FF5555'; // Red - Advanced (25–36)
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campaign</Text>
      <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 32, paddingBottom: 32 }}>
        {QUESTS.map((quest, idx) => (
          <View key={quest.id} style={[styles.questRow, { marginBottom: idx === QUESTS.length - 1 ? 0 : 32 }, quest.id > unlockedLevel ? { opacity: 0.5 } : {} ] }>
            <TouchableOpacity
              disabled={quest.id > unlockedLevel}
              onPress={() => { onLevelSelect(quest.id); }}
              activeOpacity={0.8}
              style={{ padding: 8 }}
            >
              <FontAwesome5 name="guitar" size={48} color={getLevelColor(quest.id)} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={quest.id > unlockedLevel}
              onPress={() => { onLevelSelect(quest.id); }}
              activeOpacity={0.8}
              style={{ paddingVertical: 8, paddingHorizontal: 4 }}
            >
              <Text style={[styles.questText, { color: getLevelColor(quest.id) }]}>{quest.name}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Button onPress={onBack} style={styles.backButton} >
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </Button>
    </View>
  );
};

export default Campaign;