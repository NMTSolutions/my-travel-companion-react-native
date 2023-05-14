import { FirestoreError } from "firebase/firestore";
import { createContext } from "react";

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface IAccount {
  id: string;
  deleteId?: string;
  username: string;
  displayName: string;
  phoneNumber: string;
}

export interface ITravelResponse {
  status: string;
  docId?: string;
  searchedAccounts?: IAccount[];
  companionsRequests?: IAccount[];
  myCompanions?: IAccount[];
  error?: FirestoreError;
}

export interface ITravelContext {
  myCompanions: IAccount[];
  companionsRequests: IAccount[];
  searchedAccounts: IAccount[];
  markLost: (location: ICoordinates) => Promise<ITravelResponse>;
  searchAccounts: (searchKey: string) => Promise<ITravelResponse>;
  sendCompanionRequest: (account: IAccount) => Promise<ITravelResponse>;
  getCompanionRequests: (accountId: string) => Promise<ITravelResponse>;
  acceptCompanionRequest: (account: IAccount) => Promise<ITravelResponse>;
  rejectCompanionRequest: (account: IAccount) => Promise<ITravelResponse>;
  getCompanions: (accountId: string) => Promise<ITravelResponse>;
  removeCompanion: (account: IAccount) => Promise<ITravelResponse>;
}

const initialContext: ITravelContext = {
  myCompanions: [],
  companionsRequests: [],
  searchedAccounts: [],
  markLost: async (location: ICoordinates) => ({} as ITravelResponse),
  searchAccounts: async (searchKey: string) => ({} as ITravelResponse),
  sendCompanionRequest: async (account: IAccount) => ({} as ITravelResponse),
  getCompanionRequests: async (accountId: string) => ({} as ITravelResponse),
  acceptCompanionRequest: async (account: IAccount) => ({} as ITravelResponse),
  rejectCompanionRequest: async (account: IAccount) => ({} as ITravelResponse),
  getCompanions: async (accountId: string) => ({} as ITravelResponse),
  removeCompanion: async (account: IAccount) => ({} as ITravelResponse),
};

const TravelContext = createContext(initialContext);

export default TravelContext;
