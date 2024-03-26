import { dbClient } from "../../client";
import { NextResponse } from "next/server";
import { sign as jwtSign } from "jsonwebtoken";
import { errorCodes } from "../../errorCodes";
import { v4 as uuidv4 } from "uuid";
import { ethers } from "ethers";
import { verifyMessage } from "@ambire/signature-validator";
import { db } from "../../drizzle";
import { userOrm } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { cryptoAddressOrm } from "@/db/schema/crypto_address";

interface Req {
    publicAddress: string;
    signature: string;
}

export async function POST(request: Request) {
    const req = await request.json();

    let { publicAddress, signature }: Req = req;
    publicAddress = publicAddress.toLowerCase();

    const userData = (
        await db
            .select({ user: userOrm, cryptoAddress: cryptoAddressOrm })
            .from(userOrm)
            .innerJoin(cryptoAddressOrm, eq(cryptoAddressOrm.user_id, userOrm.id))
            .where(eq(userOrm.publicAddress, publicAddress))
    )[0];

    const { user, cryptoAddress } = userData;

    if (!user) {
        return new Response("User Not Already Exists! Please SignIn", {
            status: errorCodes.notFound,
        });
    }

    const message = `My App Auth Service Signing nonce: ${user.nonce}`;
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");

    const isValidSig = await verifyMessage({
        signer: publicAddress,
        message,
        signature: signature,
        // this is needed so that smart contract signatures can be verified
        provider,
    });

    if (!isValidSig) {
        return new Response("Signnature is incorrect", {
            status: 401,
        });
    }

    const secretText = uuidv4();

    await db.update(userOrm).set({ nonce: Math.floor(Math.random() * 10000).toString() , secretText}).where(eq(userOrm.publicAddress, publicAddress));

    let payload = {
        publicAddress: publicAddress,
        display_name: user.display_name,
        emailVerified: user.emailVerified,
        id: user.id,
        email: user.email,
        profile_image: user.profile_image,
        cover_image: user.cover_image,
        creation_date: user.created_at,
    };

    const accessToken = jwtSign(
        {
            payload: payload,
        },
        secretText,
        {
            expiresIn: "24h", // expires in 24 hours
        },
    );

    const response = NextResponse.json({ accessToken });
    response.cookies.set({
        name: "accessToken",
        value: accessToken,
        httpOnly: true,
    });

    return response;
}
