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
import { userOrm } from "./user";
import { walletOrm } from "./wallet";

export const cryptoAddressOrm = pgTable(
    "crypto_address_orm",
    {
        id: serial('id').primaryKey().notNull(),
        address: text("address"),
        user_id: integer("user_id").references(() => userOrm.id),
        wallet_id: integer("wallet_id").references(() => walletOrm.id),
        created_at: timestamp("created_at").defaultNow(),
        updated_at: timestamp("updated_at").defaultNow(),
    },
    (crypto_address_orm) => {
        return {
            "FK_crypto_address.user_id": foreignKey({
                columns: [crypto_address_orm.user_id],
                foreignColumns: [userOrm.id],
            }),
            "FK_crypto_address.wallet_id": foreignKey({
                columns: [crypto_address_orm.wallet_id],
                foreignColumns: [walletOrm.id],
            }),
            addressIdx: uniqueIndex("addressIdx").on(crypto_address_orm.address),
        };
    },
);

export type CryptoAddress = InferModel<typeof cryptoAddressOrm>;
export type NewCryptoAddress = InferModel<typeof cryptoAddressOrm, "insert">;


// npm run generate