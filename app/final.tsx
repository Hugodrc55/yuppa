import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import ConfettiCannon from 'react-native-confetti-cannon';

function FinalScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FinalComponent />
    </>
  );
}

const FinalComponent: React.FC = () => {
  const router = useRouter();
  const { selectedJob, selectedMissions, selectedTasks, softSkillsByTask, hardSkillsByTask } = useLocalSearchParams();

  const job = selectedJob as string;
  const missionList = selectedMissions ? JSON.parse(selectedMissions as string) : [];
  const taskList = selectedTasks ? JSON.parse(selectedTasks as string) : [];
  const softSkills = softSkillsByTask ? JSON.parse(softSkillsByTask as string) : {};
  const hardSkills = hardSkillsByTask ? JSON.parse(hardSkillsByTask as string) : {};

  const [pdfLoading, setPdfLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); 
  const [confettiKey, setConfettiKey] = useState(0);

  useEffect(() => {
    setConfettiKey(prev => prev + 1); 
    setShowConfetti(true); 
  }, []);
  

  const generateAndShowPdf = async () => {
    setPdfLoading(true);

    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2 { color: #5e00ff; }
            ul { padding-left: 20px; }
            li { margin-bottom: 6px; }
          </style>
        </head>
        <body>
          <h1>🚀 Récapitulatif de votre parcours</h1>
          <p><strong>Métier sélectionné :</strong> ${job}</p>

          <h2>Missions :</h2>
          <ul>
            ${missionList.map((m: string) => `<li>${m}</li>`).join("")}
          </ul>

          <h2>Tâches & Compétences :</h2>
          ${taskList.map((task: string) => `
            <h3>📌 ${task}</h3>
            <strong>Soft Skills :</strong>
            <ul>${(softSkills[task] || []).map((s: string) => `<li>${s}</li>`).join("")}</ul>
            <strong>Hard Skills :</strong>
            <ul>${(hardSkills[task] || []).map((s: string) => `<li>${s}</li>`).join("")}</ul>
          `).join("")}

          <p style="margin-top: 30px; color: #888">Merci d'avoir utilisé Yuppa !</p>
        </body>
      </html>
    `;

    try {
      await Print.printAsync({ html: htmlContent }); // ⬅️ Ouvre un aperçu imprimable / téléchargeable
    } catch (error) {
      console.error("Erreur PDF :", error);
      alert("Impossible de générer le PDF.");
    }
  
    setPdfLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}><Text style={styles.logo}>YUPPA</Text></View>
        <Image source={require('../assets/progressbar5.png')} style={styles.progressbar} />
        <Text style={styles.title}>Récapitulatif de votre parcours</Text>

        <Text style={styles.subTitle}>🎯 Métier sélectionné :</Text>
        <Text style={styles.taskText}>{job}</Text>

        <Text style={styles.subTitle}>🧩 Missions :</Text>
        {missionList.map((m: string, i: number) => (
          <Text key={i} style={styles.taskText}>• {m}</Text>
        ))}

        <Text style={styles.subTitle}>✅ Tâches et compétences :</Text>
        {taskList.map((task: string, i: number) => (
          <View key={i} style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{task}</Text>
            <Text style={styles.skillLabel}>Soft Skills :</Text>
            {(softSkills[task] || []).map((s: string, idx: number) => (
              <Text key={idx} style={styles.skillText}>• {s}</Text>
            ))}
            <Text style={styles.skillLabel}>Hard Skills :</Text>
            {(hardSkills[task] || []).map((s: string, idx: number) => (
              <Text key={idx} style={styles.skillText}>• {s}</Text>
            ))}
          </View>
        ))}


      </ScrollView>
      <TouchableOpacity 
        style={[styles.button, { position: 'absolute', bottom: 80, alignSelf: 'center' }]} 
        onPress={generateAndShowPdf}
        disabled={pdfLoading}
      >
      <Text style={styles.buttonText}>
        {pdfLoading ? "Génération..." : "Recevoir le PDF"}
      </Text>
      </TouchableOpacity>

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
  {showConfetti && (
  <View
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      pointerEvents: 'none',
    }}
  >
    <ConfettiCannon
      key={confettiKey} 
      count={150}
      origin={{ x: 200, y: 0 }}
      fadeOut={true}
      fallSpeed={2500}
      explosionSpeed={300}
      autoStart={true}
      colors={['#5e00ff', '#8a2be2', '#00ffcc', '#ffffff', '#000000']}
    />
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
    paddingBottom: 120 // espace en bas pour le bouton
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
  subTitle: { 
    fontSize: 18, 
    fontFamily: 'LilitaOne-Regular', 
    color: '#5e00ff', 
    marginTop: 20 
  },
  title: { 
    fontSize: 24, 
    fontFamily: 'LilitaOne-Regular', 
    color: '#5e00ff', 
    marginVertical: 20, 
    textAlign: 'center' 
  },
  progressbar: { 
    width: 690, 
    height: 80, 
    marginTop: -10, 
    resizeMode: 'contain' 
  },
  taskContainer: { 
    marginTop: 20, 
    width: '90%', 
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  taskTitle: { 
    fontSize: 17, 
    fontFamily: 'LilitaOne-Regular', 
    color: '#000',
    marginBottom: 8 
  },
  skillLabel: { 
    fontFamily: 'LilitaOne-Regular', 
    marginTop: 12,
    marginBottom: 4,
    color: '#5e00ff',
    fontSize: 16
  },
  skillText: { 
    fontSize: 14,
    color: '#444', 
    marginLeft: 10,
    marginBottom: 3,
    fontFamily: 'LeagueSpartan-Regular'
  },
  taskText: { 
    fontFamily: 'LilitaOne-Regular', 
    color: '#333', 
    marginVertical: 5 
  },
  recapContainer: { 
    marginBottom: 20, 
    width: '85%', 
    padding: 10, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 10,
    backgroundColor: '#fefefe'
  },
  button: { 
    backgroundColor: '#5e00ff', 
    paddingVertical: 14, 
    paddingHorizontal: 40, 
    borderRadius: 30, 
    marginVertical: 10, 
    alignSelf: 'center'
  },
  buttonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#ffffff', 
    textAlign: 'center' 
  },
  returnButton: { 
    marginTop: 20, 
    backgroundColor: '#ccc', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20 
  },
  returnButtonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  characterContainer: { 
    marginBottom: 60, 
    alignItems: 'center' 
  },
  characterImage: { 
    width: 150, 
    height: 150, 
    resizeMode: 'contain' 
  }
});


export default FinalScreen;
