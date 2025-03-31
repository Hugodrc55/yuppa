import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';

function MetiersScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MetiersComponent />
    </>
  );
}

const MetiersComponent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const router = useRouter();

  const jobCategories: { [key: string]: string[] } = {
    "Développement & Programmation ": [
      "Développeur Front-end",
      "Développeur Back-end",
      "Développeur Full-stack",
      "Développeur Mobile",
      "Ingénieur DevOps",
      "Développeur Web3/Blockchain",
      "Architecte Logiciel",
      "Développeur API"
    ],
    "Data & Intelligence Artificielle ": [
      "Data Scientist",
      "Data Analyst",
      "Ingénieur en Machine Learning",
      "Data Engineer"
    ],
    "Cybersécurité": [
      "Analyste en cybersécurité",
      "Pentester (hacker éthique)",
      "Ingénieur en sécurité informatique",
      "Responsable de la conformité RGPD",
      "Ingénieur en cybersécurité",
      "Analyste SOC",
      "Administrateur Systèmes & Réseaux"

    ],
    "Cloud & Infrastructure": [
      "Architecte Cloud",
      "Ingénieur en virtualisation",
      
    ],
    "Marketing Digital & Growth Hacking": [
      "SEO/SEA Manager",
      "Traffic Manager",
      "Web Analyst",
      "Growth Hacker",
      "CRM Manager",
      "Digital Marketing Manager",
      "E-commerce Manager",
      "Community Manager"
    ],
    "Design & Expérience Utilisateur (UX/UI) ": [
      "UI Designer",
      "UX Designer",
      "Motion Designer"
      
    ],
    "Gestion de projets & Innovation ": [
      "Chef de projet digital",
      "Product Owner",
      "Scrum Master"
      
    ],
    "Jeux Vidéo & Réalité Virtuelle": [
      "Game Developer",
      "Game Designer",
      "Développeur VR/AR"
      
    ],
    "Entrepreneuriat & Startups (French Tech) ": [
      "Startup Founder",
      "Business Developer",
      "Responsable levée de fonds"
      
    ],
    "Télécommunications & Satellite": [
      "Ingénieur Réseaux et Télécom",
      "Ingénieur Spatial"
    ],
    "Ressources Humaines (RH)": [
      "Responsable RH / HR Business",
      "Talent Acquisition Manager / Chargé de recrutement",
      "People Analyst / HR Data Analyst",
      "Responsable Formation",
      "Chargé de la paie et de l'administration du personnel",
      "Responsable Marque Employeur"
    ],
    "Communication & Relations Publiques": [
      "Responsable Communication",
      "Social Media Manager",
      "Content Manager / Rédacteur Web",
      "Responsable Relations Presse (RP)",
      "Brand Manager"
    ],
    "Commerce & Business Development": [
      "Business Developer (B2B/B2C)",
      "Key Account Manager",
      "Category Manager",
      "Responsable Partenariats",
      "Responsable des ventes"
    ]
    
  };

  const categoryItems = Object.keys(jobCategories).map(label => ({ label, value: label }));
  const jobItems = selectedCategory
    ? jobCategories[selectedCategory].map(job => ({ label: job, value: job }))
    : [];

  const handleSubmit = async () => {
    if (!selectedJob) return alert("Veuillez choisir un métier.");

    setLoadingMissions(true);
    try {
      const response = await fetch('https://backend-fryj.onrender.com/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Fais-moi une liste d'au moins 6 missions concises et claires du métier ${selectedJob}.`
        })
      });

      const data = await response.json();
      const missions = data.response?.split('\n').map((item: string) => item.trim()).filter(Boolean) || [];

      router.push({
        pathname: '/mission',
        params: {
          missions: JSON.stringify(missions),
          selectedJob,
        },
      });
    } catch (error) {
      console.error("Erreur:", error);
    }
    setLoadingMissions(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}><Text style={styles.logo}>YUPPA</Text></View>
      <Image source={require('../assets/progressbar1.png')} style={styles.progressbar} />
      <Text style={styles.title}>Choisissez le métier</Text>

      <Dropdown
        style={styles.dropdown}
        data={categoryItems}
        labelField="label"
        valueField="value"
        placeholder="Catégorie"
        value={selectedCategory}
        placeholderStyle={styles.dropdownText}
        selectedTextStyle={styles.dropdownText}
        itemTextStyle={styles.dropdownText}
        containerStyle={{ borderRadius: 20 }}
        activeColor="#e9d6ff"
        onChange={item => {
          setSelectedCategory(item.value);
          setSelectedJob(null);
        }}
      />

      {selectedCategory && (
        <Dropdown
          style={[styles.dropdown, { marginTop: 20 }]}
          data={jobItems}
          labelField="label"
          valueField="value"
          placeholder="Métier"
          value={selectedJob}
          placeholderStyle={styles.dropdownText}
          selectedTextStyle={styles.dropdownText}
          itemTextStyle={styles.dropdownText}
          containerStyle={{ borderRadius: 20 }}
          activeColor="#e9d6ff"
          onChange={item => setSelectedJob(item.value)}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {loadingMissions ? "Chargement..." : "Soumettre"}
        </Text>
      </TouchableOpacity>

      <Image source={require('../assets/shiva_worker.png')} style={styles.illustration} />

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    alignItems: 'center', 
    backgroundColor: '#fff' 
  },
  header: {
    backgroundColor: '#5e00ff', 
    height: 70, 
    width: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10
  },
  logo: { fontSize: 24, 
    fontFamily: 'LilitaOne-Regular', 
    color: '#fff' 
  },
  title: {
    fontSize: 24, 
    fontFamily: 'LilitaOne-Regular',
    color: '#5e00ff', 
    marginVertical: 20, 
    textAlign: 'center',
  },
  dropdown: {
    width: '85%',
    height: 55,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'LeagueSpartan-Regular',
    color: '#333',
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
    color: '#fff', 
    textAlign: 'center',
  },
  illustration: {
    width: 190, 
    height: 190, 
    marginTop: 450,
    resizeMode: 'contain', 
    position: 'absolute',
    right: 20,
  },
  progressbar: {
    width: 690, 
    height: 80, 
    marginTop: -10,
    resizeMode: 'contain',
  },
  bottomNav: {
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    height: 60,
    backgroundColor: '#fff', 
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center',
    borderTopWidth: 1, 
    borderTopColor: '#ccc',
  },
});

export default MetiersScreen;
