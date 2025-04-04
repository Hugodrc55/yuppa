import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
//Composant qui permet le menu deroulant
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const router = useRouter();
  // Liste métier par catégorie
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

    const handleSubmit = () => {
      if (!selectedJob) {
        alert("Veuillez choisir un métier.");
        return;
      }
    
      router.push({
        pathname: '/mission',
        params: {
          selectedJob,
        },
      });
    };
    

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.header}>
        <Text style={styles.logo}>YUPA</Text>
      </SafeAreaView>

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
        <Text style={styles.buttonText}>Soumettre</Text>
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
    position: 'absolute',
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 28 : 24,
    fontFamily: 'LilitaOne-Regular',
    color: '#5e00ff',
    marginVertical: 20,
    textAlign: 'center',
  },
  dropdown: {
    width: '85%',
    height: Platform.OS === 'ios' ? 65 : 55,
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
    fontSize: Platform.OS === 'ios' ? 20 : 16,
    fontFamily: 'LeagueSpartan-Regular',
    color: '#333',
  },
  button: {
    backgroundColor: '#5e00ff',
    paddingVertical: Platform.OS === 'ios' ? 18 : 14,
    paddingHorizontal: Platform.OS === 'ios' ? 44 : 40,
    borderRadius: 30,
    marginVertical: 20,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: Platform.OS === 'ios' ? 20 : 16,
    fontFamily: 'LilitaOne-Regular',
    color: '#fff',
    textAlign: 'center',
  },
  illustration: {
    width: Platform.OS === 'ios' ? 230 : 190,
    height: Platform.OS === 'ios' ? 230 : 190,
    marginTop: Platform.OS === 'ios' ? 550 : 450,
    resizeMode: 'contain',
    position: 'absolute',
    right: 20,
  },
  progressbar: {
    width: Platform.OS === 'ios' ? 710 : 690,
    height: Platform.OS === 'ios' ? 95 : 80,
    marginTop: -10,
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

export default MetiersScreen;
