import { createContext } from "react";
import { AuthError, User } from "firebase/auth";
import { IAccount } from "../TravelContext/TravelContext";

export interface IAuthResponse {
  status: string;
  user?: User;
  error?: AuthError;
}

export interface IUserContext {
  user: User | null;
  isAccountLoading: boolean;
  myAccount: IAccount | null;
  isError: boolean;
  errorMessage: string;
  getOtp: (
    phoneNumber: string,
    applicationVerifier: any,
  ) => Promise<IAuthResponse>;
  registerUser: (
    otp: string,
    username: string,
    displayName: string,
  ) => Promise<IAuthResponse>;
  signout: () => void;
  resetError: () => void;
}

const initialContext: IUserContext = {
  user: null,
  isAccountLoading: false,
  myAccount: null,
  isError: false,
  errorMessage: "No Error.",
  getOtp: async (phoneNumber, applicationVerifier) => ({} as IAuthResponse),
  registerUser: async (otp: string, username: string, displayName: string) =>
    ({} as IAuthResponse),
  signout: async () => {},
  resetError: () => {},
};

const UserContext = createContext(initialContext);

export default UserContext;
