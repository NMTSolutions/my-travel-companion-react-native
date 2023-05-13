import React, { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Dialog,
  TextInput,
} from "react-native-paper";
import UserContext from "../context/UserContext/UserContext";
import { IError } from "../utilities/types";

interface OTPScreenProps {
  error: IError;
  setError: (error: IError) => void;
  navigate: (route: string) => void;
}

const OTPScreen = ({ error, setError, navigate }: OTPScreenProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userContext = useContext(UserContext);

  const verifyOTP = async () => {
    setIsLoading(true);
    const response = await userContext.verifyOtp(otp);
    setIsLoading(false);
    if (response.status === "error") {
      let errorMessage;
      switch (response.error?.code) {
        case "auth/invalid-verification-code":
          errorMessage = "You've entered wrong OTP. Please try again.";
          break;
        default:
          errorMessage = "Something went wrong, Please try again later.";
      }
      setError({ isError: true, message: errorMessage });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter OTP</Text>
      <TextInput
        mode="outlined"
        value={otp}
        onChangeText={(text) => setOtp(text)}
        left={<TextInput.Icon icon="form-textbox-password" />}
        keyboardType="number-pad"
        style={styles.textInput}
        placeholder="Enter OTP"
        disabled={isLoading}
      />
      {isLoading ? (
        <ActivityIndicator size={40} />
      ) : (
        <Button mode="contained" onPress={verifyOTP}>
          Submit
        </Button>
      )}
    </View>
  );
};

export default OTPScreen;

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
