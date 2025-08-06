import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  // Common Container Styles
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark blue background consistent with theme
  },  // Login Screen Styles
  loginContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: '100%', // Ensure full height for proper centering
  },
  loginContent: {
    width: '100%',
    maxWidth: 280, // Even smaller max width
    alignItems: 'center',
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
  subtitle: {
    fontSize: 12, // Even smaller subtitle
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // Form Styles
  form: {
    width: '100%',
    marginBottom: 16, // More compact
  },
  inputContainer: {
    marginBottom: 12, // More compact
  },
  label: {
    fontSize: 11, // Smaller label
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4, // More compact
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 4, // Smaller border radius
    padding: 10, // More compact padding
    fontSize: 13, // Smaller font
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#334155',
    height: 40, // Fixed compact height
  },
  loginButton: {
    backgroundColor: '#D72638',
    borderRadius: 4, // Smaller border radius
    padding: 10, // More compact padding
    alignItems: 'center',
    marginTop: 8, // More compact margin
    width: '100%',
    height: 36, // Slim height
  },
  loginButtonDisabled: {
    backgroundColor: '#7F1D1D',
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 13, // Smaller font
    fontWeight: '600',
  },

  // Footer Styles
  footer: {
    alignItems: 'center',
    marginTop: 16, // More compact
  },
  footerText: {
    fontSize: 11, // Smaller font
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
    backgroundColor: '#1E293B',
    borderRadius: 4, // Smaller border radius
    padding: 20, // Compact padding for slim buttons
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
    height: 50, // Slim height
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
