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

export interface ITravelContext {
  myCompanions: ICompanion[];
  markLost: (location: ICoordinates) => Promise<void>;
}

const initialContext: ITravelContext = {
  myCompanions: [],
  markLost: async (location: ICoordinates) => {},
};

const TravelContext = createContext(initialContext);

export default TravelContext;
