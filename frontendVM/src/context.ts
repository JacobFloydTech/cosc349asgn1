import { createContext } from "react";
import type { Website } from "./vite-env";

export type LoginContextType = { 
    login: string | null;
    setLogin: React.Dispatch<React.SetStateAction<string | null>>;
}

export type PopupContextType = { 
    website: Website | null,
    setWebsite: React.Dispatch<React.SetStateAction<Website | null>>;
}

export const LoginContext = createContext<LoginContextType>({login: null, setLogin: () => {}});
export const PopupContext = createContext<PopupContextType>({website :null, setWebsite: () => { }})