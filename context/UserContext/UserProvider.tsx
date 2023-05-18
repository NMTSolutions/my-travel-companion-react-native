import React, { useEffect, useState } from "react";
import UserContext, { IAuthResponse, IUserContext } from "./UserContext";
import { auth, firestore } from "../../firebase";
import {
  PhoneAuthProvider,
  User,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getUserDocId } from "../../utilities/utils";
import { IAccount } from "../TravelContext/TravelContext";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [myAccount, setMyAccount] = useState<IAccount | null>(null);
  const [verficationId, setVerificationId] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("No Error.");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const getOtp = async (phoneNumber: string, applicationVerifier: any) => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verficationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        applicationVerifier
      );
      setVerificationId(verficationId);
      return { status: "success" } as IAuthResponse;
    } catch (error: any) {
      console.log(error);
      setIsError(true);
      setErrorMessage(error.messsage);
      return { status: "error", error } as IAuthResponse;
    }
  };

  const registerUser = async (
    otp: string,
    username: string,
    displayName: string
  ) => {
    try {
      const credential = PhoneAuthProvider.credential(
        verficationId as string,
        otp
      );
      const response = await signInWithCredential(auth, credential);

      // const accessToken = await response.user.getIdToken();

      const isCreatingNewAccount = !response.user.displayName;

      if (isCreatingNewAccount) {
        const docRef = await setDoc(
          doc(firestore, "users", response.user.uid),
          {
            id: response.user.uid,
            username,
            displayName,
            phoneNumber: response.user.phoneNumber,
            accountCreatedOn: serverTimestamp(),
          }
        );

        await updateProfile(response.user, {
          displayName: username,
        });

        setMyAccount({
          id: response.user.uid,
          displayName,
          username,
          phoneNumber: response.user.phoneNumber as string,
          accountCreatedOn: serverTimestamp(),
        });
      } else {
        const userRef = collection(firestore, "users");

        const searchQuery = query(
          userRef,
          where("id", "==", response.user.uid)
        );

        await setDoc(
          doc(firestore, "users", response.user.uid),
          {
            id: response.user.uid,
            displayName,
            username,
            phoneNumber: response.user.phoneNumber as string,
          },
          { merge: true }
        );

        const querySnapshot = await getDocs(searchQuery);

        const myAcc = querySnapshot.docs.map((acc) => {
          return acc.data() as IAccount;
        });

        await updateProfile(response.user, {
          displayName: username,
        });

        setMyAccount(myAcc[0]);
      }

      setUser(response.user);
      return { status: "success", user: response.user } as IAuthResponse;
    } catch (error: any) {
      console.log(error);
      setIsError(true);
      setErrorMessage(error.message);
      return { status: "error", error } as any;
    }
  };

  const signout = async () => {
    try {
      await signOut(auth);
      return { status: "success" } as IAuthResponse;
    } catch (error: any) {
      console.log(error);
      setIsError(true);
      setErrorMessage(error.message);
      return { status: "error", error } as IAuthResponse;
    }
  };

  const resetError = () => {
    setIsError(false);
    setErrorMessage("No Error.");
  };

  const context: IUserContext = {
    user,
    myAccount,
    isError,
    errorMessage,
    getOtp,
    registerUser,
    signout,
    resetError,
  };

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
