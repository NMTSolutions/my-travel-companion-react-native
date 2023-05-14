import React, { useEffect, useReducer, useState } from "react";
import UserContext, { IAuthResponse, IUserContext } from "./UserContext";
import app, { auth, firestore } from "../../firebase";
import {
  PhoneAuthProvider,
  User,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  updateProfile,
} from "firebase/auth";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getUserDocId } from "../../utilities/utils";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
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
        const docRef = await addDoc(collection(firestore, "users"), {
          username,
          displayName,
          phoneNumber: response.user.phoneNumber,
        });

        console.log(docRef);

        await updateProfile(response.user, {
          displayName: username + `(${docRef.id})`,
        });
      } else {
        const userDocId = getUserDocId(response.user.displayName ?? "");
        const userRef = doc(firestore, "users", userDocId);

        await updateDoc(userRef, {
          username,
          displayName,
          phoneNumber: response.user.phoneNumber,
        });
        await updateProfile(response.user, {
          displayName: username + `(${userDocId})`,
        });
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
    user: user,
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
