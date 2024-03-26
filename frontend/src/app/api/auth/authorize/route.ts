import { NextResponse } from "next/server";
import { decode, verify } from "jsonwebtoken";
import { userOrm } from "@/db/schema/user";
import { db } from "../../drizzle";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    const req = await request.json();

    let { accessToken }: { accessToken: string } = req;

    const decodedToken: any = decode(accessToken);
    if (!decodedToken) {
        return new Response("Decoded Token", {
            status: 401,
        });
    }

    const userSecretText = (
        await db
            .select({
                secretText: userOrm.secretText,
            })
            .from(userOrm)
            .where(eq(userOrm.publicAddress, decodedToken.payload.publicAddress))
    )[0];

    if (!userSecretText || !userSecretText.secretText) {
        return new Response("User with this public Address not found!", {
            status: 401,
        });
    }

    try {
        var verifiedJwt: any = verify(accessToken, userSecretText.secretText);
        return NextResponse.json({ verifiedJwt });
    } catch (err) {
        const response = new NextResponse(
            JSON.stringify({ success: false, message: "auth failed" }),
            { status: 401, headers: { "content-type": "application/json" } },
        );
        response.cookies.delete("accessToken");
        return response;
    }
}
