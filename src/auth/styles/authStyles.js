import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  // Common Container Styles
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark blue background consistent with theme
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  // Login Screen Styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loginContent: {
    width: '100%',
    maxWidth: 300, // Smaller max width
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30, // Reduced margin
  },
  title: {
    fontSize: 24, // Smaller title
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14, // Smaller subtitle
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // Form Styles
  form: {
    width: '100%',
    marginBottom: 24, // Reduced margin
  },
  inputContainer: {
    marginBottom: 16, // Reduced margin
  },
  label: {
    fontSize: 12, // Smaller label
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6, // Reduced margin
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 6, // Smaller border radius
    padding: 12, // Reduced padding
    fontSize: 14, // Smaller font
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#334155',
  },
  loginButton: {
    backgroundColor: '#D72638', // Red theme color consistent with existing app
    borderRadius: 6, // Smaller border radius
    padding: 12, // Reduced padding
    alignItems: 'center',
    marginTop: 12, // Reduced margin
    width: '100%',
  },
  loginButtonDisabled: {
    backgroundColor: '#7F1D1D',
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14, // Smaller font
    fontWeight: '600',
  },

  // Footer Styles
  footer: {
    alignItems: 'center',
    marginTop: 20, // Reduced margin
  },
  footerText: {
    fontSize: 12, // Smaller font
    color: '#9CA3AF',
  },
  footerLink: {
    color: '#D72638',
    fontWeight: '600',
  },

  // Gamepad Selection Screen Styles
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  selectionContent: {
    width: '100%',
    maxWidth: 280, // Smaller max width
    alignItems: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginVertical: 24, // Reduced margin
    gap: 12, // Reduced gap
  },
  optionButton: {
    backgroundColor: '#1E293B',
    borderRadius: 8, // Smaller border radius
    padding: 16, // Reduced padding
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  optionContent: {
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 32, // Smaller icon
    marginBottom: 8, // Reduced margin
  },
  optionTitle: {
    fontSize: 16, // Smaller title
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6, // Reduced margin
  },
  optionDescription: {
    fontSize: 12, // Smaller description
    color: '#9CA3AF',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 6, // Smaller border radius
    padding: 12, // Reduced padding
    alignItems: 'center',
    marginTop: 24, // Reduced margin
    width: '100%',
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 14, // Smaller font
    fontWeight: '600',
  },
});
