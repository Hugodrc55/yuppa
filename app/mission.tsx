import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, findNodeHandle, UIManager, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { playSound, playPopClick } from './useSound';
import BurstParticles from './BurstParticles';
import { SafeAreaView } from 'react-native-safe-area-context';

function MissionScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MissionComponent />
    </>
  );
}

const MissionComponent: React.FC = () => {
  const router = useRouter();
  const { selectedJob } = useLocalSearchParams();
  const [missions, setMissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMissions, setSelectedMissions] = useState<{ [key: string]: boolean }>({});
  const checkboxRefs = useRef<{ [key: string]: any }>({});
  const [particlePosition, setParticlePosition] = useState<{ x: number; y: number } | null>(null);

  //Lors du chargement du composant, fait une requête POST au backend IA pour récupérer 6 missions liées au métier sélectionné
  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://backend-fryj.onrender.com/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Fais-moi une liste d'au moins 6 missions concises et claires du métier ${selectedJob}.`
          })
        });

        const data = await response.json();
        const list = data.response?.split('\n').map((item: string) => item.trim()).filter(Boolean) || [];
        setMissions(list);
      } catch (error) {
        console.error("Erreur:", error);
      }
      setLoading(false);
    };

    fetchMissions();
  }, [selectedJob]);

  const toggleMissionSelection = async (mission: string) => {
    setSelectedMissions(prev => ({
      ...prev,
      [mission]: !prev[mission],
    }));

    await playPopClick();

    const handle = findNodeHandle(checkboxRefs.current[mission]);
    if (handle) {
      UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
        setParticlePosition({ x: pageX + width / 2, y: pageY + height / 2 });
        setTimeout(() => setParticlePosition(null), 600);
      });
    }
  };

  const handleSubmit = async () => {
    const selectedArray = Object.keys(selectedMissions).filter(key => selectedMissions[key]);
    await playSound();
    router.push({
      pathname: '/task',
      params: {
        selectedJob,
        selectedMissions: JSON.stringify(selectedArray),
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <SafeAreaView style={styles.header}>
          <Text style={styles.logo}>YUPA</Text>
        </SafeAreaView>

        <Image source={require('../assets/progressbar2.png')} style={styles.progressbar} />
        <Text style={styles.selectedJobText}>Métier sélectionné : {selectedJob}</Text>
        <Text style={styles.title}>Sélectionnez des missions</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#5e00ff" style={{ marginTop: 50 }} />
        ) : (
          missions.map((mission, index) => (
            <View key={index} style={styles.missionItem}>
              <View ref={ref => (checkboxRefs.current[mission] = ref)} collapsable={false}>
                <Checkbox
                  status={selectedMissions[mission] ? 'checked' : 'unchecked'}
                  onPress={() => toggleMissionSelection(mission)}
                  color="#5e00ff"
                />
              </View>
              <Text style={styles.missionText}>{mission}</Text>
            </View>
          ))
        )}

        {!loading && (
          <>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Soumettre</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.returnButton} onPress={() => router.back()}>
              <Text style={styles.returnButtonText}>Retour</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.characterContainer}>
          <Image source={require('../assets/shivamission.png')} style={styles.characterImage} />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/HomeScreen')}>
          <Ionicons name="home-outline" size={30} color="#5e00ff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/metiers')}>
          <Ionicons name="search-outline" size={30} color="#5e00ff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={30} color="#5e00ff" />
        </TouchableOpacity>
      </View>

      {particlePosition && (
        <View style={{
          position: 'absolute',
          top: particlePosition.y - 6,
          left: particlePosition.x - 6,
          width: 40,
          height: 40,
          zIndex: 999,
          pointerEvents: 'none',
        }}>
          <BurstParticles x={0} y={0} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    position: 'absolute',
  },
  selectedJobText: {
    fontSize: 20,
    fontFamily: 'LilitaOne-Regular',
    color: '#333',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'LilitaOne-Regular',
    color: '#5e00ff',
    marginVertical: 20,
    textAlign: 'center',
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  missionText: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'LeagueSpartan-Regular',
    marginLeft: 10,
    flexShrink: 1,
  },
  progressbar: {
    width: Platform.OS === 'ios' ? 710 : 690,
    height: Platform.OS === 'ios' ? 95 : 80,
    marginTop: -10,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#5e00ff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 20,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'LilitaOne-Regular',
    color: '#ffffff',
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  returnButtonText: {
    fontSize: 16,
    fontFamily: 'LilitaOne-Regular',
    color: '#333',
  },
  characterContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  characterImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
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

export default MissionScreen;
