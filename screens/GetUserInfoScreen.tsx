import React, { useState, useContext } from "react";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import UserContext from "../context/UserContext/UserContext";
import { IError } from "../utilities/types";

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

  const userContext = useContext(UserContext);

  const registerUser = async () => {
    setIsLoading(true);
    const response = await userContext.registerUser(otp, username, displayName);
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter Details</Text>
      <TextInput
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholder="Enter Username"
        mode="outlined"
        left={<TextInput.Icon icon="account" />}
        keyboardType="default"
        style={styles.textInput}
      />
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
        <ActivityIndicator size={40} />
      ) : (
        <Button
          mode="contained"
          onPress={() => {
            registerUser();
          }}
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
