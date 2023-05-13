import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, IconButton } from "react-native-paper";

const ExpandableTile = () => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => setExpanded((prevState) => !prevState);

  return (
    <>
      <TouchableOpacity style={styles.profileCard} onPress={handlePress}>
        <View style={styles.iconSet}>
          <Avatar.Image
            size={50}
            // rounded
            source={{
              uri: "https://randomuser.me/api/portraits/men/36.jpg",
            }}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.greet}>Tauqeer14118</Text>
            <Text style={styles.name}>Tauqeer Khan</Text>
          </View>
        </View>
        <View>
          <IconButton size={25} icon={expanded ? "menu-up" : "menu-down"} />
        </View>
      </TouchableOpacity>
      {expanded && (
        <>
          <TouchableOpacity style={styles.menuItem}>
            <IconButton icon="search-web" size={25} />
            <Text>Search Companion</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <IconButton icon="cancel" size={25} />
            <Text>Remove Companion</Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 5,
  },
  iconSet: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    height: "100%",
    display: "flex",
    marginLeft: 10,
    justifyContent: "space-around",
  },
  greet: {
    fontSize: 12,
    color: "gray",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuItem: {
    marginLeft: 60,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    marginBottom: 5,
  },
});

export default ExpandableTile;
