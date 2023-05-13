import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Text from "../components/Text";
import BottomNavigation from "../components/BottomNavigation";
import {
  NavigationProp,
  ParamListBase,
  useNavigationState,
} from "@react-navigation/native";
import { Avatar, IconButton, TextInput } from "react-native-paper";
import { Routes } from "../routes/availableRoutes";
import ExpandableTile from "../components/ExpandableTile";

interface ICompanionScreenProps {
  navigation: NavigationProp<ParamListBase>;
}
const CompanionsScreen = ({ navigation }: ICompanionScreenProps) => {
  const [companionInfo, setCompanionInfo] = useState("");

  const navigationState = useNavigationState((state) => state);
  const isMyCompanionsScreen =
    navigationState.routes[navigationState.index].name === Routes.MyCompanions;
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.subContainer}>
        <Text style={styles.heading}>
          {isMyCompanionsScreen ? "My Companions" : "Search Companions"}
        </Text>
        {!isMyCompanionsScreen && (
          <TextInput
            mode="outlined"
            value={companionInfo}
            onChangeText={(text) => setCompanionInfo(text)}
            left={<TextInput.Icon icon="account-search" />}
            right={<TextInput.Icon icon="magnify" onPress={() => {}} />}
            keyboardType="default"
            style={styles.textInput}
            placeholder="Companion phone or username"
          />
        )}
        {isMyCompanionsScreen ? (
          <>
            <ExpandableTile />
            <ExpandableTile />
            <ExpandableTile />
          </>
        ) : (
          <TouchableOpacity style={styles.profileCard} onPress={() => {}}>
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
              <IconButton size={25} icon="account-plus" onPress={() => {}} />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  );
};

export default CompanionsScreen;

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: "600", marginBottom: 20 },
  safeContainer: {
    backgroundColor: "#ece7e5",
    height: "100%",
    position: "relative",
    paddingTop: StatusBar.currentHeight,
  },
  subContainer: { height: "100%", width: "100%", padding: 20 },
  textInput: {
    // marginLeft: 10,
    // marginRight: 10,
    marginBottom: 20,
    borderRadius: 20,
    // backgroundColor: "#ece7e5",
  },
  profileCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    padding: 15,
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
