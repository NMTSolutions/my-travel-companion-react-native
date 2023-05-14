export enum Routes {
  Auth = "/auth",
  Dashboard = "/dashboard",
  Profile = "/profile",
  SearchCompanions = "/search-companions",
  MyCompanions = "/my-companions",
  FindCompanion = "/find-companion",
}

export type RootStackParamList = {
  [Routes.Auth]: undefined;
  [Routes.Dashboard]: undefined;
  [Routes.Profile]: undefined;
  [Routes.SearchCompanions]: undefined;
  [Routes.MyCompanions]: undefined;
  [Routes.FindCompanion]: { name: string; lat: string; long: string };
};
