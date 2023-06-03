import React from "react";
import { List } from "react-native-paper";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Routes } from "../routes/availableRoutes";
import { ILostCompanion } from "../context/TravelContext/TravelContext";

interface ILostCompanionTileProps {
  lostCompanion: ILostCompanion;
  navigate: (route: string, params?: object) => void;
}

const LostComapnionTile = ({
  lostCompanion,
  navigate,
}: ILostCompanionTileProps) => {
  const handleTap = () => {
    navigate(Routes.FindCompanion, lostCompanion);
  };

  return (
    <TouchableOpacity onPress={handleTap}>
      <View style={styles.lostCompanionMessage}>
        <List.Icon style={{ flex: 1.5 }} icon="account-supervisor" />
        <View style={{ flex: 8 }}>
          <Text style={styles.listText}>
            {lostCompanion.companion.displayName} marked themself Lost.
          </Text>
          <Text style={styles.listSubText}>Find them.</Text>
        </View>
        <List.Icon style={{ flex: 1.5 }} icon="search-web" />
      </View>
    </TouchableOpacity>
  );
};

export default LostComapnionTile;

const styles = StyleSheet.create({
  lostCompanionMessage: {
    padding: 20,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
    // height: 100,
    width: "100%",
    backgroundColor: "#fbbbbb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 15,
  },
  listText: {
    fontSize: 12,
    fontWeight: "500",
  },
  listSubText: {
    fontSize: 10,
    fontWeight: "400",
    color: "grey",
  },
});
