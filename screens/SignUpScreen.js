import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
     const response = await axios.post("http://192.168.68.104:5000/api/users/signup", {
  fullName,
  email,
  password,
});



      if (response.data) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Signup Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backContainer}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* HEADER */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Let’s</Text>
            <Text style={[styles.headerText, styles.boldText]}>Create</Text>
            <Text style={[styles.headerText, styles.boldText]}>Your</Text>
            <Text style={[styles.headerText, styles.boldText]}>Account</Text>
          </View>

          {/* FORM */}
          <LinearGradient
            colors={["#f5a7abff", "#f5a7abff"]}
            style={styles.gradientContainer}
          >
            <View style={styles.formArea}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirm ? "eye-off" : "eye"}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={styles.signUpText}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  Already have an account?{" "}
                  <Text
                    style={styles.loginLink}
                    onPress={() => navigation.navigate("Login")}
                  >
                    Login
                  </Text>
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scroll: { flexGrow: 1 },
  headerContainer: {
    paddingTop: 30,
    paddingLeft: 30,
    paddingBottom: 20,
    backgroundColor: "#e97076ff",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerText: {
    fontSize: 34,
    color: "#f7e5e6ff",
    fontWeight: "400",
    lineHeight: 42,
  },
  boldText: {
    fontWeight: "bold",
  },
  gradientContainer: {
    flex: 1,
    overflow: "hidden",
    paddingVertical: 40,
    paddingHorizontal: 25,
  },
  formArea: {
    width: "100%",
    paddingBottom: "100%",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 25,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    color: "#333",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    width: "100%",
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  eyeIcon: { paddingHorizontal: 8 },
  signUpButton: {
    backgroundColor: "#f77c83",
    borderRadius: 25,
    width: "70%",
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
  },
  signUpText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loginContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: { color: "#fff" },
  loginLink: { color: "#fff", fontWeight: "bold" },
  backContainer: {
    backgroundColor: "#f5a7abff",
  },
});
