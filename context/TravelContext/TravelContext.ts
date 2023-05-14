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

export interface ITravelResponse {
  status: string;
  error?: FirestoreError;
}

export interface ITravelContext {
  myCompanions: ICompanion[];
  markLost: (location: ICoordinates) => Promise<ITravelResponse>;
}

const initialContext: ITravelContext = {
  myCompanions: [],
  markLost: async (location: ICoordinates) => ({} as ITravelResponse),
};

const TravelContext = createContext(initialContext);

export default TravelContext;
