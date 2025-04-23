import React from "react";
import { View, Text } from "react-native";
import Button from "../../components/ui/button";

interface MenuProps {
  onCampaign: () => void;
  onFreeMode: () => void;
  onSettings: () => void;
}

const Menu: React.FC<MenuProps> = ({ onCampaign, onFreeMode, onSettings }) => (
  <View className="flex-1 justify-center items-center bg-[#222]">
    <Text style={{ color: "white", fontSize: 32, fontWeight: "bold", marginBottom: 32 }}>Fretboard Trainer</Text>
    <Button onPress={onCampaign} style={{ backgroundColor: '#FFD700', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 8, marginBottom: 16 }}>
      <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>Campaign</Text>
    </Button>
    <Button onPress={onFreeMode} style={{ backgroundColor: '#48A6A7', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 8, marginBottom: 16 }}>
      <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>Free Mode</Text>
    </Button>
    <Button onPress={onSettings} style={{ backgroundColor: '#CCCCCC', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 8 }}>
      <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>Settings</Text>
    </Button>
  </View>
);

export default Menu;
