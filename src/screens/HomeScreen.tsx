import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { userUserLoaded, useUser } from '../atoms/user';
import { getProfile } from '../services/User';
import { deleteToken } from '../services/Storage';

interface HomeScreenProps {
  onNavigateToCustomScreen?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToCustomScreen,
}) => {
  const navigator = useNavigation<any>();
  const [user, setUser] = useUser();
  const [userLoaded, setUserLoaded] = userUserLoaded();

  useEffect(() => {
    getProfile()
      .then(data => {
        setUser(data);
        setUserLoaded(true);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, []);

  const handleButton = (screen: any) => {
    navigator.navigate(screen);
  };

  const logout = () => {
    deleteToken();
  }
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectionContainer}>
        <View style={styles.selectionContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Robolink</Text>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleButton('GamepadInputs')}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>🎮</Text>
                <Text style={styles.optionTitle}>Physical Gamepad</Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {}}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>🖥️</Text>
                <Text style={styles.optionTitle}>Create IoT Apps</Text>
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleButton('CustomControllerList')}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>📱</Text>
                <Text style={styles.optionTitle}>Your Apps</Text>
              </View>
            </TouchableOpacity>
          </View>

          {userLoaded && user ? (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Log out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleButton('Login')}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>🔒</Text>
                <Text style={styles.optionTitle}>Login</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  // Common Container Styles
  container: {
    flex: 1,
    backgroundColor: '#170F11',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: '100%', // Ensure full height for proper centering
  },
  header: {
    alignItems: 'center',
    marginBottom: 20, // More compact
  },
  title: {
    fontSize: 20, // Even smaller title
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  // Home Screen Styles
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  selectionContent: {
    width: '100%',
    maxWidth: 260, // Even smaller max width
    alignItems: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginVertical: 20, // More compact
    gap: 8, // Smaller gap for slim buttons
  },
  optionButton: {
    backgroundColor: '#1f181aff',
    borderRadius: 4, // Smaller border radius
    padding: 10, // Compact padding for slim buttons
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: '100%',
  },
  optionContent: {
    flexDirection: 'row', // Horizontal layout for slim buttons
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIcon: {
    fontSize: 20, // Smaller icon for slim design
    marginRight: 8, // Space between icon and text
  },
  optionTitle: {
    fontSize: 14, // Smaller title for slim design
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  optionDescription: {
    display: 'none', // Hide description for slim design
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 4, // Smaller border radius
    padding: 10, // Compact padding
    alignItems: 'center',
    marginTop: 20, // More compact margin
    width: '100%',
    height: 36, // Slim height
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 12, // Smaller font
    fontWeight: '600',
  },
});
