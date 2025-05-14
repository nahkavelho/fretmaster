import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Button from "../../components/ui/button";
import { FontAwesome5 } from '@expo/vector-icons';

interface CampaignProps {
  onBack: () => void;
  onLevelSelect: (level: number) => void;
}

const LEVEL_COUNT = 4;
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
});

const Campaign: React.FC<CampaignProps> = ({ onBack, onLevelSelect }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Campaign</Text>
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 32 }}>
      {QUESTS.map((quest, idx) => (
        <View key={quest.id} style={[styles.questRow, { marginBottom: idx === QUESTS.length - 1 ? 0 : 32 }] }>
          <TouchableOpacity
            onPress={() => { onLevelSelect(quest.id); }}
            activeOpacity={0.8}
            style={{ padding: 8 }}
          >
            <FontAwesome5 name="guitar" size={48} color="#543310" />
          </TouchableOpacity>
          <Text style={styles.questText}>{quest.name}</Text>
        </View>
      ))}
    </View>
    <Button onPress={onBack} style={styles.backButton}>
      <Text style={styles.backButtonText}>Back to Menu</Text>
    </Button>
  </View>
);

export default Campaign;
