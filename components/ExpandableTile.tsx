import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator, Avatar, IconButton } from "react-native-paper";
import TravelContext, {
  IAccount,
  ICompanion,
  ICompanionRequest,
} from "../context/TravelContext/TravelContext";
import { Routes } from "../routes/availableRoutes";

const ExpandableTile = ({
  companion,
  isNewRequest,
  navigate,
}: {
  companion: ICompanion | ICompanionRequest;
  isNewRequest?: boolean;
  navigate?: (route: string, params?: object) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const [isRemovingCompanion, setIsRemovingCompanion] = useState(false);

  const travelContext = useContext(TravelContext);

  const handlePress = () => setExpanded((prevState) => !prevState);

  const acceptRequest = async () => {
    setIsAcceptingRequest(true);
    await travelContext.acceptCompanionRequest(companion);
    setIsAcceptingRequest(false);
  };

  const rejectRequest = async () => {
    setIsRejectingRequest(true);
    await travelContext.rejectCompanionRequest(companion);
    setIsRejectingRequest(false);
  };

  const handleSearchCompanionTap = () => {
    navigate?.(Routes.FindCompanion, { name: companion.displayName });
  };

  const removeCompanion = async () => {
    setIsRemovingCompanion(true);
    await travelContext.removeCompanion(companion as ICompanion);
    setIsRemovingCompanion(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.profileCard} onPress={handlePress}>
        <View style={styles.iconSet}>
          <Avatar.Image
            size={50}
            source={{
              uri: "https://randomuser.me/api/portraits/men/36.jpg",
            }}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.greet}>{companion.username}</Text>
            <Text style={styles.name}>{companion.displayName}</Text>
          </View>
        </View>
        <View>
          <IconButton size={25} icon={expanded ? "menu-up" : "menu-down"} />
        </View>
      </TouchableOpacity>
      {expanded && (
        <>
          {isNewRequest ? (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={acceptRequest}
                disabled={isAcceptingRequest}
              >
                {isAcceptingRequest ? (
                  <ActivityIndicator
                    size={25}
                    color="#6750a4"
                    style={{ padding: 14 }}
                  />
                ) : (
                  <IconButton icon="account-plus" size={25} />
                )}
                <Text>Accept Request</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={rejectRequest}
                disabled={isRejectingRequest}
              >
                {isRejectingRequest ? (
                  <ActivityIndicator
                    size={25}
                    color="#6750a4"
                    style={{ padding: 14 }}
                  />
                ) : (
                  <IconButton icon="cancel" size={25} />
                )}
                <Text>Reject Request</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleSearchCompanionTap}
              >
                <IconButton icon="search-web" size={25} />
                <Text>Search Companion</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={removeCompanion}
                disabled={isRemovingCompanion}
              >
                {isRemovingCompanion ? (
                  <ActivityIndicator
                    size={25}
                    color="#6750a4"
                    style={{ padding: 14 }}
                  />
                ) : (
                  <IconButton icon="cancel" size={25} />
                )}
                <Text>Remove Companion</Text>
              </TouchableOpacity>
            </>
          )}
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
    height: 80,
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
    fontSize: 14,
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
