import React, { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import { Routes } from "../routes/availableRoutes";
import UserContext from "../context/UserContext/UserContext";

interface OTPScreenProps {
  navigate: (route: string) => void;
}

const OTPScreen = ({ navigate }: OTPScreenProps) => {
  const [otp, setOtp] = useState("");

  const userContext = useContext(UserContext);

  const verifyOTP = async () => {
    await userContext.verifyOtp(otp);
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
      />
      <Button mode="contained" onPress={verifyOTP}>
        Submit
      </Button>
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
