import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconButtonWithBadge from "./IconButtonWithBadge";
import { Routes } from "../routes/availableRoutes";
import { Avatar } from "react-native-paper";
import TravelContext from "../context/TravelContext/TravelContext";
import UserContext from "../context/UserContext/UserContext";

const ProfileCard = ({ navigate }: { navigate: (route: string) => void }) => {
  const userContext = useContext(UserContext);
  const travelContext = useContext(TravelContext);

  const unreadNotifications = travelContext.myNotifications.filter(
    (notification) => !notification.isRead
  );

  return (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() => {
        navigate(Routes.Profile);
      }}
    >
      <View style={styles.iconSet}>
        <Avatar.Text
          size={50}
          label={userContext.myAccount?.displayName?.[0] ?? ""}
          //   source={{
          //     uri: "https://randomuser.me/api/portraits/men/36.jpg",
          //   }}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.greet}>Welcome Back</Text>
          <Text style={styles.name}>{userContext.myAccount?.displayName}</Text>
        </View>
      </View>
      <View>
        <IconButtonWithBadge
          icon="bell"
          showBadge={unreadNotifications.length > 0}
          badgeContent={unreadNotifications.length}
          onPress={() => navigate(Routes.Notifications)}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  profileCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
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
});
