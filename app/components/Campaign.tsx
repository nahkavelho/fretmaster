import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import Button from "../../components/ui/button";
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

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
  progressBarWrap: {
    height: 8,
    backgroundColor: palette.fretboardBorder,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  sectionHeaderContainer: {
    width: '92%',
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: palette.fretboardBorder,
    alignSelf: 'stretch',
  },
  sectionLabelChip: {
    position: 'absolute',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.fretboardBorder,
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
  scoreBadge: {
    minWidth: 64,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.modalBackground,
    borderWidth: 1,
    borderColor: palette.fretboardBorder,
  },
  lockWrap: {
    minWidth: 64,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.modalBackground,
    borderWidth: 1,
    borderColor: palette.fretboardBorder,
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
                  <View style={styles.sectionDivider} />
                  <View style={styles.sectionLabelChip}>
                    <Text style={[styles.sectionHeaderText, { color: levelColor }]}>{headerLabel}</Text>
                  </View>
                </View>
              )}
              <View style={[styles.questRow, locked ? { opacity: 0.6 } : null]}>
                <Pressable
                  disabled={locked}
                  onPress={() => { onLevelSelect(quest.id); }}
                  android_ripple={{ color: '#00000022', borderless: false }}
                  style={({ pressed }) => [
                    styles.levelCard,
                    pressed && { transform: [{ scale: 0.98 }], opacity: 0.96 }
                  ]}
                >
                  <View style={styles.levelRowInner}>
                    <View style={[styles.iconContainer, { borderColor: levelColor }]}>
                      {quest.id >= 25 ? (
                        <MaterialCommunityIcons name="guitar-pick" size={34} color={levelColor} />
                      ) : quest.id >= 13 ? (
                        <MaterialCommunityIcons name="guitar-electric" size={34} color={levelColor} />
                      ) : (
                        <FontAwesome5 name="guitar" size={30} color={levelColor} />
                      )}
                    </View>
                    <View style={styles.titleBlock}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' as const }}>
                        <Text style={[styles.questText, { color: levelColor }]}>{quest.name}</Text>
                        {quest.id >= 25 && (
                          <MaterialCommunityIcons name="fire" size={16} color={levelColor} style={{ marginLeft: 6 }} />
                        )}
                      </View>
                      <Text style={styles.metaText}>
                        {typeof bestScores[String(quest.id)] === 'number' ? `Best: ${bestScores[String(quest.id)]}/30` : locked ? 'Locked' : 'No score yet'}
                      </Text>
                      {/* Progress bar */}
                      {typeof bestScores[String(quest.id)] === 'number' && (
                        <View style={styles.progressBarWrap}>
                          <View style={[styles.progressBarFill, { width: `${Math.min(100, Math.max(0, (bestScores[String(quest.id)] / 30) * 100))}%`, backgroundColor: levelColor }]} />
                        </View>
                      )}
                    </View>
                    {locked ? (
                      <View style={styles.lockWrap}>
                        <FontAwesome5 name="lock" size={14} color={palette.textSecondary} />
                      </View>
                    ) : (
                      <View style={styles.scoreBadge}>
                        <Text style={{ color: palette.textSecondary, fontWeight: 'bold' }}>
                          {typeof bestScores[String(quest.id)] === 'number' ? `${bestScores[String(quest.id)]}/30` : '—'}
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
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