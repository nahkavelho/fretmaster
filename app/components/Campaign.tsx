import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Button from "../../components/ui/button";
import { FontAwesome } from '@expo/vector-icons';

interface CampaignProps {
  onBack: () => void;
}

const LEVELS = [
  { id: 1, name: "Level 1" },
  { id: 2, name: "Level 2" },
];

const Campaign: React.FC<CampaignProps> = ({ onBack }) => (
  <View className="flex-1 bg-black">
    <Text style={{ color: "white", fontSize: 28, fontWeight: "bold", marginTop: 32, textAlign: 'center' }}>Campaign Map</Text>
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 32 }}>
      {LEVELS.map((level, idx) => (
        <View key={level.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: idx === LEVELS.length - 1 ? 0 : 32 }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'black',
              borderRadius: 50,
              width: 64,
              height: 64,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: '#FFD700',
              elevation: 2,
              shadowColor: '#FFD700',
              shadowOpacity: 0.3,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              position: 'relative',
            }}
            onPress={() => {/* TODO: Level select logic */}}
            activeOpacity={0.8}
          >
            <FontAwesome name="star" size={56} color="#FFD700" />
            <Text style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: 22,
              position: 'absolute',
              top: 14,
              left: 0,
              right: 0,
              textAlign: 'center',
            }}>{level.id}</Text>
          </TouchableOpacity>
          <Text style={{ color: '#FFD700', fontSize: 18, fontWeight: 'bold', marginLeft: 18 }}>{level.name}</Text>
        </View>
      ))}
    </View>
    <Button onPress={onBack} style={{ backgroundColor: '#222', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 8, marginBottom: 24, alignSelf: 'center' }}>
      <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Back to Menu</Text>
    </Button>
  </View>
);

export default Campaign;
