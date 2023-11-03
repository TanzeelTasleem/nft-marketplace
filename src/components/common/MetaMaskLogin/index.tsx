"use client";
import React, { FC, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import MetaMaskOnboarding from "@metamask/onboarding";
import { Web3Provider } from "@ethersproject/providers";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { SUPPORTED_CHAINS, metaMask, polygonNetworkMumbai, useEagerConnect } from "../../../utils/web3-config";
import { setAuthLoading, signedInMetaMask } from "../../../redux/slices/authSlice";
import { useRouter } from "next/navigation";

declare global {
    interface Window {
        ethereum?: any;
    }
}

const MetaMaskLogin: FC<{
    CustomTrigButton?: (handleClick: () => void, loading: boolean) => React.ReactNode;
    navButton?: boolean;
    simpleButton?: boolean;
    lgButton?: boolean;
    horizontalBar?: boolean;
    className?: string
}> = ({ CustomTrigButton, navButton, simpleButton, lgButton, horizontalBar, className }) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { isLoading, authState, userData } = useAppSelector((state) => state.auth);
    // const isInstalled = typeof window !== "undefined" && !MetaMaskOnboarding.isMetaMaskInstalled() ? false : true
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
    const [buttonLabel, setButtonLabel] = useState('Connect');
    const [currentChainId, setCurrentChainId] = useState<number | null>(null);

    const switchToPolygonNetwork = async () => {
        if (!window.ethereum) {
            console.error('MetaMask is not installed.');
            return;
        }

        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [polygonNetworkMumbai],
        });
    };


    // Check MetaMask installation status on component mount
    useEffect(() => {
        if (typeof window !== "undefined")
            setIsMetaMaskInstalled(MetaMaskOnboarding.isMetaMaskInstalled());
    }, []);

    // Update button label based on loading and installation status
    useEffect(() => {
        if (loading || isLoading) {
            setButtonLabel('Loading...');
        } else if (!isMetaMaskInstalled) {
            setButtonLabel('Install MetaMask');
        } else {
            setButtonLabel('Connect');
        }
    }, [loading, isLoading, isMetaMaskInstalled]);

    const {
        connector,
        library,
        account,
        chainId,
        activate,
        deactivate,
        active,
        error,
        // setError
    } = useWeb3React<Web3Provider>();

    // useEagerConnect();

    // useEffect(() => {
    //     const { ethereum } = window as any;
    //     if (ethereum && ethereum.on && !active && !error) {
    //         const handleAccountsChanged = (accounts: any) => {
    //             // console.log("USEEFECT ", getLibrary)
    //             console.log("eth handle accountsChanged is running !!!!!!!!!!!!!")
    //             setUserAcc(accounts[0]);
    //             setLoginIni(true);
    //             if (accounts.length > 0) {
    //                 activate(metaMask);
    //             }
    //         };

    //         ethereum.on("accountsChanged", handleAccountsChanged);

    //         return () => {
    //             if (ethereum.removeListener) {
    //                 ethereum.removeListener("accountsChanged", handleAccountsChanged);
    //             }
    //         };
    //     }

    //     return () => { };
    // }, [activate, active]);

    const installMetamask = () => {
        try {
            const onboarding = typeof window !== 'undefined' && new MetaMaskOnboarding();
            onboarding && onboarding.startOnboarding();
        } catch (err) {
            console.log("installMetamask_ERROR", err);
        }
        setLoading(false);
        dispatch(setAuthLoading(false));
    };

    const connect = async () => {
        setLoading(true);
        dispatch(setAuthLoading(true));
        // console.log("connect func is runnign", currentChainId)
        try {
            if (!SUPPORTED_CHAINS().map((v) => v.id).includes(currentChainId!)) {
                await switchToPolygonNetwork()
            }
            // console.log("activate running ::::: from connect::::: ");
            await activate(metaMask);
            setLoading(false);
            dispatch(setAuthLoading(false));
        } catch (err) {
            console.log("catch from connect fnc", error);
            setLoading(false);
            dispatch(setAuthLoading(false));
            // setError((err as any)?.message);
            // setOpen(true);
        }
    };

    // useEffect(() => {
    //     if (active && account) {
    //         alert(`meta mask active ${account}`)
    //     }
    //     //   console.log("loading ::::::::", loading);
    //     //   console.log("state auth loading ::::::::", isLoading);
    // }, [account, active])

    const handleSubmit = async () => {
        setLoading(true);
        dispatch(setAuthLoading(true));
        if (typeof window !== 'undefined') {
            if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
                installMetamask();
                return;
            }
            try {
                if (!account) {
                    await connect();
                    // console.log("no account handleSubmit is running !!!!!", active);
                } else {
                    // console.log("signin from handle submit");

                    signin(account, library);
                }
            } catch (err) {
                setLoading(false);
                dispatch(setAuthLoading(false));
            }
        }
    };

    // useEffect(() => {
    //     setWeb(library);
    //     // console.log("use Effect running for library change !!!!!");
    //     if (loginIni && userAcc) {
    //         console.log("use Effect running for library change !!!!!", loading);
    //         // setLoading(true);
    //         // dispatch(setAuthLoading(true));
    //         signin(userAcc, library);
    //         // console.log(":::::::::::: auth state ::::::::::" , authState)
    //     }

    // }, [library]);

    // useEffect(() => {
    //     if (loginIni && userAcc) {
    //         console.log("use Effect running for web library change !!!!!", loading, "rendercount", renderCount);
    //         // setLoading(true);
    //         // dispatch(setAuthLoading(true));
    //         signin(userAcc, library);
    //         // console.log(":::::::::::: auth state ::::::::::" , authState)
    //     }
    // }, [web])


    const signin = async (address: string, web3Library: any) => {
        try {
            setLoading(true);
            // console.log("dispatch for login triggerd after::::::::::::::")

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
            setLoading(false);
            dispatch(setAuthLoading(false));
            console.log(err);
        }
    };

    if (CustomTrigButton) {
        return CustomTrigButton(handleSubmit, loading) as any;
    }


    if (navButton) {
        return (
            <div>
                {/* {typeof window !== "undefined" && */}

                <button
                    type="button"
                    className={`connect-btn hover:bg-black flex flex-row items-center gap-2 sm:gap-5 rounded-lg ${className}`}
                    // className="no-underline bg-[#55c891] text-white font-sans border border-transparent nav-button active:scale-95 py-1 px-3 text-center flex align-middle justify-center rounded-full text-xs"
                    disabled={loading || isLoading}
                    style={{ cursor: loading ? "not-allowed" : undefined }}
                    onClick={handleSubmit}
                >
                    <span className="flex items-center">
                        {buttonLabel === 'Loading...' ? (
                            <>
                                {buttonLabel}
                                {/* <Loader2 className="ml-2 h-4 w-4 animate-spin" /> */}
                            </>
                        ) : (
                            buttonLabel
                        )}
                    </span>

                    {/* {loading || isLoading ? (
                        <span className="flex items-center">
                            Loading... <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        </span>
                    ) : typeof window !== 'undefined' && !MetaMaskOnboarding.isMetaMaskInstalled() ? (
                        'Install MetaMask'
                    ) : (
                        'Connect'
                    )} */}

                </button>

            </div>

        );
    }

    if (simpleButton) {
        return (
            <button
                type="button"
                className={`connect-btn hover:bg-black flex flex-row items-center gap-2 sm:gap-5 rounded-lg`}
                disabled={loading}
                style={{ cursor: loading ? "not-allowed" : undefined }}
                onClick={handleSubmit}
            >
                {/* {
        !MetaMaskOnboarding.isMetaMaskInstalled() ?
          "Install MetaMask" :
          loading ?
            "Loading..." :
            "Connect"
        } */}
                Connect
            </button>
        );
    }

    return (
        <div>
            <button
                type="button"
                className="flex items-center justify-center underline border border-transparent text-2xl font-medium font-sans bg-transparent text-cornerFlower shadow-none p-1"
                disabled={loading}
                style={{ cursor: loading ? "not-allowed" : undefined }}
                onClick={handleSubmit}
            >
                {
                    // !MetaMaskOnboarding.isMetaMaskInstalled()
                    //     ? "Install MetaMask"
                    //     : 
                    loading
                        ? "loading...."
                        : "Connect"}
            </button>
        </div>
    );
};

export default MetaMaskLogin;
// CustomTrigButton
