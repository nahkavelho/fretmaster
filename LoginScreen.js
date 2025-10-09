import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "./firebase";

const inputStyle = { marginBottom: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff' };
const buttonStyle = { marginBottom: 10, borderRadius: 8 };
const titleStyle = { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#543310' };

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [success, setSuccess] = useState(false);
  const alreadySignedIn = !!auth.currentUser;

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
    <View style={{ padding: 24, flex: 1, justifyContent: 'center', backgroundColor: '#F8F4E1' }}>
      <Text style={titleStyle}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
      {isSignUp && (
        <TextInput
          placeholder="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          style={inputStyle}
          placeholderTextColor="#aaa"
        />
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={inputStyle}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={inputStyle}
        placeholderTextColor="#aaa"
      />
      <View style={buttonStyle}>
        <Button title={isSignUp ? "Sign Up" : "Login"} onPress={handleAuth} color="#AF8F6F" />
      </View>
      <View style={buttonStyle}>
        <Button
          title={isSignUp ? "Already have an account? Login" : (alreadySignedIn ? "You are logged in" : "No account? Sign Up")}
          onPress={() => { if (alreadySignedIn) return; setIsSignUp(!isSignUp); setError(""); setSuccess(false); setDisplayName(""); }}
          color="#74512D"
          disabled={alreadySignedIn}
        />
      </View>
      {alreadySignedIn && (
        <Text style={{ color: '#543310', marginTop: 6, textAlign: 'center' }}>
          You are currently signed in. Log out from the Profile screen to create a new account.
        </Text>
      )}
      {success && <Text style={{ color: 'green', marginTop: 10, textAlign: 'center' }}>Login successful! Redirecting...</Text>}
      {error ? <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{error}</Text> : null}
    </View>
  );
}
