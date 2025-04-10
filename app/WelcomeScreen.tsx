import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import * as Animatable from 'react-native-animatable';

//illustration alternative
const images = [
  require('../assets/shivawelcome.png'),
  require('../assets/shiva2.png'), 
  
];

export default function WelcomeScreen() {
  const router = useRouter(); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Changement d’image toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isShiva2 = currentImageIndex === 1;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        
        {isShiva2 ? (
          <Animatable.Image
            animation="pulse"
            iterationCount="infinite"
            duration={1500}
            source={images[currentImageIndex]}
            style={styles.image}
          />
        ) : (
          <Animatable.Image
            animation="bounceIn"
            duration={1500}
            source={images[currentImageIndex]}
            style={styles.image}
          />
        )}

        <Text style={styles.title}>Yupa</Text>

        <View style={styles.card}>
          <Text style={styles.welcome}>Welcome to Yupa</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti corporis nostrum pariatur.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Register {'>'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/LoginScreen')} >
              <Text style={styles.buttonText}>Login {'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 120 : 80, 
  },
  image: {
    width: Platform.OS == 'ios' ? 500 : 400,
    height: Platform.OS == 'ios' ? 500: 400,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: Platform.OS == 'ios' ? 36 : 30,
    color: '#5e00ff',
    fontFamily: 'LilitaOne-Regular',
    marginTop: Platform.OS == 'ios' ? 580 : 430, 
    position: 'absolute'
  },
  card: {
    width: '100%',
    backgroundColor: '#5e00ff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: Platform.OS == 'ios' ? 50 : 30,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  welcome: {
    fontSize: Platform.OS == 'ios' ? 30 : 25,
    fontFamily: 'LilitaOne-Regular',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'LeagueSpartan-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  registerButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: Platform.OS == 'ios' ? 25 : 20,
    paddingVertical: Platform.OS == 'ios' ? 12 : 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffffff',
    
  },
  registerButtonText: {
    color: '#5e00ff',
    fontFamily: 'LilitaOne-Regular',
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
    paddingHorizontal: Platform.OS == 'ios' ? 25 : 20,
    paddingVertical: Platform.OS == 'ios' ? 12 : 8,
    borderRadius: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'LilitaOne-Regular',
  },
});
