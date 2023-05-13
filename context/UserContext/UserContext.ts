import { createContext } from "react";
import { User } from "firebase/auth";

export interface IUserContext {
  user: User | null;
  isError: boolean;
  errorMessage: string;
  getOtp: (
    phoneNumber: string,
    applicationVerifier: any
  ) => Promise<string | Error>;
  verifyOtp: (otp: string) => Promise<User | Error>;
  signout: () => void;
  resetError: () => void;
}

const initialContext: IUserContext = {
  user: null,
  isError: false,
  errorMessage: "No Error.",
  getOtp: async (phoneNumber, applicationVerifier) => "",
  verifyOtp: async (otp: string) => ({} as User),
  signout: async () => {},
  resetError: () => {},
};

const UserContext = createContext(initialContext);

export default UserContext;
