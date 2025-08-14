import { createContext } from "react";

export type LoginContextType = { 
    login: string | null;
    setLogin: React.Dispatch<React.SetStateAction<string | null>>;
}

export const LoginContext = createContext<LoginContextType>({login: null, setLogin: () => {}});


