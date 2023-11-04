import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '../../store';
// import { navigate } from "gatsby-link";
import { signedInMetaMask, signedInweb3Auth, signOut, updateCurrentAuthUser } from './asyncThunks';
import { CurrentToken } from '@/utils';
// import { User } from '@/db/schema/user';
// import { CurrentToken } from '@/utils/localStorage';
import jwt from 'jsonwebtoken'
// import { AlchemyProvider } from '@alchemy/aa-alchemy';
// import { Web3Auth } from '@web3auth/modal';
// import { LightSmartContractAccount } from '@alchemy/aa-accounts';
// import { HttpTransport } from 'viem';
// import { type SmartAccountSigner } from '@alchemy/aa-core';

export type AuthState = 'SIGNED_IN' | 'SIGNED_OUT' | 'PENDING';

type StateType = {
  authState: AuthState | null;
  address:string | null
  userData: any | undefined;
  isLoading: boolean;
};

const defaultUnset: any = null;

const initialState: StateType = {
  authState: null,
  address:null,
  userData: undefined,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAddress: (state , action: PayloadAction<string>) => {state.address = action.payload},
    clearAllState: (state) => initialState,
    updateUserDataOnTokenUpdate: (state) => {
      state.isLoading = true;
      const { token } = new CurrentToken().get();
      // console.log("updateUserDataOnTokenUpdate :::" , token)
      if (!token) { return }
      const userData = jwt.decode(token) as { payload: any }
      console.log("User Data on updateUserDataOnTokenUpdate ::::::::", userData)
      if (userData.payload && state.userData) {
        state.userData = userData.payload
      }
      state.isLoading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => { state.isLoading = action.payload }
    // signOut: (state) => {
    //   new CurrentToken().remove();
    //   return {
    //     ...initialState,
    //     authState: "SIGNED_OUT"
    //   }
    // }
  },
  extraReducers: (builder) => {

    builder.addCase(signedInweb3Auth.fulfilled, (state, { payload, meta }) => {
      if (!payload) {
        return;
      }
      console.log("signedInMetaMask.fulfilled", state.authState)
      // console.log(new CurrentToken().get().token);
      meta.arg.callback && meta.arg.callback(null, { userData: payload });
      return {
        ...state,
        authState: 'SIGNED_IN',
        userData: payload,
        isLoading: false
      }

    });

    builder.addCase(signedInweb3Auth.pending, (state, { meta: { arg } }) => {
      // if (arg?.authStatePending === true) {
      state.authState = 'PENDING';
      state.isLoading = true;
      // }
    }
    );


    builder.addCase(signedInweb3Auth.rejected, (state, { error, meta }) => {
      // state.authState = initialState.authState;
      // state.isLoading = false;
      // state.userData = undefined
      // state.alchemyProvider = defaultUnset
      // state.isLoading = false;
      console.log("signedInweb3Auth===>", error);
      // state.signInError = error.message
      meta.arg.callback && meta.arg.callback(error);
      return {
        ...initialState
      }
      // console.log(new CurrentToken().get().token);
      // meta.arg.callback && meta.arg.callback(null, { userData: payload });
    });

    builder.addCase(signedInMetaMask.fulfilled, (state, { payload, meta }) => {
      if (!payload) {
        return;
      }
      state.authState = 'SIGNED_IN';
      state.userData = payload;
      state.isLoading = false;
      console.log("signedInMetaMask.fulfilled", state.authState)
      // console.log(new CurrentToken().get().token);
      meta.arg.callback && meta.arg.callback(null, { userData: payload });
    });
    builder.addCase(signedInMetaMask.pending, (state, { payload, meta }) => {
      state.authState = "PENDING";
      state.isLoading = true
      // if (!payload) {
      //   return;
      // }
      // state.authState = 'SIGNED_IN';
      // state.userData = payload;
      // state.isLoading = false;
      // console.log("signedInMetaMask.fulfilled", state.authState)
      // // console.log(new CurrentToken().get().token);
      // meta.arg.callback && meta.arg.callback(null, { userData: payload });
    });
    builder.addCase(signedInMetaMask.rejected, (state, { error, meta }) => {
      error = JSON.parse(error.message || "{}")
      state.authState = 'SIGNED_OUT';
      state.isLoading = false;
      state.userData = undefined
      // state.isLoading = false;
      console.log("signedInMetaMask_Error===>", error);
      // state.signInError = error.message
      meta.arg.callback && meta.arg.callback(error);
      // state.authData = null;
    });

    builder.addCase(updateCurrentAuthUser.fulfilled, (state, { payload, meta: { arg } }) => {
      if (!payload) {
        return;
      }
      state.authState = 'SIGNED_IN';
      state.userData = payload;
      state.isLoading = false;
      // console.log(new CurrentToken().get().token);
      arg?.callback && arg.callback(null, { userData: payload })
    });
    builder.addCase(updateCurrentAuthUser.pending, (state, { meta: { arg } }) => {
      if (arg?.authStatePending === true) {
        state.authState = 'PENDING';
        state.isLoading = true;
      }
    }
    );
    builder.addCase(updateCurrentAuthUser.rejected, (state, { meta: { arg }, error }) => {
      // state.authState = 'SIGNED_OUT';
      // state.userData = undefined;
      new CurrentToken().remove();
      arg?.callback && arg.callback(error);
      console.log("updateCurrentAuthUser_Error", error);
      return {
        ...initialState,
        authState: 'SIGNED_OUT',
        isLoading: false
      };
    });

    builder.addCase(signOut.fulfilled, (state, { payload, meta: { arg } }) => {
      if (!payload.data) {
        return;
      }
      new CurrentToken().remove();
      // arg?.callback && arg.callback(null, payload.data.logout);
      return {
        ...initialState,
        authState: 'SIGNED_OUT',
        isLoading: false
      };
    });
    builder.addCase(signOut.pending, (state, { meta: { arg } }) => {
      state.authState = 'PENDING';
      state.isLoading = true;
    });
    builder.addCase(signOut.rejected, (state, { error, meta: { arg } }) => {
      const err = JSON.parse(error.message || '{}');
      state.authState = 'SIGNED_IN';
      state.isLoading = false;
      console.log(`signOut_Error`, err);
      // arg?.callback && arg.callback(err);
    });
  },
});

// export const getAuthState = () =>
//   useAppSelector((state) => state.auth.authState);

export const { clearAllState, updateUserDataOnTokenUpdate, setAuthLoading , setAddress } = authSlice.actions;
export { signedInMetaMask, updateCurrentAuthUser, signOut, signedInweb3Auth };

export default authSlice.reducer;