import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

export default function VitaminsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [vitamins, setVitamins] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [selectedType, setSelectedType] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expirationDate, setExpirationDate] = useState(
    new Date().toLocaleDateString("en-US")
  );

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // ⚙️ Fetch vitamins when the screen loads
  useEffect(() => {
    if (user && user._id) {
      fetchVitamins();
    }
  }, [user]);

  // 🔄 Fetch all vitamins for the user
  const fetchVitamins = async () => {
    try {
      const res = await axios.get(
        `http://192.168.68.104:5000/api/vitamins/${user._id}`
      );
      setVitamins(res.data);
    } catch (err) {
      console.log("Error fetching vitamins:", err.message);
    }
  };

  // 📅 Date Picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = (date) => {
    const formattedDate = date.toLocaleDateString("en-US");
    setExpirationDate(formattedDate);
    hideDatePicker();
  };

  // 🧾 Vitamin Types and Names
  const vitaminData = {
    "Vitamin C": ["Cecon", "Redoxon", "Ascorbic Acid", "Celine", "Fern-C"],
    "Vitamin D": ["Forti-D", "Vita-D", "D-Cure", "Sun-D", "Hi-D"],
    "Vitamin B12": ["Neurobion", "Becom", "Methycobal", "Cobex", "Cyanokit"],
    "Vitamin B6": [
      "B6 Forte",
      "Pyridoxine",
      "B Complex",
      "Bionerv",
      "Neurogen-E",
    ],
    Folate: ["Folic Acid", "Hemarate", "Obimin", "Folvite", "Prenatal 400"],
  };

  // ♻️ Reset form fields
  const resetForm = () => {
    setSelectedType("");
    setSelectedName("");
    setQuantity("");
    setExpirationDate(new Date().toLocaleDateString("en-US"));
    setIsEditing(false);
    setSelectedId(null);
  };

  // 💾 Save or Update Vitamin
  const handleSave = async () => {
    if (!selectedType || !selectedName || !quantity || !expirationDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          `http://192.168.68.104:5000/api/vitamins/${selectedId}`,
          {
            selectedType,
            selectedName,
            quantity,
            expirationDate,
          }
        );
      } else {
        await axios.post(`http://192.168.68.104:5000/api/vitamins`, {
          userId: user._id,
          selectedType,
          selectedName,
          quantity,
          expirationDate,
        });
      }

      fetchVitamins();
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.log("Save error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to save vitamin.");
    }
  };

  // ❌ Delete Vitamin
  const handleDelete = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this vitamin?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`http://192.168.68.104:5000/api/vitamins/${id}`);
            fetchVitamins();
          } catch (error) {
            console.log("Delete error:", error.message);
          }
        },
      },
    ]);
  };

  // ✏️ Edit Vitamin
  const handleEdit = (item) => {
    setIsEditing(true);
    setSelectedId(item._id);
    setSelectedType(item.selectedType);
    setSelectedName(item.selectedName);
    setQuantity(item.quantity.toString());
    setExpirationDate(item.expirationDate);
    setModalVisible(true);
  };

  return (
    <LinearGradient colors={["#f9b3b3", "#e36b6b"]} style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#ffffffff" />
      </TouchableOpacity>

      <Text style={styles.header}>Vitamins List</Text>

      {/* 🧾 List of Vitamins */}
      {vitamins.length === 0 ? (
        <Text style={styles.emptyText}>No vitamins added yet.</Text>
      ) : (
        <FlatList
          data={vitamins}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.selectedName}</Text>
                <Text>Type: {item.selectedType}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>Expiration: {item.expirationDate}</Text>
              </View>
              <View style={styles.cardButtons}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Ionicons name="create-outline" size={22} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                  <Ionicons name="trash-outline" size={22} color="#ff4d6d" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* ➕ Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* 🪟 Modal for Add/Edit */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={["#ffffff", "#ffffffff"]}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Vitamin" : "Add New Vitamin"}
            </Text>

            <ScrollView>
              <Text style={styles.label}>Type of Vitamin</Text>
              <Picker
                selectedValue={selectedType}
                style={styles.picker}
                onValueChange={(value) => {
                  setSelectedType(value);
                  setSelectedName("");
                }}
              >
                <Picker.Item label="Select type" value="" />
                {Object.keys(vitaminData).map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>

              <Text style={styles.label}>Name of Vitamin</Text>
              <Picker
                selectedValue={selectedName}
                style={styles.picker}
                enabled={!!selectedType}
                onValueChange={(value) => setSelectedName(value)}
              >
                <Picker.Item label="Select name" value="" />
                {selectedType &&
                  vitaminData[selectedType].map((name) => (
                    <Picker.Item key={name} label={name} value={name} />
                  ))}
              </Picker>

              <TextInput
                placeholder="Quantity"
                keyboardType="numeric"
                style={styles.input}
                value={quantity}
                onChangeText={(t) => setQuantity(t.replace(/[^0-9]/g, ""))}
              />

              <TouchableOpacity
                style={[styles.input, styles.dateButton]}
                onPress={showDatePicker}
              >
                <Ionicons name="calendar-outline" size={20} color="#f77c83" />
                <Text style={styles.dateText}>{expirationDate}</Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#f77c83" }]}
                  onPress={handleSave}
                >
                  <Text style={styles.modalButtonText}>
                    {isEditing ? "Update" : "Save"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginTop: 50,
    marginBottom: 20,
  },
  emptyText: { textAlign: "center", color: "#555" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  itemTitle: { fontWeight: "bold", fontSize: 16, color: "#333" },
  cardButtons: {
    justifyContent: "space-around",
    alignItems: "center",
    marginLeft: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#f77c83",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#f77c83",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  label: { marginBottom: 5, color: "#f77c83" },
  picker: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: {
    flex: 1,
    margin: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
});
