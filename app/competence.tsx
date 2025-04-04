//Importation des hooks de React nécessaires pour gérer l’état, les effets et les références aux éléments
import React, { useState, useEffect, useRef } from 'react';
//Import des composants UI de base de React Native;
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, findNodeHandle, UIManager, Platform } from 'react-native';
//pour gérer la navigation entre les écrans
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
//import des icones
import { Ionicons } from '@expo/vector-icons';
//composant pour permettre le systeme de coche
import { Checkbox } from 'react-native-paper';
// pour les sons
import { playSound } from './useSound';
import { Audio } from 'expo-av';
//import du system de particule
import BurstParticles from './BurstParticles';
import { SafeAreaView } from 'react-native-safe-area-context';

function CompetenceScreen() {
  return (
    <> 
      <Stack.Screen options={{ headerShown: false }} />
      <CompetenceComponent />
    </>
  );
}

const CompetenceComponent: React.FC = () => {
  //Récupération des paramètres passés depuis la page précédente
  const router = useRouter();
  const { selectedTasks, selectedMissions, selectedJob } = useLocalSearchParams();
  const taskList = selectedTasks ? JSON.parse(selectedTasks as string) : [];

  //Etats pour stocker les compétences (soft/hard) et celles sélectionnées par tâche
  const [softSkillsByTask, setSoftSkillsByTask] = useState<{ [task: string]: string[] }>({});
  const [hardSkillsByTask, setHardSkillsByTask] = useState<{ [task: string]: string[] }>({});
  const [selectedSkillsByTask, setSelectedSkillsByTask] = useState<{ [task: string]: string[] }>({});
  const [loading, setLoading] = useState(true);

   //Références pour placer les particules à la position exacte d'une case cochée
  const checkboxRefs = useRef<{ [key: string]: any }>({});
  const [particlePosition, setParticlePosition] = useState<{ x: number; y: number } | null>(null);

  //permet le petit pop quand on clique sur une case
  const playPopSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/popclick.wav'));
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
    });
  };
  
  //Ajoute ou retire une compétence sélectionnée pour une tâche, joue le son, puis affiche une animation à la bonne position
  const toggleSkill = async (task: string, skill: string) => {
    setSelectedSkillsByTask(prev => {
      const current = prev[task] || [];
      const updated = current.includes(skill)
        ? current.filter(s => s !== skill)
        : [...current, skill];
      return { ...prev, [task]: updated };
    });

    await playPopSound();

    const handle = findNodeHandle(checkboxRefs.current[`${task}_${skill}`]);
    if (handle) {
      UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
        setParticlePosition({ x: pageX + width / 2, y: pageY + height / 2 });
        setTimeout(() => setParticlePosition(null), 600);
      });
    }
  };
  
  //Appel à l'API pour chaque tâche afin d'obtenir des listes de soft/hard skills
  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      const newSoft: { [task: string]: string[] } = {};
      const newHard: { [task: string]: string[] } = {};

      await Promise.all(taskList.map(async (task: string) => {
        try {
          const [softRes, hardRes] = await Promise.all([
            fetch('https://backend-fryj.onrender.com/chatbot', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: `Donne-moi une liste de 3 à 6 soft skills pour réaliser la tâche '${task}'. Réponds sous forme de liste.` }),
            }),
            fetch('https://backend-fryj.onrender.com/chatbot', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: `Donne-moi une liste de 3 à 6 hard skills pour réaliser la tâche '${task}'. Réponds sous forme de liste.` }),
            })
          ]);

          const softData = await softRes.json();
          const hardData = await hardRes.json();

          newSoft[task] = softData.response?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [];
          newHard[task] = hardData.response?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [];
        } catch (err) {
          console.error("Erreur:", err);
          newSoft[task] = ["Erreur"];
          newHard[task] = ["Erreur"];
        }
      }));

      setSoftSkillsByTask(newSoft);
      setHardSkillsByTask(newHard);
      setLoading(false);
    };

    fetchSkills();
  }, []);
  //Joue un son de changement de page à l'ouverture
  useEffect(() => {
      playSound(); 
    }, []);

  const handleSubmit = () => {
    const filteredSoftSkillsByTask: { [task: string]: string[] } = {};
    const filteredHardSkillsByTask: { [task: string]: string[] } = {};

    for (const task of taskList) {
      filteredSoftSkillsByTask[task] = (softSkillsByTask[task] || []).filter(skill => selectedSkillsByTask[task]?.includes(skill));
      filteredHardSkillsByTask[task] = (hardSkillsByTask[task] || []).filter(skill => selectedSkillsByTask[task]?.includes(skill));
    }
    

    router.push({
      pathname: "/final",
      params: {
        selectedJob,
        selectedMissions,
        selectedTasks: JSON.stringify(taskList),
        softSkillsByTask: JSON.stringify(filteredSoftSkillsByTask),
        hardSkillsByTask: JSON.stringify(filteredHardSkillsByTask),
      },
    });
  };

  return (
    //rendu principale (meme presque dans chaque page)
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <SafeAreaView style={styles.header}>
          <Text style={styles.logo}>YUPA</Text>
        </SafeAreaView>

        <Image source={require('../assets/progressbar4.png')} style={styles.progressbar} />
        <Text style={styles.title}>Sélectionnez des compétences à travailler</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#5e00ff" />
        ) : (
          taskList.map((task: string, index: number) => (
            <View key={index} style={styles.taskContainer}>
              <Text style={styles.taskTitle}>{task}</Text>

              <Text style={styles.subtitle}>🟢 Soft Skills :</Text>
              {softSkillsByTask[task]?.map((skill, idx) => (
                <View key={idx} style={styles.skillItem}>
                  <View ref={ref => (checkboxRefs.current[`${task}_${skill}`] = ref)} collapsable={false}>
                    <Checkbox
                      status={selectedSkillsByTask[task]?.includes(skill) ? 'checked' : 'unchecked'}
                      onPress={() => toggleSkill(task, skill)}
                      color="#5e00ff"
                    />
                  </View>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}

              <Text style={styles.subtitle}>🔵 Hard Skills :</Text>
              {hardSkillsByTask[task]?.map((skill, idx) => (
                <View key={idx} style={styles.skillItem}>
                  <View ref={ref => (checkboxRefs.current[`${task}_${skill}`] = ref)} collapsable={false}>
                    <Checkbox
                      status={selectedSkillsByTask[task]?.includes(skill) ? 'checked' : 'unchecked'}
                      onPress={() => toggleSkill(task, skill)}
                      color="#5e00ff"
                    />
                  </View>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          ))
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Finaliser</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.returnButton} onPress={() => router.back()}>
          <Text style={styles.returnButtonText}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.characterContainer}>
          <Image source={require('../assets/shivacompetence.png')} style={styles.characterImage} />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/HomeScreen')}><Ionicons name="home-outline" size={30} color="#5e00ff" /></TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/metiers')}><Ionicons name="search-outline" size={30} color="#5e00ff" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="person-outline" size={30} color="#5e00ff" /></TouchableOpacity>
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

//styles
const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', backgroundColor: '#fff' },
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
  progressbar: {
    width: Platform.OS === 'ios' ? 710 : 690,
    height: Platform.OS === 'ios' ? 95 : 80,
    marginTop: -10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontFamily: 'LilitaOne-Regular',
    color: '#5e00ff',
    marginVertical: 20,
    textAlign: 'center'
  },
  taskContainer: {
    marginBottom: 20,
    width: '85%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10
  },
  taskTitle: {
    fontSize: 18,
    fontFamily: 'LilitaOne-Regular',
    color: '#333',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'LilitaOne-Regular',
    marginTop: 10,
    color: '#5e00ff'
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  skillText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'LeagueSpartan-Regular',
    marginLeft: 10,
    flexShrink: 1,         
    flexWrap: 'wrap',      
    maxWidth: '90%'         
  },
  button: {
    backgroundColor: '#5e00ff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 20,
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'LilitaOne-Regular',
    color: '#ffffff',
    textAlign: 'center'
  },
  returnButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  returnButtonText: {
    fontSize: 16,
    fontFamily: 'LilitaOne-Regular',
    color: '#333'
  },
  characterContainer: {
    marginBottom: 60,
    alignItems: 'center'
  },
  characterImage: {
    width: 150,
    height: 450,
    resizeMode: 'contain',
    position: 'absolute'
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
  }
});

export default CompetenceScreen;
