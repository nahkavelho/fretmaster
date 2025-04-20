import * as React from 'react';
import { View, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import "../app.css";

export const screenOptions = {
  headerShown: false,
};
const frets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const strings = [1, 2, 3, 4, 5, 6];

export default function Screen() {
  const [progress, setProgress] = React.useState(78);
  const [isLandscape, setIsLandscape] = React.useState(false);

  React.useEffect(() => {
    async function checkOrientation() {
      const orientation = await ScreenOrientation.getOrientationAsync();
      console.log('Initial orientation:', orientation);
      setIsLandscape(
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      );
    }
    checkOrientation();
    const subscription = ScreenOrientation.addOrientationChangeListener(event => {
      const orientation = event.orientationInfo.orientation;
      console.log('Orientation changed:', orientation);
      setIsLandscape(
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      );
    });
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  function updateProgressValue() {
    setProgress(Math.floor(Math.random() * 100));
  }
  return (
    <View className='flex-1 justify-center items-center gap-2 p-6 bg-white'>
      <View className='flex-1 justify-center items-center gap-2 bg-[#FFDDAB] w-full'>
        <View className="flex-row w-full justify-between">
          {frets.map((fret, i) => (
            <View
              key={fret}
              className={["flex-1 items-center", i === 0 ? "-ml-1" : "", i === frets.length - 1 ? "-mr-1" : ""].join(" ")}
            >
              <View className="h-full w-2 bg-[#C0C0C0] shadow-lg shadow-black">{fret}</View>
            </View>
          ))}
        </View>
      </View>
      <View className='h-[20%] justify-center items-center gap-2 p-6 bg-[#48A6A7] w-full'></View>
    </View>
  );
}
