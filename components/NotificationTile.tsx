import React, { useContext } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge, IconButton, Text } from "react-native-paper";
import TravelContext, {
  INotification,
} from "../context/TravelContext/TravelContext";
import IconButtonWithBadge from "./IconButtonWithBadge";

interface TitlePropsType {
  notification: INotification;
}

const NotificationTile = ({ notification }: TitlePropsType) => {
  const travelContext = useContext(TravelContext);

  const handleNotificationTap = async () => {
    travelContext.markNotificationAsRead(notification.id ?? "");
  };

  return (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={handleNotificationTap}
      disabled={notification.isRead}
    >
      <IconButtonWithBadge
        icon="bell-alert-outline"
        withContent={false}
        showBadge={!notification.isRead}
      />
      <Text style={styles.text}>{notification.message}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    // display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // height: 80,
    // width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  iconSet: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 8,
  },
  notifIcon: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 0,
  },
});

export default NotificationTile;
