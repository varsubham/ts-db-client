# ts-db-client

## Installing

Using npm:

```bash
$ npm install ts-db-client
```

## Example


```js
import { PGClient } from 'ts-db-client'
```

## Default test DB Config

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