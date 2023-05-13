import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
// import Text from "../components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Button,
  List,
  IconButton,
  Dialog,
  Portal,
  Provider,
  Avatar,
} from "react-native-paper";
import Grid from "../components/Grid";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Routes } from "../routes/availableRoutes";
import BottomNavigation from "../components/BottomNavigation";
import { getDialogContent } from "../utilities/content";

interface IDashboardProps {
  navigation: NavigationProp<ParamListBase>;
}

interface IDashboardAction {
  name: string;
  label: string;
  iconName: string;
  iconColor: string;
  onPress: () => void;
}

const DashboardScreen = ({ navigation }: IDashboardProps) => {
  const [visible, setVisible] = useState(false);
  const [activeDialog, setActiveDialog] = useState("");

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  // let activeDialog: string = "";

  const dashboardActions: IDashboardAction[] = [
    {
      name: "mark-lost",
      label: "Mark Yourself Lost",
      iconName: "cancel",
      iconColor: "red",
      onPress: () => {
        // activeDialog = "mark-lost";
        showDialog();
      },
    },
    {
      name: "search-lost-companions",
      label: "Search Companion",
      iconName: "search-web",
      iconColor: "skyblue",
      onPress: () => {
        // activeDialog = "search-lost-companions";
        // showDialog();
      },
    },
  ];

  const navigate = (route: string) => {
    navigation.navigate(route);
  };

  let dialogContent;

  if (visible) {
    dialogContent = getDialogContent(activeDialog);
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Provider>
        <View style={styles.subContainer}>
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => {
              navigate(Routes.Profile);
            }}
          >
            <View style={styles.iconSet}>
              <Avatar.Image
                size={50}
                source={{
                  uri: "https://randomuser.me/api/portraits/men/36.jpg",
                }}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.greet}>Welcome Back</Text>
                <Text style={styles.name}>Tauqeer Khan</Text>
              </View>
            </View>
            <View>
              <IconButton size={25} icon="bell" onPress={() => {}} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate(Routes.MyCompanions)}>
            <View style={styles.companionsList}>
              <List.Icon icon="account-supervisor" />
              <Text style={styles.listText}>My Travel Companions</Text>
              <List.Icon icon="menu-right" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.lostCompanionMessage}>
              <List.Icon icon="account-supervisor" />
              <View>
                <Text style={styles.listText}>
                  Shabana Marked herself Lost.
                </Text>
                <Text style={styles.listSubText}>Find her.</Text>
              </View>
              <List.Icon icon="search-web" />
            </View>
          </TouchableOpacity>
          {/* <List.Item
          style={styles.companionsList}
          onPress={() => {}}
          title="My Travel Companions"
          left={(props) => <List.Icon {...props} icon="account-supervisor" />}
          right={(props) => <List.Icon {...props} icon="menu-right" />}
        /> */}
          <Grid
            columns={2}
            items={dashboardActions}
            onPress={(item, index) => {
              const currentItem = item as IDashboardAction;
              setActiveDialog(currentItem.name);
              switch (currentItem.name) {
                case "mark-lost":
                  showDialog();
                  break;
                default:
              }
            }}
            render={(item, index) => {
              const currentItem = item as IDashboardAction;
              return (
                <View
                  style={{
                    width: "100%",
                    height: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    key={currentItem.label}
                    icon={currentItem.iconName}
                    size={40}
                    iconColor={currentItem.iconColor}
                  />
                  <Text style={styles.listText}>{currentItem.label}</Text>
                </View>
              );
            }}
          />
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>{dialogContent?.heading}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{dialogContent?.content}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button
                mode="contained"
                style={{ width: 100 }}
                onPress={hideDialog}
              >
                {dialogContent?.action}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <BottomNavigation navigation={navigation} />
      </Provider>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: "#ece7e5",
    height: "100%",
    position: "relative",
    // paddingTop: StatusBar.currentHeight,
  },
  subContainer: {
    height: "100%",
    width: "100%",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
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
  companionsList: {
    padding: 20,
    marginTop: 20,
    height: 60,
    width: "100%",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 15,
  },
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
  gridTile: {
    backgroundColor: "#fff",
    width: "49%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});
