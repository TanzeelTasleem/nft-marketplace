import { db } from "@/app/api/drizzle";
import { dbClient } from "../../../client";
import { NextResponse } from "next/server";
import { userOrm } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { cryptoAddressOrm } from "@/db/schema/crypto_address";

interface ParamsType {
    address: string;
}

export async function GET(request: Request, { params }: { params: ParamsType }) {
    let address = params.address;
    address = address.toLowerCase();

    const userExists = await db
        .select({
            publicAddress: userOrm.publicAddress,
            nonce: userOrm.nonce,
            id: userOrm.id,
        })
        .from(userOrm)
        .innerJoin(cryptoAddressOrm, eq(cryptoAddressOrm.user_id, userOrm.id))
        .where(eq(userOrm.publicAddress, address));

    if (userExists.length !== 1) {
        return new Response("User with this public Address not found!", {
            status: 401,
        });
    }

    return NextResponse.json(userExists[0]);
}
