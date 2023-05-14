import React, { useState, useContext } from "react";
import { Button, Text, TextInput } from "react-native-paper";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import UserContext from "../context/UserContext/UserContext";
import { IError } from "../utilities/types";
import TravelContext from "../context/TravelContext/TravelContext";

interface GetUserInfoScreenProps {
  setError: ({ isError, message }: IError) => void;
  otp: string;
  prevPage: () => void;
}

const GetUserInfoScreen = ({
  setError,
  otp,
  prevPage,
}: GetUserInfoScreenProps) => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsernameAvailability, setIsLoadingUsernameAvailability] =
    useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

  const userContext = useContext(UserContext);
  const travelContext = useContext(TravelContext);

  const registerUser = async () => {
    if (isUsernameAvailable) {
      setIsLoading(true);
      const response = await userContext.registerUser(
        otp.trim(),
        username.trim(),
        displayName.trim()
      );
      setIsLoading(false);
      if (response.status === "error") {
        let errorMessage;
        switch (response.error?.code) {
          case "auth/invalid-verification-code":
            errorMessage = "You've entered wrong OTP. Please try again.";
            prevPage();
            break;
          default:
            errorMessage = "Something went wrong, Please try again later.";
        }
        setError({ isError: true, message: errorMessage });
      }
    }
  };

  const handleUsernameChange = async (username: string) => {
    setUsername(username);
    const timer = setTimeout(async () => {
      setIsLoadingUsernameAvailability(true);
      const { searchedAccounts } = await travelContext.searchAccounts(username);
      if (searchedAccounts?.length && searchedAccounts?.length > 0) {
        setIsUsernameAvailable(false);
      } else {
        setIsUsernameAvailable(true);
      }
      setIsLoadingUsernameAvailability(false);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter Details</Text>
      <View style={styles.usernameInputContainer}>
        <TextInput
          value={username}
          onChangeText={(text) => handleUsernameChange(text)}
          placeholder="Enter Username"
          mode="outlined"
          left={<TextInput.Icon icon="account" />}
          keyboardType="default"
          style={styles.textInput}
          error={!isUsernameAvailable}
        />
        {isLoadingUsernameAvailability && (
          <ActivityIndicator
            size={40}
            color="#6750a4"
            style={styles.usernameLoadingIndicator}
          />
        )}
      </View>
      {!isUsernameAvailable && (
        <Text style={styles.usernameNotAvailableLabel}>
          Username is not available. Try again.
        </Text>
      )}
      <TextInput
        value={displayName}
        onChangeText={(text) => setDisplayName(text)}
        placeholder="Enter Display Name"
        mode="outlined"
        left={<TextInput.Icon icon="account-box-outline" />}
        keyboardType="default"
        style={styles.textInput}
      />
      {isLoading ? (
        <ActivityIndicator size={40} color="#6750a4" />
      ) : (
        <Button
          mode="contained"
          onPress={() => {
            registerUser();
          }}
          disabled={!isUsernameAvailable}
        >
          Register
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: { fontSize: 20, color: "#6750a4", marginBottom: 10 },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  usernameInputContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
  },
  usernameLoadingIndicator: { position: "absolute", right: -10, top: 10 },
  usernameNotAvailableLabel: {
    color: "red",
    marginTop: -15,
    marginBottom: 10,
  },
  textInput: {
    width: "80%",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: "#ece7e5",
  },
});

export default GetUserInfoScreen;
