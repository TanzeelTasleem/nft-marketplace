"use client";
import React, { FC, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
// import Spinner from "../Spinner";
// import { CurrentToken } from "../../../utils/local-storage-handler";
// import { loadContract } from "../../../redux/slices/contract";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { SUPPORTED_CHAINS, metaMask, useEagerConnect, useInactiveListener } from "@/utils/web3-config";
// import { PAGES } from "@/app-config";
import {
    setAddress,
    setAuthLoading,
    signOut,
    signedInMetaMask,
    updateCurrentAuthUser,
    updateUserDataOnTokenUpdate,
} from "@/redux/slices/authSlice";
import { CurrentToken } from "@/utils/index";
import { usePathname, useRouter } from "next/navigation";
// import { loadContract } from "@/redux/slices/contract";
import MetaMaskOnboarding from "@metamask/onboarding";
// import Navbar from "@/components/layout/navbar";

export const AuthLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { account, library, active, activate, error, chainId } = useWeb3React();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth.authState);
    const userData = useAppSelector((state) => state.auth.userData);
    const isLoading = useAppSelector((state) => state.auth.isLoading);
    const [userAcc, setUserAcc] = useState<any>("");
    const [loginIni, setLoginIni] = useState(false);
    // const [chainId, setChainId] = useState<number | null>(null);

    const [isUserNotOnboarded, setIsUserNotOnboarded] = useState<boolean>(false);
    // const authState = useAppSelector((state) => state.auth.authState);
    // const isUserNotOnboarded = authState === "SIGNED_IN" && !userData?.email && window.location.pathname !== PAGES.ONBOARDING.path;

    useEffect(() => {

        const handleAccountsChanged = (accounts: any) => {
            // console.log("USEEFECT ", getLibrary)
            console.log("eth handle accountsChanged is running !!!!!!!!!!!!!", accounts[0])
            setUserAcc(accounts[0]);
            dispatch(setAddress(accounts[0]))
            setLoginIni(true);
            if (accounts.length > 0) {
                // console.log("Activating from eth handle change accounts > 0", accounts);
                activate(metaMask);
            }
        };

        // Check for the presence of the ethereum object
        if (typeof window !== "undefined" && window.ethereum && window.ethereum.on && !error) {
            const { ethereum } = window as any;
            ethereum.on("accountsChanged", handleAccountsChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener("accountsChanged", handleAccountsChanged);
                }
            };
        }

        return () => { };
    }, [activate, active, error, chainId]);

    // useEffect(() => {
    //     // setWeb(library);
    //     // console.log("use Effect running for library change !!!!!", typeof library, "::::::::::loginIni::::::::", loginIni, "::::::::::userAcc:::::::::::::::", userAcc);

    //     if (loginIni && userAcc && library) {
    //         // console.log("signin triggerd from librabry change ", userAcc, "active::::", active);
    //         signin(userAcc, library);
    //     }
    //     if (loginIni && !userAcc) {
    //         // console.log("dipatch for signout triggerd signOut ::::");
    //         dispatch(signOut());
    //     }

    // }, [userAcc, library]);

    // useEffect(() => {
    //     if (active && account) {
    //         // alert(`meta mask active ${account}`)
    //     }
    //     //   console.log("loading ::::::::", loading);
    //     //   console.log("state auth loading ::::::::", isLoading);
    // }, [userAcc])



    const signin = async (address: string, web3Library: any) => {
        try {
            // setLoading(true);
            // console.log("dispatch for login triggerd layout::::::::::::::")

            if (
                typeof window !== "undefined" &&
                MetaMaskOnboarding.isMetaMaskInstalled() &&
                address
            ) {
                //
                const data = await new Promise<{ userData: any }>((resolve, reject) => {
                    dispatch(
                        signedInMetaMask({
                            address,
                            web3: web3Library,
                            callback: (err, data) => {
                                err && reject(err);
                                data && resolve(data);
                            },
                        }),
                    );
                });

                // console.log("data from sign in :::::::::", data)

                if (!data.userData.email) {
                    router.push("/onboarding");
                    // showHeaderAlert({ severity: "warning", message: "Please verify your email address." })
                }
                // if (!data.id) { navigate(config.PAGES.ONBOARDING.path); }
            }
        } catch (err) {
            // setLoading(false);
            dispatch(setAuthLoading(false));
            console.log(err);
            // setOpen(true);
        }
    };


    // useEffect(() => {
    //     if (userData && authState == "SIGNED_IN" && !isLoading) {
    //         !userData?.email && window.location.pathname !== "/onboarding"
    //             ? setIsUserNotOnboarded(true)
    //             : setIsUserNotOnboarded(false);
    //     }
    // }, [authState, userData]);

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect();
    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager);

    /* Checking if the user is authenticated or not */
    // useEffect(() => {
    //     if (authState === null && triedEager) {
    //         dispatch(updateCurrentAuthUser({ authStatePending: true, signer: library }));
    //     }

    //     /* updating user data on token update in localstorage */
    //     window.addEventListener("storage", (event) => {
    //         if (CurrentToken.storageKey === event.key) {
    //             dispatch(updateUserDataOnTokenUpdate());
    //         }
    //     });
    // }, [triedEager]);

    // useEffect(() => {
    //     /* if user is not verified than redirect him to signup page to verify himself with the verification code */
    //     if (isUserNotOnboarded) {
    //         router.push('/onboarding');
    //     }
    // }, [authState, userData, isUserNotOnboarded]);

    /* checking if the user has changed or disconnect his account it should be logout */
    // useEffect(() => {
    //     // !chainId && listenChainChangeEvent();
    //     if (!userData?.publicAddress || authState === "PENDING" || !account) {
    //         return;
    //     }
    //     if (account?.toLocaleLowerCase() !== userData.publicAddress.toLocaleLowerCase()) {
    //         // console.log("metamask account ===>", account?.toLocaleLowerCase());
    //         // console.log("login user account ===>", userData.authData.publicAddress.toLocaleLowerCase());
    //         console.log("========= signing out =========");
    //         dispatch(signOut());
    //     }

    // }, [account, userData]);

    /* setting contract in redux state */
    // useEffect(() => {
    //     if (library) {
    //         // console.log("library", library)
    //         dispatch(loadContract({ signer: library.getSigner(0) }));
    //     }
    // }, [library, authState, account]);

    return (
        <LayoutWrapper>
            <div aria-label="body" className="max-w-full my-0 mx-auto">
                {/* {authState === "PENDING" || authState === null ? (
                    <svg aria-label='Loading' className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" /> :
                    <div className="flex justify-center items-center h-56" >
                        <Spinner color="primary" />
                    </div>
                ) : isUserNotOnboarded ? (
                    <div />
                ) : ( */}
                {children}
                {/* )} */}
            </div>
        </LayoutWrapper>
    );
};

