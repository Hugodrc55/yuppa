import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from "expo-router";
import * as Font from 'expo-font';
import { View, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "LilitaOne-Regular": require("../assets/fonts/LilitaOne-Regular.ttf"),
        "LeagueSpartan-Regular": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
        "LeagueSpartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
      });
      
      setFontsLoaded(true);
      await SplashScreen.hideAsync();
      router.replace('/WelcomeScreen');
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Image 
          source={require('../assets/splash/ouverture.png')} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom', // 💫 Animation fluide entre les pages
      }}
    >
      <Stack.Screen name="WelcomeScreen" options={{ animation: 'none' }} />
      <Stack.Screen name="index" />
      <Stack.Screen name="metiers" />
      <Stack.Screen name="mission" />
      <Stack.Screen name="task" />
      <Stack.Screen name="competence" />
      <Stack.Screen name="LoginScreen" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5e00ff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
