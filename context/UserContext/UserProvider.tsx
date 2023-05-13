import React, { useEffect, useReducer, useState } from "react";
import UserContext, { IUserContext } from "./UserContext";
import app, { auth } from "../../firebase";
import {
  PhoneAuthProvider,
  User,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";

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
      return "success";
    } catch (error: any) {
      console.log(error);
      setIsError(true);
      setErrorMessage(error.messsage);
      return error;
    }
  };

  const verifyOtp = async (otp: string) => {
    try {
      const credential = PhoneAuthProvider.credential(
        verficationId as string,
        otp
      );
      const response = await signInWithCredential(auth, credential);
      setUser(response.user);
      return response.user;
    } catch (error: any) {
      console.log(error);
      setIsError(true);
      setErrorMessage(error.message);
      return error;
    }
  };

  const signout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.log(error);
      setIsError(true);
      setErrorMessage(error.message);
      return error;
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
    verifyOtp,
    signout,
    resetError,
  };

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
