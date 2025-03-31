import { Audio } from 'expo-av';

// Son de changement de page
export const playSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/nextpage.wav')
    );

    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Erreur lors de la lecture du son :', error);
  }
};

// Son de fin
export const playFinishSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/finish.wav')
    );

    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Erreur lors de la lecture du son de fin :', error);
  }
};

// ✅ Son lorsqu’on coche une case
export const playPopClick = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/popclick.wav')
    );

    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Erreur lors de la lecture du son popclick :', error);
  }
};
