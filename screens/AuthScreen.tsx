import React, { useRef, useState, useContext } from "react";
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import LoginScreen from "./LoginScreen";
import OTPScreen from "./OTPScreen";
import { Button, Dialog, IconButton } from "react-native-paper";
import {
  NavigationProp,
  ParamListBase,
  useNavigationState,
} from "@react-navigation/native";
import { Routes } from "../routes/availableRoutes";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "../firebase";
import UserContext from "../context/UserContext/UserContext";
import { IError } from "../utilities/types";
import GetUserInfoScreen from "./GetUserInfoScreen";
import { ENV, environment } from "../env";

interface AuthScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const AuthScreen = ({ navigation }: AuthScreenProps) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [page, setPage] = useState(0);
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<IError>({
    isError: false,
    message: "No Error.",
  });

  const recaptchaVerifier = useRef(null);

  const navigationState = useNavigationState((state) => state);

  const userContext = useContext(UserContext);

  const isAuthScreen =
    navigationState.routes[navigationState.index].name === Routes.Auth;

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setPage((prevPage) => (prevPage ? prevPage - 1 : prevPage));
  };

  const navigate = (route: string) => {
    navigation.navigate(route);
  };

  const signin = async () => {
    const phoneNumberWithCountryCode = "+" + countryCode.trim() + phone.trim();
    const response = await userContext.getOtp(
      phoneNumberWithCountryCode,
      recaptchaVerifier.current,
    );

    if (response.status === "success") {
      nextPage();
    }
  };

  const renderPage = (page: number) => {
    switch (page) {
      case 0:
        return (
          <View>
            <Text style={styles.appName}>My Travel Companion</Text>
            {userContext.isAccountLoading ? (
              <ActivityIndicator size={40} color="#6750a4" />
            ) : (
              <Button onPress={nextPage} mode="contained">
                Get Started
              </Button>
            )}
          </View>
        );
      case 1:
        return (
          <LoginScreen
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            phone={phone}
            setPhone={setPhone}
            signin={signin}
            nextPage={nextPage}
          />
        );
      case 2:
        return <OTPScreen otp={otp} setOtp={setOtp} nextPage={nextPage} />;
      case 3:
        return (
          <GetUserInfoScreen
            otp={otp}
            phone={phone}
            setError={setError}
            prevPage={prevPage}
          />
        );
    }
  };

  const modalStyles = StyleSheet.create({
    modalContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#ece7e5",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 20,
      paddingTop: page ? 0 : 20,
      width: "100%",
    },
  });

  return (
    <SafeAreaView style={{ width: "100%", height: "100%" }}>
      <View style={styles.container}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification
        />
        <Image style={styles.image} source={require("../assets/travel.png")} />
        <Modal
          animationType="slide"
          visible={isAuthScreen && !error.isError && isModalVisible}
          transparent
        >
          <View style={modalStyles.modalContainer}>
            {page !== 0 && (
              <View style={styles.head}>
                {page !== 0 && (
                  <IconButton icon={"arrow-left"} onPress={prevPage} />
                )}
              </View>
            )}
            {environment === ENV.DEV && (
              <IconButton
                icon={"close"}
                onPress={() => {
                  setIsModalVisible(false);
                  setTimeout(() => {
                    setIsModalVisible(true);
                  }, 1000);
                }}
              />
            )}
            <View style={styles.modalContent}>{renderPage(page)}</View>
          </View>
        </Modal>
      </View>
      <Dialog visible={error.isError}>
        <Dialog.Title>
          <Text>Error</Text>
        </Dialog.Title>
        <Dialog.Content>
          <Text>{error.message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => setError({ isError: false, message: "No Error." })}
          >
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingTop:
    //   Platform.OS === OperatingSystems.Android ? StatusBar.currentHeight : 0,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%",
    height: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  button: {
    width: 100,
    height: 30,
  },
  appName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#6750a4",
  },
  head: {
    width: "100%",
    justifyContent: "flex-end",
  },
});
