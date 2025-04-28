import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import Button from "../../components/ui/button";
import { FontAwesome5 } from '@expo/vector-icons'; // Using FontAwesome5 for scroll icon

interface CampaignProps {
  onBack: () => void;
}

const QUESTS = [
  { id: 1, name: "Quest  1" },
  { id: 2, name: "Quest  2" },
  { id: 3, name: "Quest  3" },
  { id: 4, name: "Quest  4" },
];

const Campaign: React.FC<CampaignProps> = ({ onBack }) => (
  <ImageBackground
    source={require("../../assets/images/village.png")} // Update the path if needed
    style={{ flex: 1 }}
    resizeMode="cover"
  >
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <Text style={{ color: "white", fontSize: 28, fontWeight: "bold", marginTop: 32, textAlign: 'center' }}>Campaign</Text>

      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 32 }}>
        {QUESTS.map((quest, idx) => (
          <View key={quest.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: idx === QUESTS.length - 1 ? 0 : 32 }}>
            <TouchableOpacity
              onPress={() => {/* TODO: Quest select logic */}}
              activeOpacity={0.8}
              style={{
                padding: 8,
              }}
            >
              <FontAwesome5 name="scroll" size={48} color="#FFD700" />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 18 }}>
              {quest.name}
            </Text>
          </View>
        ))}
      </View>

      <Button onPress={onBack} style={{ backgroundColor: '#222', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 8, marginBottom: 24, alignSelf: 'center' }}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Back to Menu</Text>
      </Button>
    </View>
  </ImageBackground>
);

export default Campaign;
