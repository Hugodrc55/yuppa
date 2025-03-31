import { useColorScheme } from 'react-native';

export const useAppTheme = () => {
  const scheme = useColorScheme();

  const isDark = scheme === 'dark';

  const colors = {
    background: isDark ? '#121212' : '#ffffff',
    text: isDark ? '#ffffff' : '#121212',
    primary: '#5e00ff',
    card: isDark ? '#1f1f1f' : '#f2f2f2',
    border: isDark ? '#333' : '#ccc',
  };

  return { colors, isDark };
};
