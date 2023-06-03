import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Button,
  List,
  IconButton,
  Dialog,
  Portal,
  Provider,
} from "react-native-paper";
import * as Location from "expo-location";
import Grid from "../components/Grid";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Routes } from "../routes/availableRoutes";
import BottomNavigation from "../components/BottomNavigation";
import { getDialogContent } from "../utilities/content";
import LostComapnionTile from "../components/LostComapnionTile";
import TravelContext, {
  ICoordinates,
} from "../context/TravelContext/TravelContext";
import ProfileCard from "../components/ProfileCard";
import LostCompanionsList from "../components/LostCompanionsList";

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
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isFetchingLocationSuccessful, setIsFetchingLocationSuccessful] =
    useState(false);
  const [isMarkingFound, setIsMarkingFound] = useState(false);
  const [isMarkingFoundSuccessful, setIsMarkingFoundSuccessful] =
    useState(false);
  const [isLocationAccessDenied, setIsLocationAccessDenied] = useState(false);
  const [coordinates, setCoordinates] = useState<ICoordinates | null>(null);

  const travelContext = useContext(TravelContext);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const dashboardActions: IDashboardAction[] = [
    {
      name: "mark-lost",
      label: "Mark Yourself Lost",
      iconName: "cancel",
      iconColor: "red",
      onPress: () => {
        showDialog();
      },
    },
    {
      name: "mark-found",
      label: "Mark Yourself Found",
      iconName: "check-bold",
      iconColor: "green",
      onPress: () => {
        showDialog();
      },
    },
    {
      name: "search-lost-companions",
      label: "Search Companion",
      iconName: "search-web",
      iconColor: "skyblue",
      onPress: () => {
        // showDialog();
      },
    },
  ].filter((action) =>
    travelContext.isLost ? action.name : action.name !== "mark-found"
  );

  const navigate = (route: string, params?: object) => {
    navigation.navigate(route, params);
  };

  let dialogContent;

  if (visible) {
    dialogContent = getDialogContent(activeDialog);
  }

  const fetchLocation = async () => {
    setIsFetchingLocation(true);
    try {
      const res = await Location.requestForegroundPermissionsAsync();
      if (res.status !== "granted") {
        setIsLocationAccessDenied(true);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.BestForNavigation,
      });
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      if (
        (latitude !== undefined || latitude !== null) &&
        (longitude !== undefined || longitude !== null)
      ) {
        setCoordinates({
          latitude,
          longitude,
        });

        const response = await travelContext.markLost({ latitude, longitude });

        setIsFetchingLocationSuccessful(response.status === "success");
        setIsFetchingLocation(false);
      }
    } catch (error: any) {
      switch (error.message) {
        case "Location request failed due to unsatisfied device settings.":
          setIsLocationAccessDenied(true);
          break;
      }
      setIsFetchingLocationSuccessful(false);
      setIsFetchingLocation(false);
    }
  };

  const markFound = async () => {
    setIsMarkingFound(true);
    const res = await travelContext.markFound();
    setIsMarkingFound(false);
    if (
      res.foundMsgsSentTo &&
      res.foundMsgsSentTo > 0 &&
      travelContext.myCompanions.length > 0
    ) {
      setIsMarkingFoundSuccessful(true);
    } else if (
      res.foundMsgsSentTo &&
      res.foundMsgsSentTo === 0 &&
      travelContext.myCompanions.length > 0
    ) {
      setIsMarkingFoundSuccessful(false);
    }
  };

  const handleDialogAction = async (activeDialog: string) => {
    switch (activeDialog) {
      case "mark-lost":
        fetchLocation();
        break;
      case "mark-found":
        markFound();
        break;
    }
    hideDialog();
  };

  const handleTryAgain = () => {
    setIsLocationAccessDenied(false);
    fetchLocation();
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Provider>
        <View style={styles.subContainer}>
          <ProfileCard navigate={navigate} />
          <TouchableOpacity onPress={() => navigate(Routes.MyCompanions)}>
            <View style={styles.companionsList}>
              <List.Icon icon="account-supervisor" />
              <Text style={styles.listText}>My Travel Companions</Text>
              <List.Icon icon="menu-right" />
            </View>
          </TouchableOpacity>
          <View>
            <LostCompanionsList navigate={navigate} />
          </View>
          <Grid
            columns={2}
            items={dashboardActions}
            onPress={(item, index) => {
              const currentItem = item as IDashboardAction;
              setActiveDialog(currentItem.name);
              switch (currentItem.name) {
                case "mark-lost":
                case "mark-found":
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
                  <Text style={styles.gridText}>{currentItem.label}</Text>
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
                onPress={() => handleDialogAction(activeDialog)}
              >
                {dialogContent?.action}
              </Button>
            </Dialog.Actions>
          </Dialog>
          <Dialog visible={isLocationAccessDenied} onDismiss={hideDialog}>
            <Dialog.Title>Location Access Denied</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                User denied location access. Please try again.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button
                mode="contained"
                style={{ width: 100 }}
                onPress={() => handleTryAgain()}
              >
                Try Again
              </Button>
            </Dialog.Actions>
          </Dialog>
          <Dialog visible={isFetchingLocation}>
            <Dialog.Title>Fetching Location</Dialog.Title>
            <Dialog.Content style={styles.fetchingLocationContent}>
              <ActivityIndicator size={50} color={"#6750a4"} />
              <Text
                variant="bodyMedium"
                style={{ padding: 10, marginLeft: 20 }}
              >
                Fetching your location to send to your companions.
              </Text>
            </Dialog.Content>
          </Dialog>
          <Dialog
            visible={isFetchingLocationSuccessful}
            onDismiss={() => setIsFetchingLocationSuccessful(false)}
          >
            <Dialog.Title>Location Fetch Successful</Dialog.Title>
            <Dialog.Content style={styles.fetchingLocationContent}>
              <Text variant="bodyMedium">
                Your location has been fetched and sent to your companions.
                Remain at your current location your companions will find you.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                mode="contained"
                style={{ width: 100 }}
                onPress={() => setIsFetchingLocationSuccessful(false)}
              >
                Close
              </Button>
            </Dialog.Actions>
          </Dialog>
          <Dialog visible={isMarkingFound}>
            <Dialog.Title>Marking Found</Dialog.Title>
            <Dialog.Content style={styles.fetchingLocationContent}>
              <ActivityIndicator size={50} color={"#6750a4"} />
              <View>
                <Text
                  variant="bodyMedium"
                  style={{ padding: 10, marginLeft: 20 }}
                >
                  Sending notifications to your comapnions.
                </Text>
              </View>
            </Dialog.Content>
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
    paddingBottom: 85,
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
    // height: 80,
    width: "100%",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 15,
  },
  gridText: {
    fontSize: 11,
    fontWeight: "500",
  },
  listText: {
    fontSize: 14,
    fontWeight: "500",
  },
  gridTile: {
    backgroundColor: "#fff",
    width: "49%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  fetchingLocationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});
