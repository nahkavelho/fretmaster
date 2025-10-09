import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeContext } from '../ThemeContext';
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
  const { themeName, palette } = React.useContext(ThemeContext);
  
  
  return (
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: palette.background }}>
      <View style={{ alignItems: 'center', marginBottom: 28 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{
            width: 44, height: 44, borderRadius: 22,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: palette.card,
            borderWidth: 2, borderColor: palette.primary,
          }}>
            <MaterialCommunityIcons name="guitar-pick" size={22} color={palette.primary} />
          </View>
          <Text style={{
            color: palette.primary,
            fontSize: 36,
            fontWeight: '900',
            letterSpacing: 1.0,
            textShadowColor: palette.shadow,
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 6,
          }}>
            FretMaster
          </Text>
        </View>
        <Text style={{ color: palette.textSecondary, marginTop: 6, fontSize: 13 }}>
          Effortless, easy fretboard mastery
        </Text>
      </View>
      <Button onPress={onCampaign} style={[styles.button, { backgroundColor: palette.button, borderColor: themeName === 'rocksmith' ? palette.primary : 'transparent', borderWidth: themeName === 'rocksmith' ? 1 : 0 }]}>
        <Text style={[styles.buttonText, { color: themeName === 'rocksmith' ? palette.primary : palette.buttonText }]}>Campaign</Text>
      </Button>
      <Button onPress={onFreeMode} style={[styles.button, { backgroundColor: palette.button, borderColor: themeName === 'rocksmith' ? palette.text : 'transparent', borderWidth: themeName === 'rocksmith' ? 1 : 0 }]}>
        <Text style={[styles.buttonText, { color: themeName === 'rocksmith' ? palette.text : palette.buttonText }]}>Free Mode</Text>
      </Button>
      <Button onPress={onSettings} style={[styles.button, { backgroundColor: palette.button, borderColor: themeName === 'rocksmith' ? palette.primary : 'transparent', borderWidth: themeName === 'rocksmith' ? 1 : 0, marginBottom: 0 }]}>
        <Text style={[styles.buttonText, { color: themeName === 'rocksmith' ? palette.primary : palette.buttonText }]}>Settings</Text>
      </Button>
      {extraButtons}
    </View>
  );
};

export default Menu;
