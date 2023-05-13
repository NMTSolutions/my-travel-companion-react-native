import React from "react";
import { View, StyleSheet } from "react-native";
import CustomIconButton from "./CustomIconButton";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigationState } from "@react-navigation/native";
import { Routes } from "../routes/availableRoutes";

interface IBottomNavigationProps {
  navigation: NavigationProp<ParamListBase>;
}

const navigationItems = [
  { name: "Dashboard", route: Routes.Dashboard, iconName: "home" },
  { name: "Dashboard", route: Routes.Dashboard, iconName: "view-dashboard" },
  {
    name: "Search Companions",
    route: Routes.SearchCompanions,
    iconName: "account-search",
  },
  {
    name: "My Companions",
    route: Routes.MyCompanions,
    iconName: "account-supervisor",
  },
];

const BottomNavigation = ({ navigation }: IBottomNavigationProps) => {
  const navigate = (route: string) => {
    navigation.navigate(route);
  };
  const navigationState = useNavigationState((state) => state);

  const activeRoute = navigationState.routes[navigationState.index].name;

  return (
    <View style={styles.bottomNavigationContainer}>
      {navigationItems.map((nav) => (
        <CustomIconButton
          key={nav.iconName}
          isActive={activeRoute === nav.route}
          icon={nav.iconName}
          onPress={() => {
            navigate(nav.route);
          }}
        />
      ))}
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  bottomNavigationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 5,
    width: "100%",
    height: 85,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
