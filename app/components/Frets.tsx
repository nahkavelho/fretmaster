import React from "react";
import { View } from "react-native";

interface FretsProps {
  frets: number[];
}

const Frets: React.FC<FretsProps> = ({ frets }) => (
  <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', height: '100%' }}>
    {frets.map((fret, i) => (
      <View
        key={fret}
        style={{ flex: 1, alignItems: 'center' }}
      >
        <View
          style={{
            height: '100%',
            width: 8,
            alignSelf: 'stretch',
            backgroundColor: '#A9A9A9',
            shadowColor: '#543310', // deep brown shadow
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {/* {fret} */}
        </View>
      </View>
    ))}
  </View>
);

export default Frets;
