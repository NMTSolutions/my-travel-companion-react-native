import React, { useState, useContext, useEffect } from "react";
import TravelContext, {
  IAccount,
  ICompanion,
  ICompanionRequest,
  ICoordinates,
  ILostCompanion,
  ILostMessage,
  INotification,
  ITravelContext,
  ITravelResponse,
  NotificationType,
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
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../../firebase";

const TravelProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLost, setIsLost] = useState(false);
  const [lostComapnion, setLostCompanion] = useState<ILostCompanion | null>(
    null
  );
  const [searchedAccounts, setSearchedAccounts] = useState<IAccount[]>([]);
  const [companionsRequests, setCompanionsRequests] = useState<
    ICompanionRequest[]
  >([]);
  const [myCompanions, setMyCompanions] = useState<ICompanion[]>([]);
  const [myNotifications, setMyNotifications] = useState<INotification[]>([]);
  const [myLostCompanions, setMyLostCompanions] = useState<ILostCompanion[]>(
    []
  );

  const userContext = useContext(UserContext);

  const sendNotification = async (
    toUid: string,
    notification: INotification
  ) => {
    try {
      const companionNotifRef = doc(firestore, "myNotifications", toUid);

      const companionNotifCollection = collection(
        companionNotifRef,
        "notifications"
      );

      const notifRef = await addDoc(companionNotifCollection, notification);

      return { status: "success", notifId: notifRef.id } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const getNotifications = async () => {
    try {
      const user = userContext.user;

      const notificationsDocRef = doc(
        firestore,
        "myNotifications",
        user?.uid ?? ""
      );
      const notificationsCollectionRef = collection(
        notificationsDocRef,
        "notifications"
      );
      const dataSnapshot = await getDocs(notificationsCollectionRef);

      const myNotifications = dataSnapshot.docs.map((notification) => {
        const cmp = notification.data();
        return { ...cmp, id: notification.id } as INotification;
      });

      setMyNotifications(myNotifications);

      return {
        status: "success",
        myNotifications,
      } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const user = userContext.user;

      await setDoc(
        doc(
          firestore,
          "myNotifications",
          user?.uid ?? "",
          "notifications",
          notificationId
        ),
        {
          isRead: true,
        },
        { merge: true }
      );
      return { status: "success" } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const searchAccounts = async (searchKey: string, isSearchingForCR = true) => {
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

      let searchedAccounts = accounts;

      if (isSearchingForCR) {
        const filteredAccounts = accounts.filter(
          (acc) =>
            acc.id !== user?.uid &&
            companionsRequests.findIndex((req) => req.id === acc.id) === -1 &&
            myCompanions.findIndex((companion) => companion.id === acc.id) ===
              -1
        );
        searchedAccounts = filteredAccounts;
        setSearchedAccounts(filteredAccounts);
      } else {
        searchedAccounts = accounts;
        setSearchedAccounts(accounts);
      }

      return {
        status: "success",
        searchedAccounts,
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

      const notification: INotification = {
        type: NotificationType.CompanionRequest,
        message: `${myAccount?.displayName} sent a companion request.`,
        time: serverTimestamp(),
        isRead: false,
      };

      await sendNotification(account.id, notification);

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

      const notification: INotification = {
        type: NotificationType.CompanionRequestAccepted,
        message: `${myAccount?.displayName} accepted your companion request.`,
        time: serverTimestamp(),
        isRead: false,
      };

      await sendNotification(request.id, notification);

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

      const myAccount = userContext.myAccount;

      const companionRequestDocRef = doc(
        firestore,
        "companionRequests",
        user?.uid ?? "",
        "requests",
        request.companionRequestId
      );
      await deleteDoc(companionRequestDocRef);

      const notification: INotification = {
        type: NotificationType.CompanionRequestRejected,
        message: `${myAccount?.displayName} rejected your companion request.`,
        time: serverTimestamp(),
        isRead: false,
      };

      await sendNotification(request.id, notification);

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

      const notification: INotification = {
        type: NotificationType.RemovedFromCompanions,
        message: `${myAccount?.displayName} removed you from their companions.`,
        time: serverTimestamp(),
        isRead: false,
      };

      await sendNotification(companion.id, notification);

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

  const markLost = async (location: ICoordinates) => {
    try {
      const myAccount = userContext.myAccount;

      const lostCompanion: ILostCompanion = {
        companion: userContext.myAccount as IAccount,
        coordinates: location,
        lostOn: serverTimestamp(),
      };

      const lostMsgsSentTo: ILostMessage[] = [];

      for (const companion of myCompanions) {
        //deleting existing lost request if any
        const oppCompanionLostCompanionsDocRef = doc(
          firestore,
          "myLostCompanions",
          companion.id
        );
        const oppCompanionLostCompanionsCollectionRef = collection(
          oppCompanionLostCompanionsDocRef,
          "lostCompanions"
        );

        const deleteQuery = query(
          oppCompanionLostCompanionsCollectionRef,
          where("companion.id", "==", myAccount?.id)
        );

        const querySnapshot = await getDocs(deleteQuery);

        for (const docSnap of querySnapshot.docs) {
          const docRef = doc(
            firestore,
            "myLostCompanions",
            companion.id,
            "lostCompanions",
            docSnap.id
          );

          await deleteDoc(docRef);
        }

        //adding new lost request after deleting existing if any
        const lostCompanionsDocRef = doc(
          firestore,
          "myLostCompanions",
          companion.id
        );

        const lostCompanionsCollectionRef = collection(
          lostCompanionsDocRef,
          "lostCompanions"
        );

        const docRef = await addDoc(lostCompanionsCollectionRef, lostCompanion);

        const notification: INotification = {
          type: NotificationType.LostNotification,
          message: `${lostComapnion?.companion.displayName} marked themself as lost.`,
          time: serverTimestamp(),
          isRead: false,
        };

        const notifRes = await sendNotification(companion.id, notification);

        lostMsgsSentTo.push({
          companion,
          status: docRef.id ? "success" : "fail",
          notificationStatus: notifRes.notifId ? "success" : "fail",
          lostMessageSentOn: serverTimestamp(),
        });
      }

      setIsLost(true);
      setLostCompanion(lostCompanion);
      return {
        status: "success",
        message: `Lost message sent to ${lostMsgsSentTo.length} companions.`,
        lostMsgsSentTo,
      } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const markFound = async () => {
    try {
      const myAccount = userContext.myAccount;

      let foundMsgsSentTo = 0;

      for (const companion of myCompanions) {
        const oppCompanionLostCompanionsDocRef = doc(
          firestore,
          "myLostCompanions",
          companion.id
        );
        const oppCompanionLostCompanionsCollectionRef = collection(
          oppCompanionLostCompanionsDocRef,
          "lostCompanions"
        );

        const deleteQuery = query(
          oppCompanionLostCompanionsCollectionRef,
          where("companion.id", "==", myAccount?.id)
        );

        const querySnapshot = await getDocs(deleteQuery);

        for (const docSnap of querySnapshot.docs) {
          const docRef = doc(
            firestore,
            "myLostCompanions",
            companion.id,
            "lostCompanions",
            docSnap.id
          );

          await deleteDoc(docRef);
        }

        const notification: INotification = {
          type: NotificationType.FoundNotification,
          message: `${lostComapnion?.companion.displayName} marked themself as found.`,
          time: serverTimestamp(),
          isRead: false,
        };

        const notifRes = await sendNotification(companion.id, notification);
        if (notifRes.status === "success") {
          foundMsgsSentTo++;
        }
      }

      setIsLost(false);

      return {
        status: "success",
        foundMsgsSentTo,
      } as ITravelResponse;
    } catch (error: any) {
      console.log(error);
      return { status: "error", error } as ITravelResponse;
    }
  };

  const getLostCompanions = async () => {
    try {
      const user = userContext.user;

      const lostCompanionsDocRef = doc(
        firestore,
        "myLostCompanions",
        user?.uid ?? ""
      );
      const lostCompanionsCollectionRef = collection(
        lostCompanionsDocRef,
        "lostCompanions"
      );
      const dataSnapshot = await getDocs(lostCompanionsCollectionRef);

      const myLostCompanions = dataSnapshot.docs.map((lostCompanion) => {
        const lostCmp = lostCompanion.data();
        return {
          ...lostCmp,
          lostCompanionId: lostCompanion.id,
        } as ILostCompanion;
      });

      setMyLostCompanions(myLostCompanions);

      return {
        status: "success",
        myCompanions,
      } as ITravelResponse;
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
      getNotifications();
      getLostCompanions();

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

      const unsubscribeNotifications = onSnapshot(
        collection(firestore, "myNotifications", user.uid, "notifications"),
        (myNotificationsSnapshot) => {
          const myNotifications = myNotificationsSnapshot.docs.map((notif) => {
            const notification = notif.data();
            return { ...notification, id: notif.id } as INotification;
          });
          setMyNotifications(myNotifications);
        }
      );

      const unsubscribeMyLostCompanions = onSnapshot(
        collection(firestore, "myLostCompanions", user.uid, "lostCompanions"),
        (myLostCompanionsSnapshot) => {
          const myLostCompanions = myLostCompanionsSnapshot.docs.map(
            (lostCompanions) => {
              const lostCmp = lostCompanions.data();
              return {
                ...lostCmp,
                lostCompanionId: lostCompanions.id,
              } as ILostCompanion;
            }
          );
          setMyLostCompanions(myLostCompanions);
        }
      );

      return () => {
        unsubscribeCompanionRequest();
        unsubscribeMyCompanions();
        unsubscribeNotifications();
        unsubscribeMyLostCompanions();
      };
    }
  }, [userContext.user]);

  const context: ITravelContext = {
    myCompanions,
    companionsRequests,
    searchedAccounts,
    myNotifications,
    myLostCompanions,
    isLost,
    markLost,
    markFound,
    searchAccounts,
    sendCompanionRequest,
    getCompanionRequests,
    acceptCompanionRequest,
    rejectCompanionRequest,
    getCompanions,
    removeCompanion,
    markNotificationAsRead,
  };
  return (
    <TravelContext.Provider value={context}>{children}</TravelContext.Provider>
  );
};

export default TravelProvider;
