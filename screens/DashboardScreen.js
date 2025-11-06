import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Animated,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function DashboardScreen({ navigation, route }) {
  const jumpAnim = useRef(new Animated.Value(0)).current;
  const [partnerName, setPartnerName] = useState("Your Partner");
  const [partnerImage, setPartnerImage] = useState(require("../assets/cute-cat.png"));
  const [tutorialStep, setTutorialStep] = useState(0);
  const [expiringItems, setExpiringItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fullName = route.params?.user?.fullName || "User";
  const userId = route.params?.user?._id;

  const API_BASE = "http://192.168.68.104:5000/api";

  // 🧠 Load expiring vitamins & meds
  useEffect(() => {
    if (userId) {
      checkExpiringItems();
    }
  }, [userId]);

  const checkExpiringItems = async () => {
    try {
      const [vitaminRes, medRes] = await Promise.all([
        axios.get(`${API_BASE}/vitamins/${userId}`),
        axios.get(`${API_BASE}/medications/user/${userId}`), 
      ]);

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const items = [];

      const checkItem = (item, type) => {
        if (!item.expirationDate) return;
        const expDate = new Date(item.expirationDate);
        const expString = expDate.toDateString();
        const todayString = today.toDateString();
        const tomorrowString = tomorrow.toDateString();

        if (expString === todayString) {
          items.push({ name: item.selectedName || item.name, type, when: "today" });
        } else if (expString === tomorrowString) {
          items.push({ name: item.selectedName || item.name, type, when: "tomorrow" });
        }
      };

      vitaminRes.data.forEach((vit) => checkItem(vit, "Vitamin"));
      medRes.data.forEach((med) => checkItem(med, "Medication"));

      if (items.length > 0) {
        setExpiringItems(items);
        setShowModal(true);
      }
    } catch (err) {
      console.log("❌ Error checking expiring items:", err.message);
    }
  };

  // 🐱 Partner data
  useEffect(() => {
    if (route.params?.user) {
      const user = route.params.user;
      setPartnerName(user.partner?.name || "Your Partner");
      setPartnerImage(
        user.partner?.image
          ? user.partner.image.uri
            ? { uri: user.partner.image.uri }
            : user.partner.image
          : require("../assets/cute-cat.png")
      );
    }
  }, [route.params?.user]);

  // 🐱 Jump animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(jumpAnim, { toValue: -15, duration: 500, useNativeDriver: true }),
        Animated.timing(jumpAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // 💬 Tutorial
  const startTutorial = () => setTutorialStep(tutorialStep === 0 ? 1 : 0);
  const nextStep = () => setTutorialStep(tutorialStep < 5 ? tutorialStep + 1 : 0);
  const previousStep = () => setTutorialStep(tutorialStep > 1 ? tutorialStep - 1 : 0);

  const tutorialData = [
    {},
    { text: `🐱 Hi, I'm your partner ${partnerName} and I will guide you today!`},
    { text: `🐱 This is your Medication section. This is where your doctor can prescribe medications for you. `, highlight: "medication" },
    { text: "🐱 This is your Vitamins section. Track your vitamins and daily intake here.", highlight: "vitamins" },
    { text: "🐱 Here is the Health Products list. Manage supplements and other health items.", highlight: "health" },
    { text: "🐱 Tap the profile icon to open Settings and manage your profile.", highlight: "profile" },
  ];

  const currentHighlight = tutorialData[tutorialStep]?.highlight;

  return (
    <LinearGradient colors={["#f9b3b3", "#e36b6b"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, {fullName}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileAndSettings", { user: route.params.user })}
          >
            <Ionicons
              name="person-circle-outline"
              size={42}
              color={currentHighlight === "profile" ? "#ffde59" : "#ffffffff"}
              style={{ opacity: tutorialStep > 0 && currentHighlight !== "profile" ? 0.3 : 1 }}
            />
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: currentHighlight === "medication" ? "#fff" : "#b3f1f1",
                opacity: tutorialStep > 0 && currentHighlight !== "medication" ? 0.3 : 1,
              },
            ]}
            onPress={() => navigation.navigate("Medication", { user: route.params.user })}
          >
            <Ionicons name="medkit-outline" size={28} color="#000" />
            <Text style={styles.buttonText}>MEDICATIONS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: currentHighlight === "vitamins" ? "#fff" : "#b3f1f1",
                opacity: tutorialStep > 0 && currentHighlight !== "vitamins" ? 0.3 : 1,
              },
            ]}
            onPress={() => navigation.navigate("Vitamins", { user: route.params.user })}
          >
            <Ionicons name="fitness-outline" size={28} color="#000" />
            <Text style={styles.buttonText}>VITAMINS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: currentHighlight === "health" ? "#fff" : "#b3f1f1",
                opacity: tutorialStep > 0 && currentHighlight !== "health" ? 0.3 : 1,
              },
            ]}
            onPress={() => navigation.navigate("HealthProducts", { user: route.params.user })}
          >
            <Ionicons name="heart-outline" size={28} color="#000" />
            <Text style={styles.buttonText}>HEALTH PRODUCTS</Text>
          </TouchableOpacity>
        </View>

        {/* 🐱 Cat */}
        <Animated.View style={[styles.catContainer, { transform: [{ translateY: jumpAnim }] }]}>
          <TouchableOpacity onPress={startTutorial}>
            <Image source={partnerImage} style={styles.catImage} resizeMode="contain" />
          </TouchableOpacity>

          {tutorialStep > 0 && (
            <View style={styles.dialogBubble}>
              <Text style={styles.dialogText}>{tutorialData[tutorialStep].text}</Text>
              <View style={styles.dialogButtonsContainer}>
                {tutorialStep > 1 && (
                  <TouchableOpacity
                    onPress={previousStep}
                    style={[styles.nextButton, styles.previousButton]}
                  >
                    <Text style={styles.nextText}>Previous</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
                  <Text style={styles.nextText}>{tutorialStep < 5 ? "Next" : "Finish"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>

        {/* ⚠️ Expiring Items Modal */}
        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>⚠️ Reminder</Text>
              <ScrollView>
                {expiringItems.map((item, i) => (
                  <Text key={i} style={styles.modalText}>
                    {item.type} "{item.name}" will expire {item.when}.
                  </Text>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.closeText}>Got it</Text>
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
  safeArea: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#ffffffff" },
  buttonContainer: { alignItems: "center" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 280,
    height: 75,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
  },
  buttonText: { fontSize: 19, fontWeight: "bold", marginLeft: 12, color: "#000" },
  catContainer: { position: "absolute", bottom: 20, right: 20, alignItems: "center" },
  catImage: { width: 150, height: 150 },
  dialogBubble: {
    position: "absolute",
    bottom: 160,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 20,
    width: 320,
    borderWidth: 3,
    borderColor: "#ffb3b3",
  },
  dialogText: { fontSize: 16, color: "#000" },
  dialogButtonsContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  nextButton: { backgroundColor: "#e36b6b", paddingHorizontal: 15, paddingVertical: 6, borderRadius: 14 },
  previousButton: { backgroundColor: "#f3a43f" },
  nextText: { color: "#fff", fontWeight: "bold" },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#e36b6b", marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 8, color: "#333" },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#e36b6b",
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
