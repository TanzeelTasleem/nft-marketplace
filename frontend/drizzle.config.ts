import type { Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema/*",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        // connectionString: "postgresql://nft_marketplace_owner:mGoKYEi9gU1p@ep-calm-bar-a52vh0d8.us-east-2.aws.neon.tech/nft_marketplace?sslmode=require",
        host: 'ep-calm-bar-a52vh0d8.us-east-2.aws.neon.tech',
        database: 'nft_marketplace',
        user: 'nft_marketplace_owner',
        password: 'mGoKYEi9gU1p',
        ssl: true
    },
} satisfies Config;
