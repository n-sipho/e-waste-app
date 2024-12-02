import { Knex } from "knex";

const config: Knex.Config = {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
        directory: "./db/migrations",
    },
};

export default config;