import React from "react";
import { List } from "react-native-paper";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Routes } from "../routes/availableRoutes";

interface ILostCompanionTileProps {
  navigate: (route: string, params?: object) => void;
}

const LostComapnionTile = ({ navigate }: ILostCompanionTileProps) => {
  const handleTap = () => {
    navigate(Routes.FindCompanion, {
      name: "Shabana",
      location: { lat: "ghr", long: "ghr" },
    });
  };

  return (
    <TouchableOpacity onPress={handleTap}>
      <View style={styles.lostCompanionMessage}>
        <List.Icon icon="account-supervisor" />
        <View>
          <Text style={styles.listText}>Shabana Marked herself Lost.</Text>
          <Text style={styles.listSubText}>Find her.</Text>
        </View>
        <List.Icon icon="search-web" />
      </View>
    </TouchableOpacity>
  );
};

export default LostComapnionTile;

const styles = StyleSheet.create({
  lostCompanionMessage: {
    padding: 20,
    marginTop: 20,
    height: 100,
    width: "100%",
    backgroundColor: "#fbbbbb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 15,
  },
  listText: {
    fontSize: 16,
    fontWeight: "500",
  },
  listSubText: {
    fontSize: 14,
    fontWeight: "400",
    color: "grey",
  },
});
