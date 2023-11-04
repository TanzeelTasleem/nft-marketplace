// import { Web3Auth } from "@web3auth/modal";

import { getAbsoluteUrl } from "@/utils/helpers";

const absoluteUrl = getAbsoluteUrl();

export const fetchUser = async (address: string) => {
  const res = await fetch(`${absoluteUrl}/api/auth/get-user-nonce/${address}`, {
    cache: "no-cache",
  });
  return res.json();
};

export const signUp = async (address: string) => {
  const newUser = await fetch(`${absoluteUrl}/api/auth/signup`, {
    method: "post",
    body: JSON.stringify({ publicAddress: address }),
  });
  return newUser.json();
};

export const signUpFlow = async (address: string) => {
  let nonce: string;
  try {
    const user = await fetchUser(address);
    nonce = user.nonce;
  }
  catch (err) {
    console.log("err ", err)
    const newUser = await signUp(address);
    nonce = newUser.user.nonce;
  }
  return nonce;
};

export const login = async (address: string, signature: string) => {
  const newUser = await fetch(`${absoluteUrl}/api/auth/login`, {
    method: "post",
    body: JSON.stringify({ publicAddress: address, signature }),
  });
  return newUser.json();
};

export const logout = async () => {
  const res = await fetch(`${absoluteUrl}/api/auth/logout`, {
    cache: "no-cache",
  });
  return res.json();
};

