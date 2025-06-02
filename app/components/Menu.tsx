import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from '../_layout';
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

const Menu: React.FC<MenuProps> = ({ onCampaign, onFreeMode, onSettings, extraButtons }) => {
  const { theme } = React.useContext(ThemeContext);
  const bgColor = theme === 'rocksmith' ? '#181A1B' : '#F8F4E1';
  const titleColor = theme === 'rocksmith' ? '#FFD900' : '#543310';
  return (
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: bgColor }}>
      <Text style={{ color: titleColor, fontSize: 32, fontWeight: "bold", marginBottom: 32 }}>Fretboard Trainer</Text>
      <Button onPress={onCampaign} style={[styles.button, theme === 'rocksmith' ? { backgroundColor: '#2F2F2F', borderColor: '#FFD900', borderWidth: 2 } : { backgroundColor: '#543310' }]}>
        <Text style={[styles.buttonText, theme === 'rocksmith' ? { color: "#FFD900" } : { color: "#F8F4E1" }]}>Campaign</Text>
      </Button>
      <Button onPress={onFreeMode} style={[styles.button, theme === 'rocksmith' ? { backgroundColor: '#2F2F2F', borderColor: '#FFF', borderWidth: 2 } : { backgroundColor: '#74512D' }]}>
        <Text style={[styles.buttonText, theme === 'rocksmith' ? { color: "#FFF" } : { color: "#F8F4E1" }]}>Free Mode</Text>
      </Button>
      <Button onPress={onSettings} style={[styles.button, theme === 'rocksmith' ? { backgroundColor: '#2F2F2F', borderColor: '#FFD900', borderWidth: 2, marginBottom: 0 } : { backgroundColor: '#AF8F6F', marginBottom: 0 }]}>
        <Text style={[styles.buttonText, theme === 'rocksmith' ? { color: "#FFD900" } : { color: "#543310" }]}>Settings</Text>
      </Button>
      {extraButtons}
    </View>
  );
};

export default Menu;
