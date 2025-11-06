import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useRoute } from "@react-navigation/native";

export default function MedicationScreen({ navigation }) {
  const route = useRoute();
  const userId = route.params?.user._id;
  const [medications, setMedications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [takenFor, setTakenFor] = useState("");
  const [frequency, setFrequency] = useState("1x");
  const [timesTaken, setTimesTaken] = useState("8:00 AM");
  const [selectedId, setSelectedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateStop, setDateStop] = useState(new Date());

  // ✅ Replace with your local IP or use localhost/simulator IP
  const API_URL = "http://192.168.68.104:5000/api/medications";
  console.log("USER ID:", userId);
  useEffect(() => {
    if (userId) fetchMedications();
  }, [userId]);

  // Fetch meds from backend
  const fetchMedications = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/${userId}`);
      setMedications(res.data);
    } catch (err) {
      console.log("Fetch error:", err.response?.status, err.response?.data);
      Alert.alert("Error", "Failed to fetch medications");
    }
  };

  const handleFrequencyChange = (value) => {
    setFrequency(value);
    const presets = {
      "1x": "8:00 AM",
      "2x": "8:00 AM, 8:00 PM",
      "3x": "8:00 AM, 1:00 PM, 8:00 PM",
      "4x": "8:00 AM, 12:00 PM, 4:00 PM, 8:00 PM",
      "5x": "7:00 AM, 11:00 AM, 3:00 PM, 7:00 PM, 10:00 PM",
    };
    setTimesTaken(presets[value]);
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDate = (date) => {
    setDateStop(date);
    hideDatePicker();
  };

  const resetForm = () => {
    setName("");
    setDose("");
    setTakenFor("");
    setFrequency("1x");
    setTimesTaken("8:00 AM");
    setDateStop(new Date());
    setSelectedId(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!name || !dose || !takenFor) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const payload = {
      userId,
      name,
      dose,
      takenFor,
      frequency,
      timesTaken,
      dateStop,
    };

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${selectedId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      setModalVisible(false);
      resetForm();
      fetchMedications();
    } catch (err) {
      console.log("Save error:", err.response?.status, err.response?.data);
      Alert.alert("Error", "Failed to save medication");
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setSelectedId(item._id);
    setName(item.name);
    setDose(item.dose);
    setTakenFor(item.takenFor);
    setFrequency(item.frequency);
    setTimesTaken(item.timesTaken);
    setDateStop(new Date(item.dateStop));
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMedications();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to delete medication");
    }
  };

  return (
    <LinearGradient colors={["#f9b3b3", "#e36b6b"]} style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.header}>Medication List</Text>

      {medications.length === 0 ? (
        <Text style={styles.emptyText}>No medications added yet.</Text>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text>Taken For: {item.takenFor}</Text>
              <Text>Dose: {item.dose}</Text>
              <Text>Frequency: {item.frequency}</Text>
              <Text>Times Taken: {item.timesTaken}</Text>
              <Text>Date Stop: {new Date(item.dateStop).toLocaleDateString()}</Text>
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

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Medication" : "Add Medication"}
            </Text>

            <TextInput
              placeholder="Medication Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Taken For"
              value={takenFor}
              onChangeText={setTakenFor}
              style={styles.input}
            />
            <TextInput
              placeholder="Dose"
              value={dose}
              onChangeText={setDose}
              style={styles.input}
            />

            <Text style={styles.label}>Frequency:</Text>
            <Picker
              selectedValue={frequency}
              onValueChange={handleFrequencyChange}
              style={styles.picker}
            >
              <Picker.Item label="1x" value="1x" />
              <Picker.Item label="2x" value="2x" />
              <Picker.Item label="3x" value="3x" />
              <Picker.Item label="4x" value="4x" />
              <Picker.Item label="5x" value="5x" />
            </Picker>

            <Text>Times Taken: {timesTaken}</Text>

            <TouchableOpacity
              style={[styles.input, styles.dateButton]}
              onPress={showDatePicker}
            >
              <Ionicons name="calendar-outline" size={20} color="#f77c83" />
              <Text style={styles.dateText}>
                {dateStop.toLocaleDateString()}
              </Text>
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
        </View>
      </Modal>
    </LinearGradient>
  );
}

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
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginTop: 50, color: "#fff" },
  emptyText: { textAlign: "center", color: "#fff", marginTop: 20 },
  card: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  itemTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  cardButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
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
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    margin: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#f77c83" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  label: { marginBottom: 5, color: "#f77c83" },
  picker: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  modalButton: { flex: 1, margin: 5, padding: 12, borderRadius: 10, alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  dateButton: { flexDirection: "row", alignItems: "center", gap: 10 },
  dateText: { fontSize: 16, color: "#f77c83", marginLeft: 5 },
});
