import React, { useContext } from "react";
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
import NotificationTile from "../components/NotificationTile";
import TravelContext from "../context/TravelContext/TravelContext";

interface INavigationsScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const NotificationsScreen = ({ navigation }: INavigationsScreenProps) => {
  const travelContext = useContext(TravelContext);

  const notifications = travelContext.myNotifications;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead,
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.subContainer}>
        <Text style={styles.heading}>
          Notifications
          {unreadNotifications.length > 0 && ` (${unreadNotifications.length})`}
        </Text>
        {notifications.length < 1 && <Text>No notifications to show.</Text>}
        <FlatList
          data={notifications}
          renderItem={(notification) => (
            <NotificationTile
              key={notification.item.id}
              notification={notification.item}
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
    // paddingTop: StatusBar.currentHeight,
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
