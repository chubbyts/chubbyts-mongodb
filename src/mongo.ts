import { CreateIndexesOptions, IndexSpecification, MongoClient, MongoServerError } from 'mongodb';

export type IndexesByCollection = {
  [collectionName: string]: Array<CreateIndexesOptions & { key: IndexSpecification; name: string }>;
};

export const upsertIndexes = async (
  mongoClient: MongoClient,
  indexesByCollection: IndexesByCollection,
): Promise<void> => {
  await Promise.all(
    Object.entries(indexesByCollection).map(async ([collectionName, indexes]): Promise<void> => {
      const collection = mongoClient.db().collection(collectionName);

      await Promise.all(
        indexes.map(async ({ key, ...options }) => {
          try {
            await collection.createIndex(key, options);
          } catch (e) {
            if ((e as MongoServerError).codeName === 'IndexOptionsConflict') {
              await collection.dropIndex(options.name);
              await collection.createIndex(key, options);
            } else {
              throw e;
            }
          }
        }),
      );
    }),
  );
};
