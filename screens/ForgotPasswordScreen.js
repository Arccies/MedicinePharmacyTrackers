import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Generate reset token by calling backend
  const handleGenerateToken = async () => {
    if (!email) return alert("Please enter your email");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.68.104:5000/api/users/forgot-password",
        { email }
      );
      // Backend should return the token
      setResetToken(response.data.resetToken); 
      setModalVisible(true);
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Reset password by calling backend
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return alert("Please enter all password fields");
    if (newPassword !== confirmPassword)
      return alert("Passwords do not match");

    setLoading(true);
    try {
      await axios.post(
        `http://192.168.68.104:5000/api/users/reset-password/${resetToken}`,
        { password: newPassword }
      );
      Alert.alert("Success", "Password successfully reset!");
      setModalVisible(false);
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
      navigation.navigate("Login");
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#f9b3b3", "#e36b6b"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Ionicons
            name="lock-closed-outline"
            size={100}
            color="#fff"
            style={styles.logo}
          />
          <Text style={styles.title}>Forgot Your Password?</Text>
          <Text style={styles.subtitle}>
            Enter your registered email address to get a reset token.
          </Text>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.form}>
            <View style={styles.inputRed}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 10 }}
              />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#fff"
                style={styles.textInputFlex}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleGenerateToken}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Generating..." : "Generate Reset Token"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.backContainer}
            >
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal */}
        <Modal transparent={true} visible={modalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Reset Password</Text>

              {/* Email */}
              <Text style={styles.modalLabel}>Email:</Text>
              <Text style={styles.modalEmail}>{email}</Text>

              {/* Token */}
              <Text style={styles.modalLabel}>Reset Token:</Text>
              <Text style={styles.modalToken}>{resetToken}</Text>

              {/* New Password */}
              <TextInput
                placeholder="Enter new password"
                secureTextEntry
                style={styles.modalInput}
                value={newPassword}
                onChangeText={setNewPassword}
              />

              {/* Confirm New Password */}
              <TextInput
                placeholder="Confirm new password"
                secureTextEntry
                style={styles.modalInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text
                  style={[styles.modalButtonText, { color: "#f77c83", marginTop: 10 }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { alignItems: "center", paddingTop: 120, paddingBottom: 70 },
  logo: { width: 110, height: 110, marginBottom: 8 },
  title: { fontWeight: "bold", color: "#fff", fontSize: 27, textAlign: "center" },
  subtitle: { color: "#fff", fontSize: 17, textAlign: "center", width: "80%", marginTop: 10 },
  bottomContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    alignItems: "center",
  },
  form: { width: "90%", alignItems: "center" },
  inputRed: {
    backgroundColor: "#f77c83",
    borderRadius: 25,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  textInputFlex: { flex: 1, height: 45, color: "#fff" },
  button: {
    backgroundColor: "#f77c83",
    borderRadius: 25,
    width: "70%",
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  backContainer: { marginBottom: 15 },
  backText: { color: "#f77c83", fontWeight: "600", textDecorationLine: "underline" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000000aa" },
  modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 15, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalLabel: { fontSize: 16, marginBottom: 5 },
  modalEmail: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 10 },
  modalToken: { fontSize: 22, fontWeight: "bold", color: "#f77c83", marginBottom: 20 },
  modalInput: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 15 },
  modalButton: { backgroundColor: "#f77c83", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20 },
  modalButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
