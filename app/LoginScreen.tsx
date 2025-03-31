import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Checkbox from 'expo-checkbox';
import { supabase } from './supabaseClient';

export default function LoginScreen() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const errorRef = useRef<Animatable.View & { shake: (duration?: number) => void }>(null);

  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log(data, error);

    if (error) {
      setErrorMessage("Email ou mot de passe invalide");
      if (errorRef.current) {
        errorRef.current.shake(600); 
      }
    } else {
      setErrorMessage("");
      router.replace('/HomeScreen');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>LOGO</Text>
        </View>

        <Text style={styles.welcomeText}>Welcome Back !</Text>
        <Image source={require('../assets/hand.png')} style={styles.illustration} />
        <Text style={styles.signInText}>Sign In</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="gray" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Username or Email"
              placeholderTextColor="gray" 
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="key" size={20} color="gray" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Password"
              placeholderTextColor="gray" 
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Affichage de l'erreur animé */}
        {errorMessage !== '' && (
          <Animatable.Text
            ref={errorRef}
            style={styles.errorText}
          >
            {errorMessage}
          </Animatable.Text>
        )}

        <View style={styles.optionsRow}>
          <Text style={styles.forgot}>Forgot Password ? {'>'}</Text>
          <View style={styles.checkboxRow}>
            <Checkbox 
              value={rememberMe} 
              onValueChange={setRememberMe} 
              color={rememberMe ? '#5e00ff' : undefined} 
            />
            <Text style={styles.rememberText}>Remember me</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.signupPrompt}>
          Don’t have an account ? <Text style={styles.signupLink}>Sign up now !</Text>
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#5e00ff',
    width: '100%',
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'LilitaOne-Regular',
  },
  welcomeText: {
    fontSize: 26,
    fontFamily: 'LilitaOne-Regular',
    color: '#5e00ff',
    marginTop: 20,
  },
  signInText: {
    fontSize: 24,
    fontFamily: 'LilitaOne-Regular',
    color: '#5e00ff',
    marginTop: 10,
  },
  illustration: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginVertical: 15,
  },
  inputContainer: {
    width: '80%',
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#f3f3f3',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontFamily: 'LeagueSpartan-Regular',
  },
  optionsRow: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  forgot: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'LeagueSpartan-Regular',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'LeagueSpartan-Regular',
  },
  loginButton: {
    backgroundColor: '#5e00ff',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginTop: 25,
  },
  loginText: {
    color: '#fff',
    fontFamily: 'LilitaOne-Regular',
    fontSize: 16,
  },
  signupPrompt: {
    marginTop: 30,
    fontSize: 14,
    fontFamily: 'LeagueSpartan-Regular',
  },
  signupLink: {
    color: '#5e00ff',
    fontFamily: 'LeagueSpartan-Bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
  },
});
