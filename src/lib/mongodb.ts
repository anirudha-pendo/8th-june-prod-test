import { MongoClient, type Db } from "mongodb";

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error("DATABASE_URL is not set");
}

type MongoGlobal = typeof globalThis & {
  mongoClient?: MongoClient;
  mongoClientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as MongoGlobal;

export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(uri);
export const mongoDb = mongoClient.db();

globalForMongo.mongoClient = mongoClient;

export function connectMongoClient() {
  globalForMongo.mongoClientPromise =
    globalForMongo.mongoClientPromise ??
    mongoClient.connect().catch((error) => {
      globalForMongo.mongoClientPromise = undefined;
      throw error;
    });

  return globalForMongo.mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  await connectMongoClient();
  return mongoDb;
}
