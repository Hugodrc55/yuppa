import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { playFinishSound } from './useSound';



function CompetenceScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CompetenceComponent />
    </>
  );
}

const CompetenceComponent: React.FC = () => {
  const router = useRouter();
  const { selectedTasks } = useLocalSearchParams();
  const taskList = selectedTasks ? JSON.parse(selectedTasks as string) : [];
  const { selectedMissions, selectedJob } = useLocalSearchParams();
  const [softSkillsByTask, setSoftSkillsByTask] = useState<{ [task: string]: string[] }>({});
  const [hardSkillsByTask, setHardSkillsByTask] = useState<{ [task: string]: string[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      const newSoftSkillsByTask: { [task: string]: string[] } = {};
      const newHardSkillsByTask: { [task: string]: string[] } = {};
  
      await Promise.all(
        taskList.map(async (task: string) => {
          try {
            // Soft Skills
            const softSkillsResponse = await fetch('https://backend-fryj.onrender.com/chatbot', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: `Donne-moi une liste de **3 à 6 soft skills** essentiels pour réaliser la tâche '${task}'. Réponds uniquement avec les compétences sous forme de liste, sans numéro ni ponctuation.`
              })
            });
  
            const softData = await softSkillsResponse.json();
            const softSkills = softData.response
              ? softData.response
                  .split('\n')
                  .map((item: string) => item.trim())
                  .filter((item: string) => item !== '')
              : [];
  
            newSoftSkillsByTask[task] = softSkills.length > 0 ? softSkills : ["Aucune compétence trouvée"];
  
            // Hard Skills
            const hardSkillsResponse = await fetch('https://backend-fryj.onrender.com/chatbot', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: `Donne-moi une liste de **3 à 6 hard skills** nécessaires pour réaliser la tâche '${task}'. Réponds uniquement avec les compétences sous forme de liste, sans numéro ni ponctuation.`
              })
            });
  
            const hardData = await hardSkillsResponse.json();
            const hardSkills = hardData.response
              ? hardData.response
                  .split('\n')
                  .map((item: string) => item.trim())
                  .filter((item: string) => item !== '')
              : [];
  
            newHardSkillsByTask[task] = hardSkills.length > 0 ? hardSkills : ["Aucune compétence trouvée"];
          } catch (error) {
            console.error(`Erreur lors du chargement des compétences pour la tâche '${task}':`, error);
            newSoftSkillsByTask[task] = ["Erreur de chargement"];
            newHardSkillsByTask[task] = ["Erreur de chargement"];
          }
        })
      );
  
      setSoftSkillsByTask(newSoftSkillsByTask);
      setHardSkillsByTask(newHardSkillsByTask);
      setLoading(false);
    };
  
    fetchSkills();
  }, [selectedTasks]);
  

  return (
    <View style={{ flex: 1 }}>
  <ScrollView contentContainerStyle={styles.container}>
  <View style={styles.header}>
        <Text style={styles.logo}>YUPPA</Text>
      </View>

      <Image source={require('../assets/progressbar4.png')} style={styles.progressbar} />
      <Text style={styles.title}>Compétences associées</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#5e00ff" />
      ) : (
        taskList.map((task: string, index: number) => (

          <View key={index} style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{task}</Text>

            <Text style={styles.subtitle}>🟢 Soft Skills :</Text>
            {softSkillsByTask[task]?.length > 0 ? (
              softSkillsByTask[task].map((skill, idx) => (
                <Text key={idx} style={styles.skillText}>• {skill}</Text>
              ))
            ) : (
              <Text style={styles.skillText}>Aucune compétence trouvée</Text>
            )}

            <Text style={styles.subtitle}>🔵 Hard Skills :</Text>
            {hardSkillsByTask[task]?.length > 0 ? (
              hardSkillsByTask[task].map((skill, idx) => (
                <Text key={idx} style={styles.skillText}>• {skill}</Text>
              ))
            ) : (
              <Text style={styles.skillText}>Aucune compétence trouvée</Text>
            )}
          </View>
        ))
      )}

<TouchableOpacity 
  style={styles.button} 
  onPress={async () => { 
    await playFinishSound(); 
    router.push({
      pathname: "/final",
      params: { 
        selectedJob,
        selectedMissions, 
        selectedTasks: JSON.stringify(taskList),
        softSkillsByTask: JSON.stringify(softSkillsByTask),
        hardSkillsByTask: JSON.stringify(hardSkillsByTask)
      }
    });
  }}
>
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
returnButtonText: { 
    fontSize: 16, 
    fontFamily: 'LilitaOne-Regular', 
    color: '#333' 
  },
returnButton: { 
    marginTop: 30, 
    backgroundColor: '#ccc', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20 
  },
  subtitle: { 
    fontSize: 16, 
    fontFamily: 'LilitaOne-Regular', 
    marginTop: 10, 
    color: '#5e00ff' 
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
  skillText: { 
    fontSize: 14, 
    color: '#555', 
    marginLeft: 10,
    fontFamily: 'LeagueSpartan-Regular'
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
});

export default CompetenceScreen;
