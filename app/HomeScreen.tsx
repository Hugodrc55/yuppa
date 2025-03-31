import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

//police mais ne marche pas pour l'instant
const HomeScreen: React.FC = () => {
  const router = useRouter();

 

  return (
    <View style={styles.container}>
      {/* En-tête avec le logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>YUPPA</Text>
      </View>

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
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  logo: {
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'LilitaOne-Regular',
  },
  welcomeText: {
    fontSize: 26,
    color: '#5e00ff',
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'LilitaOne-Regular',
  },
  illustrationPlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: '#ddd', 
    borderRadius: 20,
    marginVertical: 20,
   
  },
  button: {
    backgroundColor: '#5e00ff',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    marginTop: 430,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'LilitaOne-Regular',
  },
  illustration: {
    width: 500, 
    height: 500, 
    resizeMode: 'contain', 
    position: 'absolute', 
    top: 100,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

export default HomeScreen;
