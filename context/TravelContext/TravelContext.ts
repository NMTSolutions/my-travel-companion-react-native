import { FirestoreError } from "firebase/firestore";
import { createContext } from "react";

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface ICompanion {
  username: string;
  displayName: string;
  location: ICoordinates;
}

export interface IAccount {
  username: string;
  displayName: string;
  phoneNumber: string;
}

export interface ITravelResponse {
  status: string;
  searchedAccounts?: IAccount[];
  error?: FirestoreError;
}

export interface ITravelContext {
  myCompanions: ICompanion[];
  searchedAccounts: IAccount[];
  markLost: (location: ICoordinates) => Promise<ITravelResponse>;
  searchAccounts: (searchKey: string) => Promise<ITravelResponse>;
}

const initialContext: ITravelContext = {
  myCompanions: [],
  searchedAccounts: [],
  markLost: async (location: ICoordinates) => ({} as ITravelResponse),
  searchAccounts: async (searchKey: string) => ({} as ITravelResponse),
};

const TravelContext = createContext(initialContext);

export default TravelContext;
