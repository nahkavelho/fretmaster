import * as React from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export function useScreenOrientation(currentScreen: string) {
  React.useEffect(() => {
    async function changeScreenOrientation() {
      try {
        if (currentScreen === 'free' || currentScreen === 'campaign') {
          console.log('Locking to LANDSCAPE_RIGHT for game modes (free/campaign)');
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        } else if (currentScreen === 'menu') {
          console.log('Unlocking orientation for menu screen');
          await ScreenOrientation.unlockAsync();
        } else if (currentScreen === 'settings' || currentScreen === 'profile') { // Added profile here
          console.log('Locking to PORTRAIT_UP for settings/profile');
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        } else {
          console.log('Unlocking orientation for other screens (e.g., login)');
          await ScreenOrientation.unlockAsync();
        }
      } catch (e) {
        console.error('Failed to change screen orientation:', e);
      }
    }

    changeScreenOrientation();

    // Optional: Cleanup function to unlock orientation when the component unmounts or currentScreen changes
    // return () => {
    //   ScreenOrientation.unlockAsync().catch(e => console.error('Failed to unlock orientation on cleanup:', e));
    // };
  }, [currentScreen]);
}
