//Meme import que la page compétences
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
//Fonctions natives Expo pour générer, enregistrer, partager, et envoyer un PDF par mail
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';


function FinalScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FinalComponent />
    </>
  );
}

const FinalComponent: React.FC = () => {
  //Récupère les données passées depuis la page précédente : métier, missions, tâches et compétences sélectionnées
  const router = useRouter();
  const { selectedJob, selectedMissions, selectedTasks, softSkillsByTask, hardSkillsByTask } = useLocalSearchParams();

  //Formatage des chaînes JSON pour les utiliser comme objets/tableaux
  const job = selectedJob as string;
  const missionList = selectedMissions ? JSON.parse(selectedMissions as string) : [];
  const taskList = selectedTasks ? JSON.parse(selectedTasks as string) : [];
  const softSkills = softSkillsByTask ? JSON.parse(softSkillsByTask as string) : {};
  const hardSkills = hardSkillsByTask ? JSON.parse(hardSkillsByTask as string) : {};

  //Gère le chargement du PDF et l’état de l’animation de confettis
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); 
  const [confettiKey, setConfettiKey] = useState(0);

  //Joue un son de réussite à la fin du parcours
  const playFinishSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/finish.wav') 
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  };
  

  useEffect(() => {
    setConfettiKey(prev => prev + 1); 
    setShowConfetti(true); 
    playFinishSound();
  }, []);

  //Crée une structure HTML ,génère un fichier PDF, le déplace dans le système de fichiers, l’attache à un mail pour une RH + propose le partage
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
          <ul>${missionList.map((m: any) => `<li>${m}</li>`).join("")}</ul>
          <h2>Tâches & Compétences :</h2>
          ${taskList.map((task: string | number) => {
            const soft = (softSkills[task] || []).filter((s: string) => s.trim() !== '');
            const hard = (hardSkills[task] || []).filter((s: string) => s.trim() !== '');
            if (soft.length === 0 && hard.length === 0) return '';

            return `
              <h3>📌 ${task}</h3>
              ${soft.length > 0 ? `<strong>Soft Skills :</strong><ul>${soft.map((s: any) => `<li>${s}</li>`).join('')}</ul>` : ''}
              ${hard.length > 0 ? `<strong>Hard Skills :</strong><ul>${hard.map((s: any) => `<li>${s}</li>`).join('')}</ul>` : ''}
            `;
          }).join("")}
          <p style="margin-top: 30px; color: #888">Merci d'avoir utilisé Yuppa !</p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const newPath = FileSystem.documentDirectory + `Yuppa-Parcours-${Date.now()}.pdf`;
      await FileSystem.moveAsync({ from: uri, to: newPath });

      await MailComposer.composeAsync({
        recipients: ['contact.formaplus@gmail.com'],
        subject: 'PDF de parcours Yuppa',
        body: 'Veuillez trouver ci-joint le PDF du parcours utilisateur.',
        attachments: [newPath],
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath);
      } else {
        alert("Le partage n’est pas disponible sur cet appareil.");
      }
    } catch (error) {
      console.error("Erreur PDF :", error);
      alert("Une erreur est survenue. Impossible de générer le PDF.");
    }

    setPdfLoading(false);
  };

  return (
    //Affichage UI
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <SafeAreaView style={styles.header}>
          <Text style={styles.logo}>YUPA</Text>
        </SafeAreaView>

        <Image source={require('../assets/progressbar5.png')} style={styles.progressbar} />
        <Text style={styles.title}>Récapitulatif de votre parcours</Text>

        <Text style={styles.subTitle}>🎯 Métier & missions sélectionnées :</Text>
        <View style={[styles.taskContainer, { alignItems: 'center' }]}>
          <Text style={styles.jobLabel}>Métier</Text>
          <Text style={styles.jobText}>{job}</Text>

          <Text style={styles.MiLabel}>Missions</Text>
          {missionList.map((m: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, i: React.Key | null | undefined) => (
            <Text key={i} style={styles.MiText}>• {m}</Text>
          ))}
        </View>

        <Text style={styles.subTitle}>✅ Tâches et compétences à travailler :</Text>
        {taskList.map((task: string, i: number) => {
          const selectedSoft = (softSkills[task] || []).filter((s: string) => s.trim() !== '');
          const selectedHard = (hardSkills[task] || []).filter((s: string) => s.trim() !== '');

          if (selectedSoft.length === 0 && selectedHard.length === 0) return null;

          return (
            <View key={i} style={styles.taskContainer}>
              <Text style={styles.taskTitle}>{task}</Text>

              {selectedSoft.length > 0 && (
                <>
                  <Text style={styles.skillLabel}>Soft Skills :</Text>
                  {selectedSoft.map((s: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, idx: React.Key | null | undefined) => (
                    <Text key={idx} style={styles.skillText}>• {s}</Text>
                  ))}
                </>
              )}

              {selectedHard.length > 0 && (
                <>
                  <Text style={styles.skillLabel}>Hard Skills :</Text>
                  {selectedHard.map((s: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, idx: React.Key | null | undefined) => (
                    <Text key={idx} style={styles.skillText}>• {s}</Text>
                  ))}
                </>
              )}
            </View>
          );
        })}
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
        <TouchableOpacity onPress={() => router.push('/HomeScreen')}><Ionicons name="home-outline" size={30} color="#5e00ff" /></TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/metiers')}><Ionicons name="search-outline" size={30} color="#5e00ff" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="person-outline" size={30} color="#5e00ff" /></TouchableOpacity>
      </View>

      {showConfetti && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          pointerEvents: 'none',
        }}>
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
  container: { flexGrow: 1, alignItems: 'center', backgroundColor: '#ffffff', paddingBottom: 120 },
  header: {
    backgroundColor: '#5e00ff', width: '100%', paddingVertical: Platform.OS === 'ios' ? 10 : 40,
    alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  logo: {
    paddingTop: Platform.OS === 'ios' ? 55 : 25, color: 'white', fontSize: 28,
    fontFamily: 'LilitaOne-Regular', position: 'absolute'
  },
  title: {
    fontSize: 24, fontFamily: 'LilitaOne-Regular', color: '#5e00ff', marginVertical: 20, textAlign: 'center'
  },
  progressbar: {
    width: Platform.OS === 'ios' ? 710 : 690, height: Platform.OS === 'ios' ? 95 : 80, marginTop: -10,
    resizeMode: 'contain',
  },
  subTitle: {
    fontSize: 18, fontFamily: 'LilitaOne-Regular', color: '#5e00ff', marginTop: 20
  },
  jobText: {
    fontSize: 20, color: '#000000', marginBottom: 3, fontFamily: 'LilitaOne-Regular', textAlign: 'center'
  },
  MiText: {
    fontSize: 15, color: '#000000', marginBottom: 3, fontFamily: 'LeagueSpartan-Regular'
  },
  taskContainer: {
    marginTop: 20, width: '90%', backgroundColor: '#f9f9f9', borderRadius: 12,
    padding: 15, borderWidth: 1, borderColor: '#e0e0e0',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
  },
  taskTitle: {
    fontSize: 17, fontFamily: 'LilitaOne-Regular', color: '#000', marginBottom: 8
  },
  skillLabel: {
    fontFamily: 'LilitaOne-Regular', marginTop: 12, marginBottom: 4, color: '#5e00ff', fontSize: 16
  },
  skillText: {
    fontSize: 14, color: '#444', marginLeft: 10, marginBottom: 3, fontFamily: 'LeagueSpartan-Regular'
  },
  button: {
    backgroundColor: '#5e00ff', paddingVertical: 14, paddingHorizontal: 40,
    borderRadius: 30, marginVertical: 10, alignSelf: 'center'
  },
  buttonText: {
    fontSize: 16, fontFamily: 'LilitaOne-Regular', color: '#ffffff', textAlign: 'center'
  },
  bottomNav: {
    position: 'absolute', bottom: 0, width: '100%', height: Platform.OS === 'ios' ? 80 : 60,
    backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-around',
    alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ccc',
  },
  jobLabel: {
    fontFamily: 'LilitaOne-Regular', marginTop: 12, marginBottom: 4,
    color: '#5e00ff', fontSize: 16, textAlign: 'center'
  },
  MiLabel: {
    fontFamily: 'LilitaOne-Regular', marginTop: 12, marginBottom: 4,
    color: '#5e00ff', fontSize: 16, textAlign: 'center'
  },
});

export default FinalScreen;
