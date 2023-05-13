import React from "react";
import { View, SafeAreaView, StyleSheet, Image, StatusBar } from "react-native";
import Text from "../components/Text";
import { IconButton } from "react-native-paper";

const ProfileScreen = () => {
  return (
    <SafeAreaView
      style={[
        styles.safeContainer,
        {
          paddingTop: StatusBar.currentHeight,
        },
      ]}
    >
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
          style={styles.profileImage}
        />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.usernameInfo}>
          <View style={styles.tileIcon}>
            <IconButton icon="account" iconColor="gray" />
          </View>
          <View style={styles.tileInfo}>
            <View style={styles.nameLabelCombo}>
              <View>
                <Text style={styles.tileLabel}>Username</Text>
                <Text style={styles.tileContent}>Tauqeer14118</Text>
              </View>
              <View>
                {/* <IconButton icon="pencil" onPress={() => {}} /> */}
              </View>
            </View>
            <View>
              <Text style={styles.tileDescription}>
                This is your username. This will be visible to your companions
                and will be used to search your account.
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.usernameInfo, { marginTop: 20 }]}>
          <View style={styles.tileIcon}>
            {/* <IconButton icon="account" iconColor="gray" /> */}
          </View>
          <View style={styles.tileInfo}>
            <View style={styles.nameLabelCombo}>
              <View>
                <Text style={styles.tileLabel}>Name</Text>
                <Text style={styles.tileContent}>Tauqeer Khan</Text>
              </View>
              <View>
                {/* <IconButton icon="pencil" onPress={() => {}} /> */}
              </View>
            </View>
            <View>
              <Text style={styles.tileDescription}>
                This is your username. This will be visible to your companions.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.phoneInfo}>
          <View style={styles.tileIcon}>
            <IconButton icon="phone" iconColor="gray" />
          </View>
          <View style={styles.tileInfo}>
            <View style={styles.phoneLabelCombo}>
              <View>
                <Text style={styles.tileLabel}>Phone</Text>
                <Text style={styles.tileContent}>+91 8879998633 </Text>
              </View>
            </View>
            <View>
              <Text style={styles.tileDescription}>
                This is your phone number. This will be visible to your
                companions.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: "#ece7e5",
    height: "100%",
    position: "relative",
  },
  profileImageContainer: {
    marginTop: 50,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  infoContainer: { padding: 20 },
  usernameInfo: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    // marginTop: 20,
  },
  nameLabelCombo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  phoneInfo: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 20,
  },
  phoneLabelCombo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  tileIcon: { width: "20%" },
  tileInfo: { width: "80%" },
  tileLabel: { fontSize: 14, color: "gray" },
  tileContent: { fontSize: 16, fontWeight: "400" },
  tileDescription: { fontSize: 12, color: "gray" },
});