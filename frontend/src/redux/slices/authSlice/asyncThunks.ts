import { createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout, signUpFlow } from './services';
// import { CurrentToken } from '../../../utils/local-storage-handler';
// import { user as User } from '../../../graphql/graphqlTypes';
import { RootStateType } from '../../store';
import { BigNumber } from 'ethers';
// import { login, logout, signUpFlow } from '@/context/services';
import { CurrentToken, getUserClient } from '@/utils';
// import { User } from '@/db/schema/user';
import { decode } from 'jsonwebtoken';

type signedInweb3AuthProps = {
  signer: any,
  // signer: AlchemyProvider & {
  //   account: LightSmartContractAccount<HttpTransport>;
  // }

  callback?: (err?: any, res?: { userData: any }) => void;
};

export const signedInweb3Auth = createAsyncThunk(
  'signedInweb3Auth/Web3Auth',
  async ({ signer }: signedInweb3AuthProps, thunkAPI) => {
    try {
      if (!signer) {
        console.log("web3auth not initialized yet");
        return;
      }
      const address = await signer.getAddress();
      const nonce: string = await signUpFlow(address);
      if (!nonce) {
        throw new Error("No Nonce Found");
      }

      const message = `My App Auth Service Signing nonce: ${nonce}`;

      let signature = await signer.signMessage(message);

      console.log("signature ::::::", signature, "address", address, message);

      const token = await login(address, signature);
      console.log("login api has been running from web3Auth:::::")
      new CurrentToken().set({ token: token.accessToken });
      const user = getUserClient();
      return user
    } catch (error) {
      console.log("from signin web3Auth catch ::::", JSON.stringify(error));
      throw JSON.stringify(error)
    }

  })


type UpdateCurrentAuthUserProps = {
  authStatePending?: boolean,
  signer?: any,
  callback?: (err?: any, res?: { userData: any }) => void;
};

export const updateCurrentAuthUser = createAsyncThunk(
  'updateCurrentAuthUser/MetaMask',
  async (data: UpdateCurrentAuthUserProps | undefined = { authStatePending: true }, thunkAPI) => {
    const { token } = new CurrentToken().get();
    // console.log("token from updateCurrentAuthUser::::", token);
    try {
      if (!token) {
        throw 'no auth token';
      }

      const decodedToken: any = decode(token);

      if (!decodedToken) {
        throw 'no auth token';
      }

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      console.log("decoded Token :::::", decodedToken, currentTimeInSeconds);

      // Compare the expiration time (exp) from the decoded token with the current time
      if (decodedToken.exp && decodedToken.exp <= currentTimeInSeconds) {
        // Token has expired
        throw 'Token has expired'
      } else {
        // Token is still valid
        console.log('Token is still valid');
      }

      // if (!decodedToken) {
      //   return new Response("Decoded Token", {
      //     status: 401,
      //   });
      // }


      // const res = await data?.signer?.getSigner(0)?.getBalance() as BigNumber | undefined;
      // console.log("user_balance ===>", res?._hex && (Number(res?._hex) / 1e18));
      // if (!res) {
      //   throw 'wallet not connected';
      // }

      const user = getUserClient();

      // console.log("user data updateCurrentAuthUser ::::", user)

      // const newToken = await refreshAuthUser(token);
      // new CurrentToken().remove();
      // const userAuthData = await getAuthUser(newToken!);
      // new CurrentToken().set({
      //   token: newToken!,
      //   expiry_date: userAuthData?.authorizeUser.exp!,
      // });
      // const authData = filterMetaMaskUserAuthData({
      //   authData: userAuthData?.authorizeUser!,
      // });
      // if (!user?.email) {
      //   (thunkAPI.getState() as RootStateType)
      //     .alerts.showHeaderAlert({ severity: "warning", message: "Please verify your email address." })
      // }
      return user;

    } catch (error) {
      await logout();
      throw JSON.stringify(error)
    }
  }
);

// export const signedInMetaMask = createAsyncThunk(
//   'signIn/MetaMask',
//   async ({ address, web3 }: signedInMetaMaskUserProps, thunkAPI) => {
//     try {
//       const nonce = await signUpMetaMask(address);

//       const signature = await web3
//         .getSigner(address)
//         .signMessage(`My App Auth Service Signing nonce: ${nonce}`);

//       const token = await loginMetaMask(address, signature);
//       console.log(token);
//       const userAuthData = await getAuthUser(token!);
//       new CurrentToken().set({
//         token: token!,
//         expiry_date: userAuthData?.authorizeUser.exp!,
//       });
//       console.log(userAuthData);

//       return filterMetaMaskUserAuthData({
//         authData: userAuthData?.authorizeUser!,
//       });
//     } catch (error) {
//       throw JSON.stringify(error)
//     }
//   }
// );

type signedInMetaMaskUserProps = {
  address: string;
  web3: any;
  callback?: (err?: any, res?: { userData: any }) => void;
};


export const signedInMetaMask = createAsyncThunk(
  'signIn/MetaMask',
  async ({ address, web3 }: signedInMetaMaskUserProps, thunkAPI) => {
    try {
      if (!web3) {
        throw new Error("No signer Found");
      }
      // console.log("= Create Wallet Triggered =", "address :::::::::", address, ":::::::: web3 :::::::");
      // const userAddress = await signer!.getAddress();

      const nonce: string = await signUpFlow(address);
      if (!nonce) {
        throw new Error("No Nonce Found");
      }
      const message = `My App Auth Service Signing nonce: ${nonce}`;
      const signature = await web3
        .getSigner(address)
        .signMessage(`My App Auth Service Signing nonce: ${nonce}`);

      // let signature = await signer!.signMessage(message);
      // console.log("::::::::::::::::nonce has been found::::::::::::");

      const token = await login(address, signature);
      // console.log("login api has been running :::::")
      new CurrentToken().set({ token: token.accessToken });

      const user = getUserClient();

      return user
      // if (!user?.email) {
      //     router.push("/onboarding")
      // }
      // dispatch({
      //     type: "setUser",
      //     payload: { address: userAddress, error: undefined, loading: false },
      // });
    } catch (e: any) {
      console.log("signedInMetaMask error ", e);
      throw JSON.stringify(e)
      // dispatch({ type: "setUser", payload: { error: e.message, loading: false } });
    }
  }
)

type signedOutProps = { callback?: (err?: any, res?: string) => void };

export const signOut = createAsyncThunk(
  'logout',
  async (_, thunkAPI) => {
    try {
      return await logout();
    } catch (error) {
      throw JSON.stringify(error);
    }
  }
);
