import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://192.168.68.104:5000/api/users/login",
        { email, password }
      );

      if (response.status === 200) {
        const user = response.data.user;
        navigation.navigate("PickYourPartner", { user });
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#f9b3b3", "#e36b6b"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Medicine Inventory and Tracking</Text>
          <Text style={styles.subtitle}>MEDICINE SUPPLIES AND EXPIRATION APP</Text>
        </View>

        {/* Bottom Container */}
        <View style={styles.bottomContainer}>
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputRed}>
              <TextInput
                placeholder="Enter your Email"
                placeholderTextColor="#fff"
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGreen}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#6b7b6f"
                style={{ marginLeft: 10 }}
              />
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#6b7b6f"
                secureTextEntry={!show}
                value={password}
                onChangeText={setPassword}
                style={styles.textInputFlex}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShow(!show)}>
                <Ionicons
                  name={show ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#6b7b6f"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Logging in..." : "Confirm"}
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign Up */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don’t have an account?{" "}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate("SignUp")}
                >
                  Sign Up
                </Text>
              </Text>
            </View>

            {/* Terms & Services */}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.termsText}>Terms and Services</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal for Terms & Services */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <ScrollView>
              <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>
                Terms and Services
              </Text>
              <Text style={{ marginBottom: 10 }}>
                1. Acceptance of Terms: By accessing or using this app, you agree to comply with and be bound by these Terms and Services. If you do not agree, please do not use the app.
              </Text>
              <Text style={{ marginBottom: 10 }}>
                2. Description of Service: This app provides medicine inventory management and expiration tracking to help users monitor stock and receive alerts about medicine expiration dates.
              </Text>
              <Text style={{ marginBottom: 10 }}>
                3. User Responsibilities: You agree to provide accurate and current information in your account and inventory data. You are responsible for maintaining the confidentiality of your login credentials. You must notify the app administrators of any unauthorized use of your account.
              </Text>
              <Text style={{ marginBottom: 10 }}>
                4. Data Privacy: Your inventory and personal data will be stored securely and only used to provide app functionality. We will not share your data with third parties without your consent, except as required by law.
              </Text>
              <Text style={{ marginBottom: 10 }}>
                5. Accuracy and Limitations: The app aims to provide accurate expiration alerts and inventory status, but you acknowledge that errors or delays may occur. Always verify critical medicine information independently.
              </Text>
              <Text style={{ marginBottom: 10 }}>
                6. Intellectual Property: All app content, including software, designs, and logos, are owned by the app developer and protected by copyright laws. You may only use the app for its intended purpose.
              </Text>
              <Text style={{ marginBottom: 10 }}>
                7. Termination: We reserve the right to suspend or terminate your access to the app at any time without prior notice for violations of these terms or misuse.
              </Text>
              <Text style={{ marginBottom: 10 }}>
                8. Disclaimer of Warranty: The app is provided "as is" without warranties of any kind, either expressed or implied. We do not guarantee uninterrupted or error-free service.
              </Text>
              <Text style={{ marginBottom: 10 }}>
                9. Limitation of Liability: We are not liable for any damages resulting from the use or inability to use the app, including errors in inventory or expiration data.
              </Text>
              <Text style={{ marginBottom: 10 }}>
                10. Changes to Terms: We may update these Terms and Services occasionally. Users will be notified of significant changes via the app or registered email.
              </Text>
              <Text style={{ marginBottom: 10 }}>
                11. Contact Information: For questions or concerns regarding these terms, please contact [Your Contact Email].
              </Text>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  marginTop: 20,
                  backgroundColor: "#f77c83",
                  padding: 12,
                  borderRadius: 25,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { alignItems: "center", paddingTop: 120, paddingBottom: 10 },
  logo: { width: 180, height: 180, marginBottom: 8 },
  title: { fontWeight: "bold", color: "#fff", fontSize: 18, textAlign: "center" },
  subtitle: { color: "#fff", fontSize: 11, textAlign: "center", marginTop: 40 },
  bottomContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  form: { width: "90%", alignItems: "center" },
  inputRed: {
    backgroundColor: "#f77c83",
    borderRadius: 25,
    width: "100%",
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputGreen: {
    backgroundColor: "#d7e2d0",
    borderRadius: 25,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  textInput: { height: 45, color: "#fff" },
  textInputFlex: { flex: 1, height: 45, color: "#333", paddingHorizontal: 10 },
  button: {
    backgroundColor: "#f77c83",
    borderRadius: 25,
    width: "70%",
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  signupContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  signupText: { color: "#777" },
  signupLink: { color: "#f77c83", fontWeight: "bold" },
  forgotText: { color: "#f77c83", textDecorationLine: "underline", marginBottom: 15 },
  termsText: { color: "#777", textDecorationLine: "underline", marginTop: 10 },
});
