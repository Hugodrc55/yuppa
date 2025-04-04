//Import (voir si jamais page compétences)
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen: React.FC = () => {
  const router = useRouter();

 

  return (
    <View style={styles.container}>
      {/* En-tête avec le logo */}
      <SafeAreaView style={styles.header}>
        <Text style={styles.logo}>YUPA</Text>
      </SafeAreaView>

      {/* Message de bienvenue */}
      <Text style={styles.welcomeText}>Heureux de vous revoir</Text>

      {/* Image petit bonhomme */}
      <Animatable.Image
        animation="bounceIn"
        duration={1200}
        source={require('../assets/shiva.png')}
        style={styles.illustration}
      />

      {/* Bouton pour aller dans la page metiers */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/metiers')}
      >
        <Text style={styles.buttonText}>Trouver une formation</Text>
      </TouchableOpacity>

      {/* Barre de navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/HomeScreen')}>
          <Ionicons name="home-outline" size={30} color="#5e00ff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/metiers')}>
          <Ionicons name="search-outline" size={30} color="#5e00ff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/metiers')}>
          <Ionicons name="person-outline" size={30} color="#5e00ff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
// style css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#5e00ff',
    width: '100%',
    paddingVertical: Platform.OS === 'ios' ? 10 : 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    paddingTop: Platform.OS === 'ios' ? 55 : 25,
    color: 'white',
    fontSize: Platform.OS === 'ios' ? 28 : 24,
    fontFamily: 'LilitaOne-Regular',
    position: 'absolute'
  },
  welcomeText: {
    fontSize: Platform.OS === 'ios' ? 30 : 26,
    color: '#5e00ff',
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'LilitaOne-Regular',
  },
  illustrationPlaceholder: {
    width: Platform.OS === 'ios' ? 300 : 250,
    height: Platform.OS === 'ios' ? 300 : 250,
    backgroundColor: '#ddd', 
    borderRadius: 20,
    marginVertical: 20,
   
  },
  button: {
    backgroundColor: '#5e00ff',
    paddingVertical: Platform.OS === 'ios' ? 18 : 14,
    paddingHorizontal: Platform.OS === 'ios' ? 32 : 28,
    borderRadius: 25,
    marginTop: Platform.OS === 'ios' ? 500 : 430,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: Platform.OS === 'ios' ? 20 : 16,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'LilitaOne-Regular',
  },
  illustration: {
    width: Platform.OS === 'ios' ? 550 : 500, 
    height: Platform.OS === 'ios' ? 550 : 500, 
    resizeMode: 'contain', 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 110 : 100,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: Platform.OS === 'ios' ? 80 : 60,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

export default HomeScreen;
