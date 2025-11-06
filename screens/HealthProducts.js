import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function HealthProductScreen() {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [healthProducts, setHealthProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [userId, setUserId] = useState(null);

  // ✅ Backend URL
  const API_URL = "http://192.168.68.104:5000/api/health-products";

  // ✅ Load user ID from AsyncStorage
  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user._id);
        }
      } catch (error) {
        console.log("Error loading user:", error);
      }
    };
    getUser();
  }, []);

  // ✅ Fetch products when userId is ready
  useEffect(() => {
    if (userId) fetchProducts();
  }, [userId]);

  // ✅ Fetch health products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/${userId}`);
      setHealthProducts(res.data);
    } catch (error) {
      console.log("Error fetching products:", error.response?.data || error.message);
      Alert.alert("Error", "Could not load health products.");
    }
  };

  // ✅ Save or Update product
  const handleSave = async () => {
    if (!selectedCategory || !selectedProduct || !quantity) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newItem = {
      userId,
      category: selectedCategory,
      name: selectedProduct,
      quantity: Number(quantity),
    };

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, newItem);
        Alert.alert("Success", "Health product updated!");
      } else {
        await axios.post(API_URL, newItem);
        Alert.alert("Success", "Health product added!");
      }

      setModalVisible(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.log("Save error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to save product.");
    }
  };

  // ✅ Delete product
  const handleDelete = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${id}`);
            fetchProducts();
          } catch (error) {
            Alert.alert("Error", "Failed to delete product.");
          }
        },
      },
    ]);
  };

  // ✅ Helpers
  const resetForm = () => {
    setSelectedCategory("");
    setSelectedProduct("");
    setQuantity("");
    setEditId(null);
  };

  const handleEdit = (product) => {
    setSelectedCategory(product.category);
    setSelectedProduct(product.name);
    setQuantity(product.quantity.toString());
    setEditId(product._id);
    setModalVisible(true);
  };

  // ✅ Product categories
  const productData = {
    "Personal care products": [
      "Dove – Moisturizing Body Wash",
      "Colgate – Toothpaste",
      "Head & Shoulders – Shampoo",
      "Nivea – Body Lotion",
      "Vaseline – Petroleum Jelly",
    ],
    "Health Protection products": [
      "3M – N95 Face Mask",
      "Purell – Hand Sanitizer",
      "Dettol – Disinfectant Spray",
      "Omron – Digital Thermometer",
      "Lysol – Disinfecting Wipes",
    ],
    "Personal skin care products": [
      "Cetaphil – Gentle Skin Cleanser",
      "Neutrogena – Hydro Boost Water Gel",
      "The Ordinary – Niacinamide Serum",
      "Olay – Regenerist Cream",
      "L’Oréal Paris – Revitalift Serum",
    ],
    "Hygiene products": [
      "Safeguard – Antibacterial Soap",
      "Modess – Sanitary Napkins",
      "Close-Up – Toothpaste",
      "Palmolive – Bath Soap",
      "Gillette – Shaving Razor",
    ],
  };

  return (
    <LinearGradient colors={["#f9b3b3", "#e36b6b"]} style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.header}>Health Products</Text>

      {healthProducts.length === 0 ? (
        <Text style={styles.emptyText}>No products added yet.</Text>
      ) : (
        <FlatList
          data={healthProducts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text>Category: {item.category}</Text>
                <Text>Quantity: {item.quantity}</Text>
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

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <LinearGradient colors={["#ffffff", "#ffffff"]} style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editId ? "Edit Product" : "Add New Product"}
            </Text>

            <ScrollView>
              <Text style={styles.label}>Category:</Text>
              <Picker
                selectedValue={selectedCategory}
                style={styles.picker}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedProduct("");
                }}
              >
                <Picker.Item label="Select Category" value="" />
                {Object.keys(productData).map((category) => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>

              {selectedCategory ? (
                <>
                  <Text style={styles.label}>Product:</Text>
                  <Picker
                    selectedValue={selectedProduct}
                    style={styles.picker}
                    onValueChange={(value) => setSelectedProduct(value)}
                  >
                    <Picker.Item label="Select Product" value="" />
                    {productData[selectedCategory].map((product, i) => (
                      <Picker.Item key={i} label={product} value={product} />
                    ))}
                  </Picker>
                </>
              ) : null}

              <TextInput
                placeholder="Quantity"
                style={styles.input}
                value={quantity}
                onChangeText={(text) => setQuantity(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#f77c83" }]}
                  onPress={handleSave}
                >
                  <Text style={styles.modalButtonText}>
                    {editId ? "Update" : "Save"}
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
  emptyText: { textAlign: "center", color: "#fff" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
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
  picker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: {
    flex: 1,
    margin: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});
