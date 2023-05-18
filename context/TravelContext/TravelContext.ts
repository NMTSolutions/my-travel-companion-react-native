import { FieldValue, FirestoreError } from "firebase/firestore";
import { createContext } from "react";

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface IAccount {
  id: string;
  username: string;
  displayName: string;
  phoneNumber: string;
  accountCreatedOn: FieldValue;
}

export interface ICompanionRequest {
  id: string;
  companionRequestId: string;
  username: string;
  displayName: string;
  phoneNumber: string;
  accountCreatedOn: FieldValue;
  companionRequestSentOn: FieldValue;
}

export interface ICompanion {
  id: string;
  companionRequestId: string;
  companionId: string;
  username: string;
  displayName: string;
  phoneNumber: string;
  accountCreatedOn: FieldValue;
  companionRequestSentOn: FieldValue;
  companionRequestAcceptedOn: FieldValue;
}

export interface ITravelResponse {
  status: string;
  docId?: string;
  searchedAccounts?: IAccount[];
  companionsRequests?: ICompanionRequest[];
  myCompanions?: ICompanion[];
  error?: FirestoreError;
}

export interface ITravelContext {
  myCompanions: ICompanion[];
  companionsRequests: ICompanionRequest[];
  searchedAccounts: IAccount[];
  markLost: (location: ICoordinates) => Promise<ITravelResponse>;
  searchAccounts: (
    searchKey: string,
    isSearchingForCR?: boolean
  ) => Promise<ITravelResponse>;
  sendCompanionRequest: (account: IAccount) => Promise<ITravelResponse>;
  getCompanionRequests: () => Promise<ITravelResponse>;
  acceptCompanionRequest: (
    request: ICompanionRequest
  ) => Promise<ITravelResponse>;
  rejectCompanionRequest: (
    request: ICompanionRequest
  ) => Promise<ITravelResponse>;
  getCompanions: () => Promise<ITravelResponse>;
  removeCompanion: (companion: ICompanion) => Promise<ITravelResponse>;
}

const initialContext: ITravelContext = {
  myCompanions: [],
  companionsRequests: [],
  searchedAccounts: [],
  markLost: async (location: ICoordinates) => ({} as ITravelResponse),
  searchAccounts: async (searchKey: string, isSearchingForCR?: boolean) =>
    ({} as ITravelResponse),
  sendCompanionRequest: async (account: IAccount) => ({} as ITravelResponse),
  getCompanionRequests: async () => ({} as ITravelResponse),
  acceptCompanionRequest: async (request: ICompanionRequest) =>
    ({} as ITravelResponse),
  rejectCompanionRequest: async (request: ICompanionRequest) =>
    ({} as ITravelResponse),
  getCompanions: async () => ({} as ITravelResponse),
  removeCompanion: async (companion: ICompanion) => ({} as ITravelResponse),
};

const TravelContext = createContext(initialContext);

export default TravelContext;
