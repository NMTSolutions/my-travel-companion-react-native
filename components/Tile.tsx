import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

interface TitlePropsType {
  iconName: string;
  textContent: string;
}

const Tile = ({ iconName, textContent }: TitlePropsType) => {
  return (
    <TouchableOpacity style={styles.profileCard}>
      <View style={styles.iconSet}>
        <IconButton icon={iconName} />
        <Text style={styles.text}>{textContent}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // height: 80,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  iconSet: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    flex: 1,
  },
});

export default Tile;
