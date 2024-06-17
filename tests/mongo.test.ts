import type { Collection, CreateIndexesOptions, Db, IndexSpecification, MongoClient } from 'mongodb';
import { MongoServerError } from 'mongodb';
import { useObjectMock } from '@chubbyts/chubbyts-function-mock/dist/object-mock';
import { describe, test, expect } from 'vitest';
import type { IndexesByCollection } from '../src/mongo';
import { upsertIndexes } from '../src/mongo';

describe('upsertIndexes', () => {
  test('create', async () => {
    const indexes: IndexesByCollection = {
      pet: [
        {
          key: { id: 1 },
          name: 'pet.id',
          unique: true,
        },
      ],
    };

    const [collection, collectionMocks] = useObjectMock<Collection>([
      {
        name: 'createIndex',
        callback: async (givenIndexSpec: IndexSpecification, givenOptions: CreateIndexesOptions): Promise<string> => {
          const { key, ...options } = indexes.pet[0];

          expect(givenIndexSpec).toEqual(key);
          expect(givenOptions).toEqual(options);

          return givenOptions.name as string;
        },
      },
    ]);

    const [db, dbMocks] = useObjectMock<Db>([{ name: 'collection', parameters: ['pet'], return: collection }]);

    const [mongoClient, mongoClientMocks] = useObjectMock<MongoClient>([{ name: 'db', parameters: [], return: db }]);

    await upsertIndexes(mongoClient, {
      pet: [
        {
          key: { id: 1 },
          name: 'pet.id',
          unique: true,
        },
      ],
    });

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
  });

  test('update', async () => {
    const indexes: IndexesByCollection = {
      pet: [
        {
          key: { id: 1 },
          name: 'pet.id',
          unique: true,
        },
      ],
    };

    const [collection, collectionMocks] = useObjectMock<Collection>([
      {
        name: 'createIndex',
        callback: async (givenIndexSpec: IndexSpecification, givenOptions: CreateIndexesOptions): Promise<string> => {
          const { key, ...options } = indexes.pet[0];

          expect(givenIndexSpec).toEqual(key);
          expect(givenOptions).toEqual(options);

          const error = new MongoServerError({ message: 'index already exists' });

          // eslint-disable-next-line functional/immutable-data
          error.codeName = 'IndexOptionsConflict';

          throw error;
        },
      },
      {
        name: 'dropIndex',
        callback: async (givenIndexName: string): Promise<{ [key: string]: unknown }> => {
          const { name } = indexes.pet[0];

          expect(givenIndexName).toEqual(name);

          return {};
        },
      },
      {
        name: 'createIndex',
        callback: async (givenIndexSpec: IndexSpecification, givenOptions: CreateIndexesOptions): Promise<string> => {
          const { key, ...options } = indexes.pet[0];

          expect(givenIndexSpec).toEqual(key);
          expect(givenOptions).toEqual(options);

          return givenOptions.name as string;
        },
      },
    ]);

    const [db, dbMocks] = useObjectMock<Db>([{ name: 'collection', parameters: ['pet'], return: collection }]);

    const [mongoClient, mongoClientMocks] = useObjectMock<MongoClient>([{ name: 'db', parameters: [], return: db }]);

    await upsertIndexes(mongoClient, {
      pet: [
        {
          key: { id: 1 },
          name: 'pet.id',
          unique: true,
        },
      ],
    });

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
  });

  test('unknown error', async () => {
    const indexes: IndexesByCollection = {
      pet: [
        {
          key: { id: 1 },
          name: 'pet.id',
          unique: true,
        },
      ],
    };

    const [collection, collectionMocks] = useObjectMock<Collection>([
      {
        name: 'createIndex',
        callback: async (givenIndexSpec: IndexSpecification, givenOptions: CreateIndexesOptions): Promise<string> => {
          const { key, ...options } = indexes.pet[0];

          expect(givenIndexSpec).toEqual(key);
          expect(givenOptions).toEqual(options);

          throw new Error('unknown error');
        },
      },
    ]);

    const [db, dbMocks] = useObjectMock<Db>([{ name: 'collection', parameters: ['pet'], return: collection }]);

    const [mongoClient, mongoClientMocks] = useObjectMock<MongoClient>([{ name: 'db', parameters: [], return: db }]);

    try {
      await upsertIndexes(mongoClient, {
        pet: [
          {
            key: { id: 1 },
            name: 'pet.id',
            unique: true,
          },
        ],
      });
      throw new Error('Expect error');
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[Error: unknown error]');
    }

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
  });
});
