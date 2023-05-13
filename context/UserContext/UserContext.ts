import { createContext } from "react";
import { AuthError, User } from "firebase/auth";

export interface IAuthResponse {
  status: string;
  user?: User;
  error?: AuthError;
}

export interface IUserContext {
  user: User | null;
  isError: boolean;
  errorMessage: string;
  getOtp: (
    phoneNumber: string,
    applicationVerifier: any
  ) => Promise<IAuthResponse>;
  verifyOtp: (otp: string) => Promise<IAuthResponse>;
  signout: () => void;
  resetError: () => void;
}

const initialContext: IUserContext = {
  user: null,
  isError: false,
  errorMessage: "No Error.",
  getOtp: async (phoneNumber, applicationVerifier) => ({} as IAuthResponse),
  verifyOtp: async (otp: string) => ({} as IAuthResponse),
  signout: async () => {},
  resetError: () => {},
};

const UserContext = createContext(initialContext);

export default UserContext;
