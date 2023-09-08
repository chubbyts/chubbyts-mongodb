# chubbyts-mongodb

[![CI](https://github.com/chubbyts/chubbyts-mongodb/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyts/chubbyts-mongodb/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/chubbyts/chubbyts-mongodb/badge.svg?branch=master)](https://coveralls.io/github/chubbyts/chubbyts-mongodb?branch=master)
[![Infection MSI](https://badge.stryker-mutator.io/github.com/chubbyts/chubbyts-mongodb/master)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyts/chubbyts-mongodb/master)
[![npm-version](https://img.shields.io/npm/v/@chubbyts/chubbyts-mongodb.svg)](https://www.npmjs.com/package/@chubbyts/chubbyts-mongodb)

[![bugs](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-mongodb&metric=bugs)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-mongodb)
[![code_smells](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-mongodb&metric=code_smells)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-mongodb)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-mongodb&metric=coverage)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-mongodb)
[![duplicated_lines_density](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-mongodb&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-mongodb)
[![ncloc](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-mongodb&metric=ncloc)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-mongodb)
[![sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-mongodb&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-mongodb)
[![alert_status](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-mongodb&metric=alert_status)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-mongodb)
[![reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-mongodb&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-mongodb)
[![security_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-mongodb&metric=security_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-mongodb)
[![sqale_index](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-mongodb&metric=sqale_index)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-mongodb)
[![vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-mongodb&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-mongodb)

## Description

Mongodb helper(s).

## Requirements

 * node: 16
 * [mongodb][2]: ^6.0.0

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyts/chubbyts-mongodb][1].

```ts
npm i @chubbyts/chubbyts-mongodb@^1.4.0
```

## Usage

### upsertIndexes

```ts
const mongoClient = await MongoClient.connect('mongodb://localhost');
await upsertIndexes(mongoClient, {
  pet: [
    {
      key: { id: 1 },
      name: 'pet.id',
      unique: true,
    },
    {
      key: { name: 1 },
      name: 'pet.name',
    },
  ]
});
```

## Copyright

2023 Dominik Zogg

[1]: https://www.npmjs.com/package/@chubbyts/chubbyts-mongodb
[2]: https://www.npmjs.com/package/mongodb
