import React, { useContext } from "react";
import { FlatList } from "react-native";
import TravelContext from "../context/TravelContext/TravelContext";
import LostComapnionTile from "./LostComapnionTile";

const LostCompanionsList = ({
  navigate,
}: {
  navigate: (route: string, params?: object) => void;
}) => {
  const travelContext = useContext(TravelContext);
  const myLostCompanions = travelContext.myLostCompanions;
  return (
    <FlatList
      data={myLostCompanions}
      renderItem={(lostCompanion) => (
        <LostComapnionTile
          key={lostCompanion.item.companion.id}
          lostCompanion={lostCompanion.item}
          navigate={navigate}
        />
      )}
    />
  );
};

export default LostCompanionsList;
