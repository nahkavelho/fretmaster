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

const LEVEL_COUNT = 46;

// Level descriptions for the new progressive system
const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: 'Low E String: Part 1 (Frets 0-3)',
  2: 'Low E String: Part 2 (Frets 4-6)',
  3: 'Low E String: Parts 1-2 (Frets 0-6)',
  4: 'Low E String: Part 3 (Frets 7-9)',
  5: 'Low E String: Part 4 (Frets 10-12)',
  6: 'Low E String: Parts 3-4 (Frets 7-12)',
  7: 'Low E String: Complete (Frets 0-12)',
  8: 'A String: Part 1 (Frets 0-3)',
  9: 'A String: Part 2 (Frets 4-6)',
  10: 'A String: Parts 1-2 (Frets 0-6)',
  11: 'A String: Part 3 (Frets 7-9)',
  12: 'A String: Part 4 (Frets 10-12)',
  13: 'A String: Parts 3-4 (Frets 7-12)',
  14: 'A String: Complete (Frets 0-12)',
  15: 'E + A Strings: Combined',
  16: 'D String: Part 1 (Frets 0-3)',
  17: 'D String: Part 2 (Frets 4-6)',
  18: 'D String: Parts 1-2 (Frets 0-6)',
  19: 'D String: Part 3 (Frets 7-9)',
  20: 'D String: Part 4 (Frets 10-12)',
  21: 'D String: Parts 3-4 (Frets 7-12)',
  22: 'D String: Complete (Frets 0-12)',
  23: 'G String: Part 1 (Frets 0-3)',
  24: 'G String: Part 2 (Frets 4-6)',
  25: 'G String: Parts 1-2 (Frets 0-6)',
  26: 'G String: Part 3 (Frets 7-9)',
  27: 'G String: Part 4 (Frets 10-12)',
  28: 'G String: Parts 3-4 (Frets 7-12)',
  29: 'G String: Complete (Frets 0-12)',
  30: 'D + G Strings: Combined',
  31: 'B String: Part 1 (Frets 0-3)',
  32: 'B String: Part 2 (Frets 4-6)',
  33: 'B String: Parts 1-2 (Frets 0-6)',
  34: 'B String: Part 3 (Frets 7-9)',
  35: 'B String: Part 4 (Frets 10-12)',
  36: 'B String: Parts 3-4 (Frets 7-12)',
  37: 'B String: Complete (Frets 0-12)',
  38: 'High E String: Part 1 (Frets 0-3)',
  39: 'High E String: Part 2 (Frets 4-6)',
  40: 'High E String: Parts 1-2 (Frets 0-6)',
  41: 'High E String: Part 3 (Frets 7-9)',
  42: 'High E String: Part 4 (Frets 10-12)',
  43: 'High E String: Parts 3-4 (Frets 7-12)',
  44: 'High E String: Complete (Frets 0-12)',
  45: 'B + High E Strings: Combined',
  46: 'Master Level: All Strings',
};

const QUESTS = Array.from({ length: LEVEL_COUNT }, (_, i) => ({ 
  id: i + 1, 
  name: `Level ${i + 1}`,
  description: LEVEL_DESCRIPTIONS[i + 1] || ''
}));

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
  // Smooth gradient color scheme across all levels (theme-aware)
  const getLevelColor = React.useCallback((level: number) => {
    // Acoustic theme: Vibrant warm tones (wood, bronze, amber, copper, terracotta)
    const acousticColors = [
      '#A67C1B', '#B8861F', '#CA9023', '#DC9A27', '#E6A82E', '#F0B636', '#F5C03E',
      '#EFAA46', '#E9944E', '#E37E56', '#DD685E', '#D75F66', '#D1566E', '#CB4D76',
      '#C0527E', '#B55786', '#AA5C8E', '#A46496', '#9E6C9E', '#9874A6', '#927CAE',
      '#8C84B6', '#8690BE', '#8098C6', '#7AA0CE', '#74A8D6', '#6EB0DE', '#68B8E6',
      '#6BBFD4', '#6EC6C2', '#71CDB0', '#74D49E', '#79D588', '#7ED672', '#83D75C',
      '#8CD854', '#95D94C', '#9EDA44', '#A7DB3C', '#B0DC34', '#B9DD2C', '#C2DE24',
      '#CADA38', '#D2D64C', '#DAD260', '#E2CE74', '#EDD899'
    ];
    
    // Rocksmith theme: Cool muted gradient (original)
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
  }, [themeName]);

  // Section headers are inserted at 1, 13, 25 in the render below.

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campaign</Text>
      <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 32, paddingBottom: 32 }}>
        {QUESTS.map((quest) => {
          const locked = quest.id > unlockedLevel;
          const levelColor = getLevelColor(quest.id);
          const headerLabel = quest.id === 1 ? 'Low E String' : quest.id === 8 ? 'A String' : quest.id === 15 ? 'E + A Combined' : quest.id === 16 ? 'D String' : quest.id === 23 ? 'G String' : quest.id === 30 ? 'D + G Combined' : quest.id === 31 ? 'B String' : quest.id === 38 ? 'High E String' : quest.id === 45 ? 'B + High E Combined' : quest.id === 46 ? 'Master Level' : null;
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
                    <View style={[styles.iconContainer, { borderColor: levelColor, backgroundColor: palette.modalBackground }]}>
                      <Text style={{ fontSize: (quest.id === 15 || quest.id === 30 || quest.id === 45 || quest.id === 46) ? 18 : 32, fontWeight: 'bold', color: levelColor }}>
                        {quest.id === 46 ? 'ALL' : quest.id === 45 ? 'B+e' : quest.id >= 38 ? 'e' : quest.id >= 31 ? 'B' : quest.id === 30 ? 'D+G' : quest.id >= 23 ? 'G' : quest.id >= 16 ? 'D' : quest.id === 15 ? 'E+A' : quest.id >= 8 ? 'A' : 'E'}
                      </Text>
                    </View>
                    <View style={styles.titleBlock}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' as const }}>
                        <Text style={[styles.questText, { color: levelColor }]}>{quest.name}</Text>
                      </View>
                      <Text style={[styles.metaText, { fontSize: 12, marginTop: 2 }]}>
                        {quest.description}
                      </Text>
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