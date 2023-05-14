import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";

interface LoginScreenProps {
  countryCode: string;
  phone: string;
  setCountryCode: (countryCode: string) => void;
  setPhone: (phone: string) => void;
  signin: () => Promise<void>;
  nextPage: () => void;
}

const LoginScreen = ({
  countryCode,
  phone,
  setCountryCode,
  setPhone,
  signin,
  nextPage,
}: LoginScreenProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGetOTP = async () => {
    setIsLoggingIn(true);
    await signin();
    setIsLoggingIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter Phone</Text>
      <TextInput
        mode="outlined"
        value={countryCode}
        onChangeText={(text) => setCountryCode(text)}
        left={<TextInput.Icon icon="flag" />}
        keyboardType="number-pad"
        style={styles.textInput}
        placeholder="Country Code (Without + prefix)"
        disabled={isLoggingIn}
      />
      <TextInput
        mode="outlined"
        value={phone}
        onChangeText={(text) => setPhone(text)}
        left={<TextInput.Icon icon="phone" />}
        keyboardType="number-pad"
        style={styles.textInput}
        placeholder="Phone Number"
        disabled={isLoggingIn}
      />
      {isLoggingIn ? (
        <ActivityIndicator size={40} />
      ) : (
        <Button mode="contained" onPress={handleGetOTP} disabled={isLoggingIn}>
          Get OTP
        </Button>
      )}
    </View>
  );
};

export default LoginScreen;

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
  dropdownContainer: {
    width: "80%",
  },
});