export default AuthLayout;

const LayoutWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chainId, setChainId] = useState<number | null>(null);
    const dispatch = useAppDispatch();
    const { userData } = useAppSelector(s => s.auth)
    const pathname = usePathname();


    let unsupportedChainError = `The network you have selected is not supported. Please change it to `;

    if (SUPPORTED_CHAINS().length === 1) {
        unsupportedChainError = unsupportedChainError + `${SUPPORTED_CHAINS()[0].name}.`;
    } else if (SUPPORTED_CHAINS().length === 2) {
        unsupportedChainError =
            unsupportedChainError +
            `${SUPPORTED_CHAINS()[0].name} or ${SUPPORTED_CHAINS()[1].name}.`;
    } else if (SUPPORTED_CHAINS().length > 2) {
        unsupportedChainError =
            unsupportedChainError +
            `${SUPPORTED_CHAINS()
                .slice(0, -1)
                .map((v) => v.name)
                .join(", ")} or ${SUPPORTED_CHAINS().slice(-1)[0].name}`;
    }

    const listenChainChangeEvent = () => {
        if (typeof window !== 'undefined') {
            const { ethereum } = window as any;
            try {
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                provider.on("network", (newNetwork, oldNetwork) => {
                    setChainId(newNetwork.chainId);

                });
            } catch (error) {
                setChainId(null);
                // console.log("No web3 object found");
            }
        }
    };

    /* start listing chain change event */
    useEffect(() => {
        !chainId && listenChainChangeEvent();
    }, []);

    useEffect(() => {
        if (userData && chainId && !SUPPORTED_CHAINS().map((v) => v.id).includes(chainId)) {
            dispatch(signOut());
        }
    }, [userData, chainId])

    const navbarHeight = 160; // Replace with the actual height of your Navbar

    return (
        <div >
            {/* <div className="relative">

                <div style={{ flexShrink: "initial" }} className="fixed top-0 z-50 w-full">
                    {pathname !== "/" && (
                        chainId && !SUPPORTED_CHAINS().map(v => v.id).includes(chainId) &&
                        <div className="text-red-600 text-center bg-white md:text-lg text-sm p-4 border-b-4 border-black font-sans">
                            {unsupportedChainError}
                        </div>
                    )}

                    <Navbar />
                </div>

            </div>

            <main style={{ paddingTop: `${pathname !== "/" && chainId && !SUPPORTED_CHAINS().map(v => v.id).includes(chainId) ? navbarHeight : 88}px`, flex: "1 0 auto" }}>{children}</main> */}
            {children}
        </div>
    );
};
