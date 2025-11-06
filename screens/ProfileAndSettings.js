import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function ProfileAndSettings() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(require("../assets/default-profile.png"));
  const [partner, setPartner] = useState({
    name: "Your Partner",
    image: require("../assets/cute-cat.png"),
  });
  const [userId, setUserId] = useState(null);

  const resolveImage = (image) => {
    if (!image) return require("../assets/cute-cat.png");
    if (typeof image === "string") return { uri: image };
    return image;
  };

  // Load user info from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (!userString) return;

        const user = JSON.parse(userString);
        setFullName(user.fullName || "");
        setEmail(user.email || "");
        setUserId(user._id || null);
        setProfileImage(
          user.profileImage ? { uri: user.profileImage } : require("../assets/default-profile.png")
        );

        if (user.partner) {
          setPartner({
            name: user.partner.name || "Your Partner",
            image: resolveImage(user.partner.image),
          });
        }
      } catch (error) {
        console.error("Error loading user:", error);
        Alert.alert("Error", "Failed to load user info");
      }
    };
    loadUser();
  }, []);

  // Handle Android back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  // Update profile image
  const updateProfileImage = async (imageUri) => {
    if (!userId) {
      Alert.alert("Error", "No user ID found. Please login again.");
      return;
    }

    try {
      // Send update to backend
      await axios.put(`http://192.168.68.104:5000/api/users/${userId}`, {
        profileImage: imageUri,
      });

      // Update local user data
      const userString = await AsyncStorage.getItem("user");
      if (!userString) return;
      const user = JSON.parse(userString);
      user.profileImage = imageUri;
      await AsyncStorage.setItem("user", JSON.stringify(user));

      setProfileImage({ uri: imageUri });
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert("Error", "Failed to update profile image");
    }
  };

  // Pick image from gallery
  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      // ✅ Fixed for new Expo SDK format
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        updateProfileImage(uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  return (
    <LinearGradient colors={["#f9b3b3", "#e36b6b"]} style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </View>

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <Image source={profileImage} style={styles.profileImage} />

        <TouchableOpacity style={styles.editProfileButton} onPress={pickProfileImage}>
          <Text style={styles.editProfileText}>Edit Profile Photo</Text>
        </TouchableOpacity>

        <Text style={styles.username}>{fullName}</Text>
        <Text style={styles.email}>{email}</Text>

        {/* PARTNER */}
        <View style={styles.partnerContainer}>
          <Image source={resolveImage(partner.image)} style={styles.partnerImage} />
          <View style={styles.partnerInfo}>
            <Text style={styles.partnerName}>Hello, I'm {partner.name}!</Text>
          </View>

          {/* ✅ Stay logged in when picking partner */}
       <TouchableOpacity
  style={styles.pickPartnerButton}
  onPress={async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        Alert.alert("Error", "Please login again.");
        return;
      }
      const user = JSON.parse(userString);
      navigation.navigate("PickYourPartner", { user });
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Error", "Failed to open partner picker");
    }
  }}
>
  <Text style={styles.pickPartnerText}>Pick Partner</Text>
</TouchableOpacity>

        </View>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await AsyncStorage.removeItem("user");
          navigation.replace("Login");
        }}
      >
        <Text style={styles.logoutText}>LOG OUT</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  profileCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    resizeMode: "cover",
  },
  editProfileButton: {
    backgroundColor: "#e36b6b",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  editProfileText: { color: "#fff", fontWeight: "bold" },
  username: { fontSize: 18, fontWeight: "bold", color: "#333" },
  email: { fontSize: 14, color: "#555", marginBottom: 15 },
  partnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    gap: 10,
  },
  partnerImage: { width: 100, height: 100, resizeMode: "contain" },
  partnerInfo: { flex: 1 },
  partnerName: { fontSize: 16, fontWeight: "bold" },
  pickPartnerButton: {
    backgroundColor: "#e36b6b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pickPartnerText: { color: "#fff", fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#e36b6b",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
