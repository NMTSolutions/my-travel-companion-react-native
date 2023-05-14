import React, { useState, useContext } from "react";
import TravelContext, {
  ICoordinates,
  ITravelContext,
  ITravelResponse,
} from "./TravelContext";
import UserContext from "../UserContext/UserContext";

const TravelProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLost, setIsLost] = useState(false);

  const userContext = useContext(UserContext);

  const markLost = async (location: ICoordinates) => {
    try {
      return { status: "success" } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { error } as ITravelResponse;
    }
  };

  const context: ITravelContext = {
    myCompanions: [],
    markLost,
  };
  return (
    <TravelContext.Provider value={context}>{children}</TravelContext.Provider>
  );
};

export default TravelProvider;
