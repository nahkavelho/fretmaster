import React, { useState, useEffect, useContext } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithCredential, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { ThemeContext } from "./app/ThemeContext";

// Google OAuth Client ID from Google Cloud Console
const GOOGLE_WEB_CLIENT_ID = "650240327074-17n9muoct6b54bg9d3pdoe13u9t0hnfc.apps.googleusercontent.com";

// Native Google Sign-In (only imported on native platforms)
let GoogleSignin = null;
if (Platform.OS !== 'web') {
  try {
    const nativeGoogle = require('@react-native-google-signin/google-signin');
    GoogleSignin = nativeGoogle.GoogleSignin;
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  } catch (e) {
    console.log('Native Google Sign-In not available:', e.message);
  }
}

export default function LoginScreen({ onLoginSuccess }) {
  const { palette } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [success, setSuccess] = useState(false);
  const alreadySignedIn = !!auth.currentUser;

  const handleGoogleSignIn = async () => {
    try {
      if (Platform.OS === 'web') {
        // Use Firebase popup on web
        await signInWithPopup(auth, googleProvider);
        setSuccess(true);
        setError("");
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess();
        }, 1200);
      } else if (GoogleSignin) {
        // Use native Google Sign-In on phone
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo?.data?.idToken || userInfo?.idToken;
        if (!idToken) {
          setError('Failed to get Google ID token.');
          return;
        }
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
        setSuccess(true);
        setError("");
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess();
        }, 1200);
      } else {
        setError('Google Sign-In is not available on this device.');
      }
    } catch (e) {
      if (e?.code === 'SIGN_IN_CANCELLED' || e?.code === '12501') {
        // User cancelled, don't show error
        return;
      }
      setError(e?.message || 'Google sign-in failed.');
      setSuccess(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: 24,
      flex: 1,
      justifyContent: 'center',
      backgroundColor: palette.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: palette.text,
    },
    input: {
      marginBottom: 10,
      borderWidth: 1,
      borderColor: palette.textSecondary,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: palette.card || palette.modalBackground,
      color: palette.text,
    },
    buttonContainer: {
      marginBottom: 10,
      borderRadius: 8,
    },
    infoText: {
      color: palette.textSecondary,
      marginTop: 6,
      textAlign: 'center',
    },
    successText: {
      color: palette.primary,
      marginTop: 10,
      textAlign: 'center',
    },
    errorText: {
      color: palette.notification,
      marginTop: 10,
      textAlign: 'center',
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: palette.textSecondary,
      opacity: 0.4,
    },
    dividerText: {
      marginHorizontal: 12,
      color: palette.textSecondary,
      fontSize: 14,
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.card || palette.modalBackground,
      borderWidth: 1,
      borderColor: palette.textSecondary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 10,
    },
    googleButtonText: {
      color: palette.text,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 10,
    },
    googleIcon: {
      fontSize: 20,
      fontWeight: 'bold',
    },
  });

  // Prevent switching to Sign Up if already signed in
  useEffect(() => {
    if (alreadySignedIn && isSignUp) {
      setIsSignUp(false);
    }
  }, [alreadySignedIn, isSignUp]);

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        // Prevent creating a second account while already signed in
        if (auth.currentUser) {
          setError("You're already signed in. Please log out before creating a new account.");
          setSuccess(false);
          return;
        }
        if (!displayName.trim()) {
          setError("Display name is required.");
          setSuccess(false);
          return;
        }
        const trimmedEmail = email.trim();
        // Optional pre-check for existing email for nicer UX
        const methods = await fetchSignInMethodsForEmail(auth, trimmedEmail);
        if (methods && methods.length > 0) {
          setError("An account with this email already exists. Please log in instead.");
          setSuccess(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        await import('firebase/auth').then(({ updateProfile }) => updateProfile(userCredential.user, { displayName }));
      } else {
        const trimmedEmail = email.trim();
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
      }
      setSuccess(true);
      setError("");
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
      }, 1200);
    } catch (e) {
      // Map common Firebase auth error codes to friendly messages
      const code = e && e.code ? String(e.code) : "";
      switch (code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists. Please log in.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address. Please check and try again.');
          break;
        case 'auth/weak-password':
          setError('Weak password. Please choose a stronger password.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError(e?.message || 'Authentication failed.');
      }
      setSuccess(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
      {isSignUp && (
        <TextInput
          placeholder="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
          placeholderTextColor={palette.textSecondary}
        />
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        placeholderTextColor={palette.textSecondary}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor={palette.textSecondary}
      />
      <View style={styles.buttonContainer}>
        <Button title={isSignUp ? "Sign Up" : "Login"} onPress={handleAuth} color={palette.primary} />
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={alreadySignedIn}
        activeOpacity={0.7}
      >
        <Text style={styles.googleIcon}>G</Text>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <Button
          title={isSignUp ? "Already have an account? Login" : (alreadySignedIn ? "You are logged in" : "No account? Sign Up")}
          onPress={() => { if (alreadySignedIn) return; setIsSignUp(!isSignUp); setError(""); setSuccess(false); setDisplayName(""); }}
          color={palette.button}
          disabled={alreadySignedIn}
        />
      </View>
      {alreadySignedIn && (
        <Text style={styles.infoText}>
          You are currently signed in. Log out from the Profile screen to create a new account.
        </Text>
      )}
      {success && <Text style={styles.successText}>Login successful! Redirecting...</Text>}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
