import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import DashboardScreen from "./screens/DashboardScreen";
import MedicationScreen from "./screens/MedicationScreen";
import VitaminsScreen from "./screens/VitaminsScreen";
import HealthProductScreen from "./screens/HealthProducts";
import ProfileAndSettings from "./screens/ProfileAndSettings";
import PickYourPartner from "./screens/PickYourPartner";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="PickYourPartner" component={PickYourPartner} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Medication" component={MedicationScreen} />
        <Stack.Screen name="Vitamins" component={VitaminsScreen} />
        <Stack.Screen name="HealthProducts" component={HealthProductScreen} />
        <Stack.Screen name="ProfileAndSettings" component={ProfileAndSettings} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
