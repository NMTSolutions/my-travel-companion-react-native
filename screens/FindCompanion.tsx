import React from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { RootStackParamList, Routes } from "../routes/availableRoutes";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

interface IFindCompanionScreenProps {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<RootStackParamList, Routes.FindCompanion>;
}

const FindCompanion = ({ navigation, route }: IFindCompanionScreenProps) => {
  const lostCompanion = route.params;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.subContainer}>
        <View>
          <Text style={styles.heading}>
            {lostCompanion.companion.displayName}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            initialRegion={{
              latitude: lostCompanion.coordinates.latitude,
              longitude: lostCompanion.coordinates.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: lostCompanion.coordinates.latitude,
                longitude: lostCompanion.coordinates.longitude,
              }}
              title={lostCompanion.companion.displayName}
              description="I am lost!"
            />
          </MapView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FindCompanion;

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: "600",
    padding: 10,
  },
  safeContainer: {
    backgroundColor: "#ece7e5",
    height: "100%",
    position: "relative",
    // paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  subContainer: {
    height: "100%",
    width: "100%",
    padding: 0,
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
