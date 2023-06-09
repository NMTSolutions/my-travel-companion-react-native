import React from "react";
import { Routes } from "./availableRoutes";

import AuthScreen from "../screens/AuthScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CompanionsScreen from "../screens/CompanionsScreen";
import FindCompanion from "../screens/FindCompanion";
import NotificationsScreen from "../screens/NotificationsScreen";

export interface IRoute {
  name: string;
  path: Routes;
  component: React.FC<any>;
}

const routes: IRoute[] = [
  { name: "Authentication", path: Routes.Auth, component: AuthScreen },
  { name: "Dashboard", path: Routes.Dashboard, component: DashboardScreen },
  { name: "Profile", path: Routes.Profile, component: ProfileScreen },
  {
    name: "Search Companions",
    path: Routes.SearchCompanions,
    component: CompanionsScreen,
  },
  {
    name: "My Companions",
    path: Routes.MyCompanions,
    component: CompanionsScreen,
  },
  {
    name: "Notification",
    path: Routes.Notifications,
    component: NotificationsScreen,
  },
  {
    name: "Find Companion",
    path: Routes.FindCompanion,
    component: FindCompanion,
  },
];

export default routes;
