import React from "react";
import { Text } from "react-native-paper";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import BottomNavigation from "../components/BottomNavigation";
import Tile from "../components/Tile";

interface INavigationsScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const testNotification = [
  "Tauqeer marked himself as lost!, wanna find him?",
  "Wafa marked himself as lost!, wanna find him?",
  "Karim marked himself as lost!, wanna find him?",
  "Tauqeer marked himself as lost!, wanna find him?",
  "Wafa marked himself as lost!, wanna find him?",
  "Karim marked himself as lost!, wanna find him?",
  "Tauqeer marked himself as lost!, wanna find him?",
  "Wafa marked himself as lost!, wanna find him?",
  "Karim marked himself as lost!, wanna find him?",
  "Tauqeer marked himself as lost!, wanna find him?",
  "Wafa marked himself as lost!, wanna find him?",
  "Karim marked himself as lost!, wanna find him?",
  "Tauqeer marked himself as lost!, wanna find him?",
  "Wafa marked himself as lost!, wanna find him?",
  "Karim marked himself as lost!, wanna find him?",
  "Tauqeer marked himself as lost!, wanna find him?",
  "Wafa marked himself as lost!, wanna find him?",
  "Karim marked himself as lost!, wanna find him?",
  "Tauqeer marked himself as lost!, wanna find him?",
  "Wafa marked himself as lost!, wanna find him?",
  "Karim marked himself as lost!, wanna find him?",
  "Tauqeer marked himself as lost!, wanna find him?",
  "Wafa marked himself as lost!, wanna find him?",
  "Karim marked himself as lost!, wanna find him?",
  "Tauqeer marked himself as lost!, wanna find him?",
  "Wafa marked himself as lost!, wanna find him?",
  "Karim marked himself as lost!, wanna find him?",
  "Tauqeer marked himself as lost!, wanna find him?",
  "Wafa marked himself as lost!, wanna find him?",
  "Karim marked himself as lost!, wanna find him?",
  "Tauqeer marked himself as lost!, wanna find him?",
  "Wafa marked himself as lost!, wanna find him?",
  "Karim marked himself as lost!, wanna find him?",
];

const NotificationsScreen = ({ navigation }: INavigationsScreenProps) => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.subContainer}>
        <Text style={styles.heading}>Notifications</Text>
        <FlatList
          data={testNotification}
          renderItem={(notification) => (
            <Tile
              key={notification.item}
              iconName="bell-alert-outline"
              textContent={notification.item}
            />
          )}
        />
      </View>
      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: "#ece7e5",
    height: "100%",
    position: "relative",
    paddingTop: StatusBar.currentHeight,
  },
  subContainer: {
    height: "100%",
    maxWidth: "100%",
    padding: 20,
    paddingBottom: 85,
  },
  heading: { fontSize: 20, fontWeight: "600", marginBottom: 20 },
});

export default NotificationsScreen;
