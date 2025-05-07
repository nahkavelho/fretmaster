import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
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

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          setError("Display name is required.");
          setSuccess(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await import('firebase/auth').then(({ updateProfile }) => updateProfile(userCredential.user, { displayName }));
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setSuccess(true);
      setError("");
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
      }, 1200);
    } catch (e) {
      setError(e.message);
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
          title={isSignUp ? "Already have an account? Login" : "No account? Sign Up"}
          onPress={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(false); setDisplayName(""); }}
          color="#74512D"
        />
      </View>
      {success && <Text style={{ color: 'green', marginTop: 10, textAlign: 'center' }}>Login successful! Redirecting...</Text>}
      {error ? <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{error}</Text> : null}
    </View>
  );
}
