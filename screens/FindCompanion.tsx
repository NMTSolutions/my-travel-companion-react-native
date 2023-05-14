import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { RootStackParamList, Routes } from "../routes/availableRoutes";

interface IFindCompanionScreenProps {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<RootStackParamList, Routes.FindCompanion>;
}

const FindCompanion = ({ navigation, route }: IFindCompanionScreenProps) => {
  route.params.name;
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.subContainer}>
        <Text style={styles.heading}>Find Companion : {route.params.name}</Text>
      </View>
    </SafeAreaView>
  );
};

export default FindCompanion;

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: "600", marginBottom: 20 },
  safeContainer: {
    backgroundColor: "#ece7e5",
    height: "100%",
    position: "relative",
    paddingTop: StatusBar.currentHeight,
  },
  subContainer: {
    height: "100%",
    width: "100%",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
