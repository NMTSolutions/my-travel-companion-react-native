import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native/";
import TravelContext, {
  IAccount,
} from "../context/TravelContext/TravelContext";
import { Avatar, IconButton } from "react-native-paper";

const CompanionTile = ({ account }: { account: IAccount }) => {
  const [isSendingCompanionRequest, setIsSendingCompanionRequest] =
    useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const travelContext = useContext(TravelContext);

  const handleSendRequest = async () => {
    setIsSendingCompanionRequest(true);
    const response = await travelContext.sendCompanionRequest(account);
    if (response.status === "success") {
      setIsRequestSent(true);
    }
    setIsSendingCompanionRequest(false);
  };

  return (
    <TouchableOpacity
      key={account.username}
      style={styles.profileCard}
      onPress={() => {}}
    >
      <View style={styles.iconSet}>
        <Avatar.Image
          size={50}
          source={{
            uri: "https://randomuser.me/api/portraits/men/36.jpg",
          }}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.greet}>{account.username}</Text>
          <Text style={styles.name}>{account.displayName}</Text>
        </View>
      </View>
      <View>
        {isSendingCompanionRequest ? (
          <ActivityIndicator
            size={25}
            color="#6750a4"
            style={{ marginRight: 12 }}
          />
        ) : isRequestSent ? (
          <IconButton size={25} icon="account-check" />
        ) : (
          <IconButton
            size={25}
            icon="account-plus"
            onPress={handleSendRequest}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CompanionTile;

const styles = StyleSheet.create({
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
