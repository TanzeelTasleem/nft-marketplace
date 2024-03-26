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

export const walletOrm = pgTable(
    "wallt_orm",
    {
        id: serial('id').primaryKey().notNull(),
        type: text("type"),
        created_at: timestamp("created_at").defaultNow(),
        updated_at: timestamp("updated_at").defaultNow(),
    }
);

export type Wallet = InferModel<typeof walletOrm>;
export type NewWallet = InferModel<typeof walletOrm, "insert">;


// npm run generate