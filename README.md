# ts-db-client

[![npm version](https://img.shields.io/npm/v/ts-db-client.svg?style=flat-square)](https://www.npmjs.com/package/ts-db-client)
[![CDNJS](https://img.shields.io/cdnjs/v/ts-db-client.svg?style=flat-square)](https://cdnjs.com/libraries/ts-db-client)
[![install size](https://packagephobia.now.sh/badge?p=ts-db-client)](https://packagephobia.now.sh/result?p=ts-db-client)
[![npm downloads](https://img.shields.io/npm/dm/ts-db-client.svg?style=flat-square)](http://npm-stat.com/charts.html?package=ts-db-client)

Simple Wrapper Library over DB clients. Currently Supports PostgreSQL, MYSQL(WIP). Other DBMS support coming soon.

## Installing

Using npm:

```bash
$ npm install ts-db-client
```

## Example


```js
import { PGClient } from 'ts-db-client'
```

Default test DB Config

```js
import { PGClient } from 'ts-db-client'

// initialize a default PG DB client
    /**
     * host:      "localhost"
     * userName:  "postgres"
     * password:  "admin"
     * port:       5432
     * database:  "postgres"
    **/
const pgClient = PGClient.defaultConfig()


// Create a User DTO to map users table columns 
// (if not mapped than default values will be used)
class User {
    id: number = 0
    handle: string = ""
}

// fetch<T> return single row
pgClient.fetch<User>('SELECT * FROM users WHERE id = $1', new User(), [2])
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.error(err)
})
```

Fetch multiple Rows from DB(map Rows to a DTO)

```js

// Create a DTO for Data mapping
class User {
    id: number = 0
    handle: string = ""
}

// fetchAll will return multiple rows
// The data will be mapped to User DTO as User[]
pgClient.fetchAll<User>('SELECT * FROM users', new User())
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.error(err)
})

```

Fetch All Using 1 fieldName
> **NOTE:** If you want to return multiple rows only one row name, then we can use this method
> You donot need to create a DTO

```js

// Create a DTO for Data mapping
class User {
    id: number = 0
    handle: string = ""
}

// fetchAllUsingField will return multiple fields
// but we can query using a fieldName.
// Below we are returning data using 'handle'
pgClient.fetchAllUsingField<string>('select handle from users', "handle")
    .then((res: number[]) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
})

```

Fetch All Using 2 fieldName
> **NOTE:** If you want to return multiple rows using only two row fieldName, then we can use this method
> You donot need to create a DTO

```js

// Create a DTO for Data mapping
class User {
    id: number = 0
    handle: string = ""
}

// fetchAll will return multiple rows
// The data will be mapped to User DTO as User[]
pgClient.fetchAllUsingTwoFields<number, string>('select id, handle from users', "id", "handle")
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
})

```

