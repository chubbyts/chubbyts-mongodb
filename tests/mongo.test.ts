import { Collection, CreateIndexesOptions, Db, IndexSpecification, MongoClient, MongoServerError } from 'mongodb';
import { IndexesByCollection, upsertIndexes } from '../src/mongo';

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

    const createIndex = jest.fn(
      async (givenIndexSpec: IndexSpecification, givenOptions: CreateIndexesOptions): Promise<string> => {
        const { key, ...options } = indexes.pet[0];

        expect(givenIndexSpec).toEqual(key);
        expect(givenOptions).toEqual(options);

        return givenOptions.name as string;
      },
    );

    const collection = jest.fn((collectionName: string): Collection => {
      expect(collectionName).toBe('pet');

      return { createIndex } as unknown as Collection;
    });

    const db = jest.fn(() => ({ collection } as unknown as Db));

    const mongoClient: MongoClient = { db } as unknown as MongoClient;

    await upsertIndexes(mongoClient, {
      pet: [
        {
          key: { id: 1 },
          name: 'pet.id',
          unique: true,
        },
      ],
    });

    expect(createIndex).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(db).toHaveBeenCalledTimes(1);
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

    let counter = 0;

    const createIndex = jest.fn(
      async (givenIndexSpec: IndexSpecification, givenOptions: CreateIndexesOptions): Promise<string> => {
        const { key, ...options } = indexes.pet[0];

        expect(givenIndexSpec).toEqual(key);
        expect(givenOptions).toEqual(options);

        counter++;

        if (counter === 1) {
          const error = new MongoServerError({ message: 'index already exists' });
          error.codeName = 'IndexOptionsConflict';

          throw error;
        }

        return givenOptions.name as string;
      },
    );

    const dropIndex = jest.fn(async (givenIndexName: string): Promise<void> => {
      const { name } = indexes.pet[0];

      expect(givenIndexName).toEqual(name);
    });

    const collection = jest.fn((collectionName: string): Collection => {
      expect(collectionName).toBe('pet');

      return { createIndex, dropIndex } as unknown as Collection;
    });

    const db = jest.fn(() => ({ collection } as unknown as Db));

    const mongoClient: MongoClient = { db } as unknown as MongoClient;

    await upsertIndexes(mongoClient, {
      pet: [
        {
          key: { id: 1 },
          name: 'pet.id',
          unique: true,
        },
      ],
    });

    expect(createIndex).toHaveBeenCalledTimes(2);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(db).toHaveBeenCalledTimes(1);
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

    const createIndex = jest.fn(
      async (givenIndexSpec: IndexSpecification, givenOptions: CreateIndexesOptions): Promise<string> => {
        const { key, ...options } = indexes.pet[0];

        expect(givenIndexSpec).toEqual(key);
        expect(givenOptions).toEqual(options);

        throw new Error('unknown error');
      },
    );

    const collection = jest.fn((collectionName: string): Collection => {
      expect(collectionName).toBe('pet');

      return { createIndex } as unknown as Collection;
    });

    const db = jest.fn(() => ({ collection } as unknown as Db));

    const mongoClient: MongoClient = { db } as unknown as MongoClient;

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
      fail('Expect error');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`[Error: unknown error]`);
    }

    expect(createIndex).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(db).toHaveBeenCalledTimes(1);
  });
});
