"use client";
import React, { ReactNode } from "react";
import { Dispatch, createContext, useReducer } from "react";
import { CurrentToken, getUserClient } from "@/utils/localStorage";
import { login, logout, signUpFlow } from "./services";
import { usePathname, useRouter } from "next/navigation";
import { protectedPaths } from "@/utils/data/ProtectedRoutes";

type StateType = {
    loading: boolean;
    address: string | undefined;
    signer: any | undefined;
};

type ActionType = {
    type: "setLoading" | "setUser";
    payload?: any;
};

const user = getUserClient();

const initialState: StateType = {
    address: user?.publicAddress,
    signer: undefined,
    loading: false,
};

const reducer = (state: StateType, action: ActionType): StateType => {
    switch (action.type) {
        case "setLoading":
            return { ...state, loading: action.payload };

        case "setUser":
            return { ...state, ...action.payload };

        default:
            return state;
    }
};

export const AuthContext = createContext<{
    state: StateType;
    dispatch: Dispatch<ActionType>;
    setLoading: (loading: boolean) => null;
    signout: () => null;
    signin: (signer: any) => null;
    setSigner: (signer: any) => null;
}>({
    state: initialState,
    dispatch: () => null,
    setLoading: (loading: boolean) => null,
    setSigner: (signer: any) => null,
    signout: () => null,
    signin: (signer: any) => null,
});

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const router = useRouter();
    const pathname = usePathname();

    const sign_In = async (signer: any) => {
        dispatch({ type: "setLoading", payload: true });
        try {
            // console.log("= Create Wallet Triggered =");
            const userAddress = await signer!.getAddress();

            const nonce: string = await signUpFlow(userAddress);
            if (!nonce) {
                throw new Error("No Nonce Found");
            }
            const message = `My App Auth Service Signing nonce: ${nonce}`;
            let signature = await signer!.signMessage(message);
            // console.log("::::::::::::::::nonce has been found::::::::::::");

            const token = await login(userAddress, signature);
            // console.log("login api has been running :::::")
            new CurrentToken().set({ token: token.accessToken });

            const user = getUserClient();
            if (!user?.email) {
                router.push("/onboarding")
            }
            dispatch({
                type: "setUser",
                payload: { address: userAddress, error: undefined, loading: false },
            });
        } catch (e: any) {
            dispatch({ type: "setUser", payload: { error: e.message, loading: false } });
        }
    };

    const setLoading = (loading: boolean) => {
        dispatch({ type: "setLoading", payload: loading });
        return null;
    };

    const setSigner = (signer: any) => {
        dispatch({ type: "setUser", payload: { signer: signer } });
        return null;
    };

    const signin = (signer: any) => {
        sign_In(signer)
            .then((val) => {})
            .catch((e) => console.log(e));
        // dispatch({ type: "setLoading",payload:loading })
        return null;
    };

    const disconnectWallet = async () => {
        // console.log("= Disconnecting Wallet =");
        try {
            dispatch({ type: "setLoading", payload: true });
            new CurrentToken().remove();
            await logout();
            const payload = {
                address: undefined,
                error: undefined,
                loading: false,
            };
            dispatch({ type: "setUser", payload: payload });
        } catch (e: any) {
            dispatch({ type: "setUser", payload: { error: e.message, loading: false } });
        }
    };

    const signout = () => {
        dispatch({ type: "setLoading", payload: true });

        disconnectWallet()
            .then((val) => {
                if(protectedPaths.includes(pathname) && typeof window !== "undefined"){
                    window !== undefined && window.location.reload();
                }
                dispatch({ type: "setLoading", payload: false });
            })
            .catch((e) => console.log(e));

        return null;
    };

    return (
        <AuthContext.Provider
            value={{ state, dispatch, setLoading, signout, signin, setSigner }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
