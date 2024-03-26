import {
    pgTable,
    serial,
    text,
    foreignKey,
    timestamp,
    AnyPgColumn,
    integer,    boolean,
    uniqueIndex
} from "drizzle-orm/pg-core";
import { InferModel, desc, relations } from "drizzle-orm";
import { cryptoAddressOrm } from "./crypto_address";

export const userOrm = pgTable(
    "user_orm",
    {
        id: serial('id').primaryKey().notNull(),
        display_name: text("display_name"),
        username: text("username"),
        email: text("email"),
        secretText: text("secretText"),
        profile_image: text("profile_image"),
        cover_image: text("cover_image"),
        bio: text("bio"),
        emailVerified: boolean("emailVerified"),
        nonce: text("nonce"),
        publicAddress: text("publicAddress"),
        created_at: timestamp("created_at").defaultNow(),
        updated_at: timestamp("updated_at").defaultNow(),
    },
    (userOrm) => {
        return {
            emailIdx: uniqueIndex("emailIdx").on(userOrm.email),
            secretTextIdx: uniqueIndex("secretTextIdx").on(userOrm.secretText),
            nonceIdx: uniqueIndex("nonceIdx").on(userOrm.nonce),
            publicAddressIdx: uniqueIndex("publicAddressIdx").on(userOrm.publicAddress),
        };
    },
);

export const userDaoRelation = relations(userOrm, ({ many }) => ({
	userToAddresses: many(cryptoAddressOrm),
}));

export type User = InferModel<typeof userOrm>;
export type NewUser = InferModel<typeof userOrm, "insert">;


// npm run generate