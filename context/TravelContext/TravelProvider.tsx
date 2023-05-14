import React, { useState, useContext } from "react";
import TravelContext, { ICoordinates, ITravelContext } from "./TravelContext";
import UserContext from "../UserContext/UserContext";

const baseUrl = "https://mytravelcompanion-55721-default-rtdb.firebaseio.com";

const TravelProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLost, setIsLost] = useState(false);

  const userContext = useContext(UserContext);

  const markLost = async (location: ICoordinates) => {
    const response = await fetch(
      baseUrl + `/users/${userContext.user?.displayName}/`
    );
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
