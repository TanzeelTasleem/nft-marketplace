import { dbClient } from "../../client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../drizzle";
import { eq } from "drizzle-orm";
import { userOrm } from "@/db/schema/user";
import { cryptoAddressOrm } from "@/db/schema/crypto_address";
import { walletOrm } from "@/db/schema/wallet";

export async function POST(request: Request) {
    const req = await request.json();

    let { publicAddress }: { publicAddress: string } = req;
    publicAddress = publicAddress.toLowerCase();

    const userExists = await db
        .select({
        publicAddress: userOrm.publicAddress,
        })
        .from(userOrm)
        .where(eq(userOrm.publicAddress, publicAddress));

    if (userExists.length === 1) {
        return NextResponse.json(
        {
            success: false,
            message: "User Already Exists!",
        },
        {
            status: 401,
        }
        );
    }

    const nonce = Math.floor(Math.random() * 10000).toString();
    const secretText = uuidv4();

    let user = (
        await db
        .insert(userOrm)
        .values({nonce, publicAddress, secretText})
        .returning({
            id: userOrm.id,
            nonce: userOrm.nonce,
            publicAddress: userOrm.publicAddress,
        })
    )[0];

    let cryptoAddress = (
        await db
        .insert(cryptoAddressOrm)
        .values({ address: publicAddress, user_id: user.id })
        .returning({ id: cryptoAddressOrm.id })
    )[0];

    return NextResponse.json({ user });
}
