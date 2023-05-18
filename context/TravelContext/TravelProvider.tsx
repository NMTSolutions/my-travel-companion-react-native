import React, { useState, useContext, useEffect } from "react";
import TravelContext, {
  IAccount,
  ICompanion,
  ICompanionRequest,
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
  onSnapshot,
  or,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { getUserDocId } from "../../utilities/utils";

const TravelProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLost, setIsLost] = useState(false);
  const [searchedAccounts, setSearchedAccounts] = useState<IAccount[]>([]);
  const [companionsRequests, setCompanionsRequests] = useState<
    ICompanionRequest[]
  >([]);
  const [myCompanions, setMyCompanions] = useState<ICompanion[]>([]);

  const userContext = useContext(UserContext);

  const markLost = async (location: ICoordinates) => {
    try {
      const myAccountDocId = getUserDocId(userContext.user?.displayName ?? "");

      return { status: "success" } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { error } as ITravelResponse;
    }
  };

  const searchAccounts = async (searchKey: string) => {
    try {
      const user = userContext.user;

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

      const filteredAccounts = accounts;

      // .filter(
      //   (acc) =>
      //     acc.id !== user?.uid &&
      //     companionsRequests.findIndex((req) => req.id === acc.id) === -1 &&
      //     myCompanions.findIndex((companion) => companion.id === acc.id) === -1
      // );

      setSearchedAccounts(filteredAccounts);

      return {
        status: "success",
        searchedAccounts: filteredAccounts,
      } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const sendCompanionRequest = async (account: IAccount) => {
    try {
      const myAccount = userContext.myAccount;

      const accountDocRef = doc(firestore, "companionRequests", account.id);
      const requestCollectionRef = collection(accountDocRef, "requests");

      const docRef = await addDoc(requestCollectionRef, {
        ...myAccount,
        companionRequestSentOn: serverTimestamp(),
      });

      return { status: "success", docId: docRef.id } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error };
    }
  };

  const getCompanionRequests = async () => {
    try {
      const user = userContext.user;

      const accountDocRef = doc(
        firestore,
        "companionRequests",
        user?.uid ?? ""
      );
      const requestCollectionRef = collection(accountDocRef, "requests");

      const dataSnapshot = await getDocs(requestCollectionRef);

      const myCompanionRequests = dataSnapshot.docs.map((request) => {
        const req = request.data();
        return { ...req, companionRequestId: request.id } as ICompanionRequest;
      });

      setCompanionsRequests(myCompanionRequests);

      return {
        status: "success",
        companionsRequests: myCompanionRequests,
      } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error };
    }
  };

  const acceptCompanionRequest = async (request: ICompanionRequest) => {
    try {
      const user = userContext.user;
      const myAccount = userContext.myAccount;

      const batch = writeBatch(firestore);

      //adding in my companions
      const companionsDocRef = doc(firestore, "myCompanions", user?.uid ?? "");
      const companionsCollectionRef = collection(
        companionsDocRef,
        "companions"
      );

      const docRef = await addDoc(companionsCollectionRef, {
        ...request,
        companionRequestAcceptedOn: serverTimestamp(),
      });

      //adding in opponent's companions
      const oppCompanionDocRef = doc(firestore, "myCompanions", request.id);
      const oppCompanionCollectionRef = collection(
        oppCompanionDocRef,
        "companions"
      );

      // const oppData = await addDoc(oppFriendsCollectionRef, {
      //   ...myAccount,
      //   friendRequestId: request.friendRequestId,
      // });

      await addDoc(oppCompanionCollectionRef, {
        ...myAccount,
        companionRequestId: request.companionRequestId,
        companionRequestAcceptedOn: serverTimestamp(),
      });

      //removing from my companion requests
      const companionsRequestDocRef = doc(
        firestore,
        "companionRequests",
        user?.uid ?? "",
        "requests",
        request.companionRequestId
      );
      await deleteDoc(companionsRequestDocRef);

      //removing from opponent's companion requests
      const oppFriendsRequestDocRef = doc(
        firestore,
        "companionRequests",
        request.id
      );
      const oppFriendsRequestCollectionRef = collection(
        oppFriendsRequestDocRef,
        "requests"
      );

      const deleteQuery = query(
        oppFriendsRequestCollectionRef,
        where("id", "==", myAccount?.id)
      );
      const querySnapshot = await getDocs(deleteQuery);

      for (const docSnap of querySnapshot.docs) {
        const docRef = doc(
          firestore,
          "companionRequests",
          request.id,
          "requests",
          docSnap.id
        );
        await deleteDoc(docRef);
      }

      await batch.commit();

      return { status: "success", docId: docRef.id } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const rejectCompanionRequest = async (request: ICompanionRequest) => {
    try {
      const user = userContext.user;

      const companionRequestDocRef = doc(
        firestore,
        "companionRequests",
        user?.uid ?? "",
        "requests",
        request.companionRequestId
      );
      await deleteDoc(companionRequestDocRef);

      setCompanionsRequests((prevRequests) =>
        prevRequests.filter(
          (requestAccount) => requestAccount.id !== request.id
        )
      );
      return { status: "success" } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const getCompanions = async () => {
    try {
      const user = userContext.user;

      const companionsDocRef = doc(firestore, "myCompanions", user?.uid ?? "");
      const companionsCollectionRef = collection(
        companionsDocRef,
        "companions"
      );
      const dataSnapshot = await getDocs(companionsCollectionRef);

      const myCompanions = dataSnapshot.docs.map((companion) => {
        const cmp = companion.data();
        return { ...cmp, companionId: companion.id } as ICompanion;
      });

      setMyCompanions(myCompanions);

      return {
        status: "success",
        myCompanions,
      } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const removeCompanion = async (companion: ICompanion) => {
    try {
      const user = userContext.user;
      const myAccount = userContext.myAccount;

      const batch = writeBatch(firestore);

      //removing friend from my account
      const companionDocRef = doc(
        firestore,
        "myCompanions",
        user?.uid ?? "",
        "companions",
        companion.companionId
      );

      await deleteDoc(companionDocRef);

      //removing from opponent account

      const oppCompanionDocRef = doc(firestore, "myCompanions", companion.id);
      const oppCompanionCollectionRef = collection(
        oppCompanionDocRef,
        "companions"
      );

      const deleteQuery = query(
        oppCompanionCollectionRef,
        where("id", "==", myAccount?.id)
      );

      const querySnapshot = await getDocs(deleteQuery);

      for (const docSnap of querySnapshot.docs) {
        const docRef = doc(
          firestore,
          "myCompanions",
          companion.id,
          "companions",
          docSnap.id
        );

        await deleteDoc(docRef);
      }

      await batch.commit();

      setMyCompanions((prevCompanions) =>
        prevCompanions.filter((comp) => comp.id !== companion.id)
      );

      return { status: "success" } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  useEffect(() => {
    const user = userContext.user;
    if (user) {
      getCompanionRequests();
      getCompanions();

      const unsubscribeCompanionRequest = onSnapshot(
        collection(firestore, "companionRequests", user.uid, "requests"),
        (myReceivedCRsSnapshot) => {
          const myReceivedCRs = myReceivedCRsSnapshot.docs.map((req) => {
            const request = req.data();
            return {
              ...request,
              companionRequestId: req.id,
            } as ICompanionRequest;
          });
          setCompanionsRequests(myReceivedCRs);
        }
      );

      const unsubscribeMyCompanions = onSnapshot(
        collection(firestore, "myCompanions", user.uid, "companions"),
        (myCompanionsSnapshot) => {
          const myCompanios = myCompanionsSnapshot.docs.map((companion) => {
            const cmp = companion.data();
            return { ...cmp, companionId: companion.id } as ICompanion;
          });
          setMyCompanions(myCompanios);
        }
      );

      return () => {
        unsubscribeCompanionRequest();
        unsubscribeMyCompanions();
      };
    }
  }, [userContext.user]);

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
