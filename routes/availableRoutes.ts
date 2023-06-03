import { ILostCompanion } from "../context/TravelContext/TravelContext";

export enum Routes {
  Auth = "/auth",
  Dashboard = "/dashboard",
  Profile = "/profile",
  SearchCompanions = "/search-companions",
  MyCompanions = "/my-companions",
  Notifications = "/notifications",
  FindCompanion = "/find-companion",
}

export type RootStackParamList = {
  [Routes.Auth]: undefined;
  [Routes.Dashboard]: undefined;
  [Routes.Profile]: undefined;
  [Routes.SearchCompanions]: undefined;
  [Routes.MyCompanions]: undefined;
  [Routes.FindCompanion]: ILostCompanion;
};
