import postgres from "postgres";

const pg = postgres(process.env.PRIMARY_DATABASE_URL!); // will use psql environment variables

export default pg;
