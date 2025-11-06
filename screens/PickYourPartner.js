import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PickYourPartner = ({ navigation, route }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [partnerName, setPartnerName] = useState("");

  // Get logged-in user from LoginScreen
  const user = route.params?.user;

  const partners = [
    { id: "1", image: require("../assets/cute_cat1.png") },
    { id: "2", image: require("../assets/cute_cat2.png") },
    { id: "3", image: require("../assets/cute_cat3.png") },
  ];

  const handleSelect = () => {
    if (!selectedId) return;
    setModalVisible(true);
  };

  const handleDone = async () => {
    if (!selectedId) return;

    const selectedPartner = partners.find((p) => p.id === selectedId);
    const updatedUser = {
      ...user,
      partner: {
        name: partnerName || "Your Partner",
        image: selectedPartner.image,
      },
    };

    // Save to AsyncStorage for persistence
    try {
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error saving user:", err);
      Alert.alert("Error", "Failed to save partner info.");
      return;
    }

    // Navigate to Dashboard and pass the updated user
    navigation.replace("Dashboard", { user: updatedUser });
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, selectedId === item.id && styles.selectedCard]}
      onPress={() => setSelectedId(item.id)}
    >
      <Image source={item.image} style={styles.catImage} resizeMode="contain" />
      <View style={[styles.circle, selectedId === item.id && styles.circleSelected]} />
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#f9b3b3", "#e36b6b"]} style={styles.container}>
      <Text style={styles.title}>PICK YOUR PARTNER</Text>

      <FlatList
        data={partners}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={[styles.selectButton, !selectedId && { opacity: 0.6 }]}
        onPress={handleSelect}
        disabled={!selectedId}
      >
        <Text style={styles.selectButtonText}>SELECT</Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>NAME YOUR PARTNER</Text>

            {selectedId && (
              <Image
                source={partners.find((p) => p.id === selectedId).image}
                style={styles.modalCat}
                resizeMode="contain"
              />
            )}

            <Text style={styles.modalLabel}>NAME:</Text>
            <TextInput
              placeholder="Enter name..."
              placeholderTextColor="#999"
              value={partnerName}
              onChangeText={setPartnerName}
              style={styles.input}
            />

            <TouchableOpacity
              style={[styles.modalButton, { marginTop: 10 }]}
              onPress={handleDone}
            >
              <Text style={styles.modalButtonText}>DONE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>GO BACK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default PickYourPartner;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold", marginVertical: 25 },
  list: { gap: 20 },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 15,
    width: 280,
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedCard: { borderColor: "#ff6f61", borderWidth: 2 },
  catImage: { width: 80, height: 80 },
  circle: { width: 25, height: 25, borderRadius: 15, borderWidth: 1, borderColor: "#ffb6b9" },
  circleSelected: { backgroundColor: "#ff6f61" },
  selectButton: { marginTop: 30, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 25, paddingVertical: 12, paddingHorizontal: 70 },
  selectButtonText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 20, padding: 25, width: 280, alignItems: "center" },
  modalTitle: { fontWeight: "bold", color: "#333", fontSize: 20, marginBottom: 15 },
  modalCat: { width: 120, height: 120, marginBottom: 15 },
  modalLabel: { marginTop: 10, color: "#333", fontWeight: "bold" },
  input: { width: "80%", backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 8, textAlign: "center", marginTop: 5 },
  modalButton: { backgroundColor: "#fda085", borderRadius: 20, paddingVertical: 10, paddingHorizontal: 50, marginTop: 8 },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});
