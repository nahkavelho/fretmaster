import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/ui/button";

interface MenuProps {
  onCampaign: () => void;
  onFreeMode: () => void;
  onSettings: () => void;
  extraButtons?: React.ReactNode;
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 24,
    minWidth: 200,
    paddingHorizontal: 48,
  },
});

const Menu: React.FC<MenuProps> = ({ onCampaign, onFreeMode, onSettings, extraButtons }) => (
  <View className="flex-1 justify-center items-center" style={{ backgroundColor: '#F8F4E1' }}> 
    <Text style={{ color: "#543310", fontSize: 32, fontWeight: "bold", marginBottom: 32 }}>Fretboard Trainer</Text>
    <Button onPress={onCampaign} style={[styles.button, { backgroundColor: '#543310' }] }>
      <Text style={[styles.buttonText, { color: "#F8F4E1" }]}>Campaign</Text>
    </Button>
    <Button onPress={onFreeMode} style={[styles.button, { backgroundColor: '#74512D' }] }>
      <Text style={[styles.buttonText, { color: "#F8F4E1" }]}>Free Mode</Text>
    </Button>
    <Button onPress={onSettings} style={[styles.button, { backgroundColor: '#AF8F6F', marginBottom: 0 }] }>
      <Text style={[styles.buttonText, { color: "#543310" }]}>Settings</Text>
    </Button>
    {extraButtons}
  </View>
);

export default Menu;
