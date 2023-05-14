import React, { useState, useContext } from "react";
import TravelContext, {
  IAccount,
  ICoordinates,
  ITravelContext,
  ITravelResponse,
} from "./TravelContext";
import UserContext from "../UserContext/UserContext";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  or,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { getUserDocId } from "../../utilities/utils";

const TravelProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLost, setIsLost] = useState(false);
  const [companionsRequests, setCompanionsRequests] = useState<IAccount[]>([]);
  const [searchedAccounts, setSearchedAccounts] = useState<IAccount[]>([]);
  const [myCompanions, setMyCompanions] = useState<IAccount[]>([]);

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

      const accounts = documentSnapshot.docs.map((account) => {
        const accountData = account.data();
        return { ...accountData, id: account.id } as IAccount;
      });

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

  const sendCompanionRequest = async (account: IAccount) => {
    try {
      const accountDocRef = doc(firestore, "companionRequests", account.id);

      const requestsCollectionRef = collection(accountDocRef, "requests");

      const docRef = await addDoc(requestsCollectionRef, account);

      return { status: "success", docId: docRef.id } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error };
    }
  };

  const getCompanionRequests = async (accountId: string) => {
    try {
      const accountDocRef = doc(firestore, "companionRequests", accountId);

      const requestsCollectionRef = collection(accountDocRef, "requests");

      const docSnapshot = await getDocs(requestsCollectionRef);

      const docData = docSnapshot.docs.map((accountRequest) => {
        const account = accountRequest.data();
        return { ...account, deleteId: accountRequest.id } as IAccount;
      });

      setCompanionsRequests(docData);

      return {
        status: "success",
        companionsRequests: docData,
      } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error };
    }
  };

  const acceptCompanionRequest = async (account: IAccount) => {
    try {
      const myAccountDocId = getUserDocId(userContext.user?.displayName ?? "");

      const accountDocRef = doc(firestore, "myCompanions", myAccountDocId);

      const myCompanionsRef = collection(accountDocRef, "companions");

      const docRef = await addDoc(myCompanionsRef, account);

      if (docRef.id) {
        const accountDocRef = doc(
          firestore,
          "companionRequests",
          myAccountDocId
        );

        const requestsCollectionRef = collection(accountDocRef, "requests");

        const docRefToDelete = doc(requestsCollectionRef, account.deleteId);

        await deleteDoc(docRefToDelete);

        setCompanionsRequests((prevRequests) =>
          prevRequests.filter(
            (requestAccount) => requestAccount.id !== account.id
          )
        );
      }

      return { status: "success", docId: docRef.id } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const rejectCompanionRequest = async (account: IAccount) => {
    try {
      const myAccountDocId = getUserDocId(userContext.user?.displayName ?? "");

      const accountDocRef = doc(firestore, "companionRequests", myAccountDocId);

      const requestsCollectionRef = collection(accountDocRef, "requests");

      const docRefToDelete = doc(requestsCollectionRef, account.deleteId);

      await deleteDoc(docRefToDelete);

      setCompanionsRequests((prevRequests) =>
        prevRequests.filter(
          (requestAccount) => requestAccount.id !== account.id
        )
      );
      return { status: "success" } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const getCompanions = async (accountId: string) => {
    try {
      const accountDocRef = doc(firestore, "myCompanions", accountId);

      const requestsCollectionRef = collection(accountDocRef, "companions");

      const docSnapshot = await getDocs(requestsCollectionRef);

      const docData = docSnapshot.docs.map((accountRequest) => {
        const account = accountRequest.data();
        return { ...account, deleteId: accountRequest.id } as IAccount;
      });

      console.log(docData);

      setMyCompanions(docData);

      return {
        status: "success",
        myCompanions: docData,
      } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const removeCompanion = async (account: IAccount) => {
    try {
      const myAccountDocId = getUserDocId(userContext.user?.displayName ?? "");

      const accountDocRef = doc(firestore, "myCompanions", myAccountDocId);

      const myCompanionsCollectionRef = collection(accountDocRef, "companions");

      const docRefToDelete = doc(myCompanionsCollectionRef, account.deleteId);

      await deleteDoc(docRefToDelete);

      setMyCompanions((prevCompanions) =>
        prevCompanions.filter(
          (companion) => companion.deleteId !== account.deleteId
        )
      );

      return { status: "success" } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const context: ITravelContext = {
    myCompanions,
    companionsRequests,
    searchedAccounts,
    markLost,
    searchAccounts,
    sendCompanionRequest,
    getCompanionRequests,
    acceptCompanionRequest,
    rejectCompanionRequest,
    getCompanions,
    removeCompanion,
  };
  return (
    <TravelContext.Provider value={context}>{children}</TravelContext.Provider>
  );
};

export default TravelProvider;
