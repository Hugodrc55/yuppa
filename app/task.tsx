import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, findNodeHandle, UIManager } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import BurstParticles from './BurstParticles';
import { Audio } from 'expo-av';

function TaskScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TaskComponent />
    </>
  );
}

const TaskComponent: React.FC = () => {
  const router = useRouter();
  const { selectedMissions, selectedJob } = useLocalSearchParams();
  const missionList = selectedMissions ? JSON.parse(selectedMissions as string) : [];
  const [tasksByMission, setTasksByMission] = useState<{ [mission: string]: string[] }>({});
  const [selectedTasks, setSelectedTasks] = useState<{ [task: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  const [particlePosition, setParticlePosition] = useState<{ x: number; y: number } | null>(null);
  const checkboxRefs = useRef<{ [key: string]: any }>({});

  const playPopSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/popclick.wav')
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  };

  const toggleTaskSelection = async (task: string) => {
    setSelectedTasks(prev => ({
      ...prev,
      [task]: !prev[task]
    }));

    await playPopSound();

    const handle = findNodeHandle(checkboxRefs.current[task]);
    if (handle) {
      UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
        setParticlePosition({ x: pageX + width / 2, y: pageY + height / 2 });
        setTimeout(() => setParticlePosition(null), 600);
      });
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const newTasksByMission: { [mission: string]: string[] } = {};

      for (const mission of missionList) {
        try {
          const response = await fetch('https://backend-fryj.onrender.com/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `Liste-moi les tâches associées à la mission '${mission}' en utilisant des phrases courtes et concises, sans numéro devant.`
            })
          });

          const data = await response.json();
          const taskList = data.response
            ? data.response.split('\n').map((item: string) => item.trim()).filter(Boolean)
            : [];

          newTasksByMission[mission] = taskList;
        } catch (error) {
          console.error(`Erreur lors du chargement des tâches pour la mission '${mission}':`, error);
          newTasksByMission[mission] = ["Erreur de chargement des tâches"];
        }
      }

      setTasksByMission(newTasksByMission);
      setLoading(false);
    };

    fetchTasks();
  }, [selectedMissions]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>LOGO</Text>
        </View>

        <Image source={require('../assets/progressbar3.png')} style={styles.progressbar} />
        <Text style={styles.title}>Sélectionnez des tâches</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#5e00ff" />
        ) : (
          missionList.map((mission: string, index: number) => (
            <View key={index} style={styles.missionContainer}>
              <Text style={styles.missionTitle}>{mission}</Text>
              {tasksByMission[mission]?.map((task, idx) => (
                <View key={idx} style={styles.taskItem}>
                  <View ref={ref => (checkboxRefs.current[task] = ref)} collapsable={false}>
                    <Checkbox
                      status={selectedTasks[task] ? 'checked' : 'unchecked'}
                      onPress={() => toggleTaskSelection(task)}
                      color="#5e00ff"
                    />
                  </View>
                  <Text style={styles.taskText}>{task}</Text>
                </View>
              ))}
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const selectedTasksArray = Object.keys(selectedTasks).filter(task => selectedTasks[task]);

            if (selectedTasksArray.length === 0) {
              alert("Veuillez sélectionner au moins une tâche.");
              return;
            }

            router.push({
              pathname: "/competence",
              params: {
                selectedJob,
                selectedMissions,
                selectedTasks: JSON.stringify(selectedTasksArray)
              }
            });
          }}
        >
          <Text style={styles.buttonText}>Voir les compétences</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.returnButton} onPress={() => router.back()}>
          <Text style={styles.returnButtonText}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.characterContainer}>
          <Image source={require('../assets/shivatask.png')} style={styles.characterImage} />
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
        <View
          style={{
            position: 'absolute',
            top: particlePosition.y - 6,
            left: particlePosition.x - 6,
            width: 40,
            height: 40,
            zIndex: 999,
            pointerEvents: 'none',
          }}
        >
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
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#5e00ff',
    width: '100%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  logo: {
    fontSize: 24,
    fontFamily: 'LilitaOne-Regular',
    color: '#ffffff'
  },
  title: {
    fontSize: 24,
    fontFamily: 'LilitaOne-Regular',
    color: '#5e00ff',
    marginVertical: 20,
    textAlign: 'center'
  },
  missionContainer: {
    marginBottom: 20,
    width: '85%'
  },
  missionTitle: {
    fontSize: 18,
    fontFamily: 'LilitaOne-Regular',
    color: '#333',
    marginBottom: 5
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  taskText: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'LeagueSpartan-Regular',
    marginLeft: 10,
    flexShrink: 1
  },
  progressbar: {
    width: 690,
    height: 80,
    marginTop: -10,
    resizeMode: 'contain'
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
    marginTop: 30,
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
    height: 350,
    resizeMode: 'contain',
    position: 'absolute'
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
    borderTopColor: '#ccc'
  }
});

export default TaskScreen;
