import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import Button from "../../components/ui/button";

interface SettingsProps {
  onBack: () => void;
  manualMode: boolean;
  setManualMode: (value: boolean) => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#F8F4E1',
    paddingHorizontal: 24,
    paddingTop: 48
  },
  title: {
    color: "#543310", 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 32,
    textAlign: "center"
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#AF8F6F",
    borderRadius: 8
  },
  settingLabel: {
    color: "#543310",
    fontSize: 18,
    fontWeight: "600"
  },
  settingDescription: {
    color: "#543310",
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
    maxWidth: "80%"
  },
  backButton: {
    backgroundColor: '#74512D',
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 32
  },
  backButtonText: {
    color: "#F8F4E1",
    fontSize: 18,
    fontWeight: "bold"
  }
});

const Settings: React.FC<SettingsProps> = ({ onBack, manualMode, setManualMode }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Manual Mode</Text>
          <Text style={styles.settingDescription}>
            Enable precise control of note positions on the fretboard.
            This mode is intended for debugging and works best on larger screens.
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#CCCCCC", true: "#74512D" }}
          thumbColor={manualMode ? "#F8F4E1" : "#F8F4E1"}
          ios_backgroundColor="#CCCCCC"
          onValueChange={(value) => setManualMode(value)}
          value={manualMode}
        />
      </View>
      
      <Button onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </Button>
    </View>
  );
};

export default Settings;
