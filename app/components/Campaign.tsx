import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Button from "../../components/ui/button";
import { FontAwesome5 } from '@expo/vector-icons';

interface CampaignProps {
  score: number;
  onBack: () => void
  onLevelSelect: (level: number) => void
  unlockedLevel: number
  bestScores: Record<string, number>
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
    width: '92%',
    marginBottom: 16,
  },
  levelCard: {
    backgroundColor: palette.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.noteButtonBorderColor,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  levelRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  questText: {
    color: palette.textSecondary,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  sectionHeaderContainer: {
    width: '92%',
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaText: {
    color: palette.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  titleBlock: {
    flex: 1,
    marginLeft: 12,
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
  },
  arrow: {
    marginLeft: 8,
  },
});

import { ThemeContext, ThemeName, ThemePalette } from '../ThemeContext'; // Added ThemeName and ThemePalette

const Campaign: React.FC<CampaignProps> = ({ onBack, onLevelSelect, unlockedLevel, score, bestScores }) => {

  const { themeName, palette } = React.useContext(ThemeContext);
  const styles = getStyles(themeName, palette); // Call getStyles
  const getLevelColor = React.useCallback((level: number) => {
    if (level >= 1 && level <= 12) return '#2ecc40'; // Green - Beginner
    if (level >= 13 && level <= 24) return '#FFC107'; // Yellow - Intermediate
    return '#FF5555'; // Red - Advanced (25–36)
  }, []);

  // Section headers are inserted at 1, 13, 25 in the render below.

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campaign</Text>
      <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 32, paddingBottom: 32 }}>
        {QUESTS.map((quest) => {
          const locked = quest.id > unlockedLevel;
          const levelColor = getLevelColor(quest.id);
          const headerLabel = quest.id === 1 ? 'Beginner' : quest.id === 13 ? 'Intermediate' : quest.id === 25 ? 'Hard' : null;
          return (
            <React.Fragment key={quest.id}>
              {headerLabel && (
                <View style={[styles.sectionHeaderContainer, { marginTop: quest.id === 1 ? 8 : 24 }]}>
                  <Text style={[styles.sectionHeaderText, { color: levelColor }]}>{headerLabel}</Text>
                </View>
              )}
              <View style={[styles.questRow, locked ? { opacity: 0.6 } : null]}>
                <TouchableOpacity
                  disabled={locked}
                  onPress={() => { onLevelSelect(quest.id); }}
                  activeOpacity={0.85}
                  style={styles.levelCard}
                >
                  <View style={styles.levelRowInner}>
                    <View style={[styles.iconContainer, { borderColor: levelColor }]}>
                      <FontAwesome5 name="guitar" size={28} color={levelColor} />
                    </View>
                    <View style={styles.titleBlock}>
                      <Text style={[styles.questText, { color: levelColor }]}>{quest.name}</Text>
                      <Text style={styles.metaText}>
                        {typeof bestScores[String(quest.id)] === 'number' ? `Best: ${bestScores[String(quest.id)]}/30` : locked ? 'Locked' : 'No score yet'}
                      </Text>
                    </View>
                    <FontAwesome5 style={styles.arrow} name="chevron-right" size={18} color={palette.textSecondary} />
                  </View>
                </TouchableOpacity>
              </View>
            </React.Fragment>
          );
        })}
      </ScrollView>
      <Button onPress={onBack} style={styles.backButton} >
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </Button>
    </View>
  );
};

export default Campaign;