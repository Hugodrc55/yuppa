//Permet de rendre la page welcomeScreen comme principale
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  return <Redirect href="/WelcomeScreen" />;
}
