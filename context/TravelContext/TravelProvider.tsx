import React, { useState, useContext } from "react";
import TravelContext, {
  IAccount,
  ICoordinates,
  ITravelContext,
  ITravelResponse,
} from "./TravelContext";
import UserContext from "../UserContext/UserContext";
import { collection, getDocs, or, query, where } from "firebase/firestore";
import { firestore } from "../../firebase";

const TravelProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLost, setIsLost] = useState(false);
  const [searchedAccounts, setSearchedAccounts] = useState<IAccount[]>([]);

  const userContext = useContext(UserContext);

  const markLost = async (location: ICoordinates) => {
    try {
      return { status: "success" } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { error } as ITravelResponse;
    }
  };

  const searchAccounts = async (searchKey: string) => {
    try {
      const searchQuery = query(
        collection(firestore, "users"),
        or(
          where("username", "==", searchKey),
          where(
            "phoneNumber",
            "==",
            searchKey.includes("+91") ? searchKey : `+91${searchKey}`
          )
        )
      );
      const documentSnapshot = await getDocs(searchQuery);
      const accounts = documentSnapshot.docs.map(
        (account) => account.data() as IAccount
      );
      setSearchedAccounts(accounts);
      return {
        status: "success",
        searchedAccounts: accounts,
      } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const context: ITravelContext = {
    myCompanions: [],
    searchedAccounts,
    markLost,
    searchAccounts,
  };
  return (
    <TravelContext.Provider value={context}>{children}</TravelContext.Provider>
  );
};

export default TravelProvider;
