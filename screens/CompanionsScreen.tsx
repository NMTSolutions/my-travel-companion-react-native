import React, { useContext, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Text from "../components/Text";
import BottomNavigation from "../components/BottomNavigation";
import {
  NavigationProp,
  ParamListBase,
  useNavigationState,
} from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import { Routes } from "../routes/availableRoutes";
import ExpandableTile from "../components/ExpandableTile";
import TravelContext, {
  ICompanion,
} from "../context/TravelContext/TravelContext";
import CompanionTile from "../components/CompanionTile";
import { getUserDocId } from "../utilities/utils";
import UserContext from "../context/UserContext/UserContext";

interface ICompanionScreenProps {
  navigation: NavigationProp<ParamListBase>;
}
const CompanionsScreen = ({ navigation }: ICompanionScreenProps) => {
  const [companionInfo, setCompanionInfo] = useState("");
  const [isLoadingCompanions, setIsLoadingCompanions] = useState(false);
  const [isLoadingCompanionRequests, setIsLoadingCompanionRequests] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userContext = useContext(UserContext);
  const travelContext = useContext(TravelContext);

  const handleTextChange = async (text: string) => {
    setCompanionInfo(text);
    setIsLoading(true);
    await travelContext.searchAccounts(text.trim());
    setIsLoading(false);
  };

  const handleSearchTap = async () => {
    setIsLoading(true);
    await travelContext.searchAccounts(companionInfo.trim());
    setIsLoading(false);
  };

  const navigationState = useNavigationState((state) => state);

  const isMyCompanionsScreen =
    navigationState.routes[navigationState.index].name === Routes.MyCompanions;

  const myAccountDocId = getUserDocId(userContext.user?.displayName ?? "");

  const availableSearchedAccounts = travelContext.searchedAccounts;
  // const availableSearchedAccounts = travelContext.searchedAccounts.filter(
  //   (account) => account.id !== myAccountDocId
  // );

  const navigate = (route: string, params?: object) => {
    navigation.navigate(route, params);
  };

  const getCompanionRequests = async () => {
    setIsLoadingCompanionRequests(true);
    const response = await travelContext.getCompanionRequests();
    setIsLoadingCompanionRequests(false);
  };

  const getCompanions = async () => {
    setIsLoadingCompanions(true);
    const response = await travelContext.getCompanions();
    setIsLoadingCompanions(false);
  };

  // useEffect(() => {
  //   if (isMyCompanionsScreen) {
  //     getCompanionRequests();
  //     getCompanions();
  //   }
  // }, [isMyCompanionsScreen, userContext.user]);

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
            onChangeText={(text) => handleTextChange(text)}
            left={<TextInput.Icon icon="account-search" />}
            right={<TextInput.Icon icon="magnify" onPress={handleSearchTap} />}
            keyboardType="default"
            style={styles.textInput}
            placeholder="Search companions"
          />
        )}
        <ScrollView>
          {isMyCompanionsScreen ? (
            <>
              <Text
                style={styles.subheading}
              >{`New Requests (${travelContext.companionsRequests.length})`}</Text>
              {isLoadingCompanionRequests ? (
                <View>
                  <ActivityIndicator size={45} color="#6750a4" />
                </View>
              ) : (
                <>
                  {travelContext.companionsRequests.map((request) => (
                    <ExpandableTile
                      key={request.companionRequestId}
                      companion={request}
                      isNewRequest
                    />
                  ))}
                </>
              )}
              <Text
                style={styles.subheading}
              >{`Your Companions (${travelContext.myCompanions.length})`}</Text>
              {isLoadingCompanions ? (
                <View>
                  <ActivityIndicator size={45} color="#6750a4" />
                </View>
              ) : (
                <>
                  {travelContext.myCompanions.map((companion) => (
                    <ExpandableTile
                      key={companion.companionId}
                      companion={companion}
                      navigate={navigate}
                    />
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {isLoading && (
                <View>
                  <ActivityIndicator size={45} color="#6750a4" />
                </View>
              )}
              {!isLoading &&
                availableSearchedAccounts.length > 0 &&
                availableSearchedAccounts.map((account) => (
                  <CompanionTile key={account.id} account={account} />
                ))}
              {!isLoading &&
                companionInfo.length > 0 &&
                availableSearchedAccounts.length === 0 && (
                  <View style={styles.messageTextContainer}>
                    <Text style={styles.messageText}>No companion found.</Text>
                  </View>
                )}
              {!isLoading && companionInfo.length === 0 && (
                <View style={styles.messageTextContainer}>
                  <Text style={styles.messageText}>
                    Search companions by username or phone.
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
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
  subContainer: {
    height: "100%",
    width: "100%",
    padding: 20,
    paddingBottom: 85,
  },
  subheading: { color: "grey", marginTop: 5, marginBottom: 10 },
  textInput: {
    marginBottom: 20,
    borderRadius: 20,
  },
  messageTextContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  messageText: { fontSize: 12, color: "gray" },
});
