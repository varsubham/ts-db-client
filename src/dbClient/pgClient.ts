import { Pool } from 'pg';
import { IDBClient } from '../interface/pgInterface';
import { RowMapper } from '../utils';
import { Pair } from '../utils/utils';

export class PGClient implements IDBClient {
    private host: string;
    private userName: string;
    private password: string;
    private minPoolSize: number;
    private port: number;

    private pool: Pool

    // fix: dont use default values
    constructor(
        host: string,
        userName: string,
        password: string,
        port: number,
        database: string
    ) {
        this.host = host
        this.userName = userName
        this.password = password
        this.minPoolSize = minPoolSize
        this.port = port
        this.pool = new Pool({
            host: host,
            port: port,
            user: userName,
            password: password,
            database: database,
        });
    }
    static defaultConfig(): PGClient {
        return new PGClient(
            'localhost',
            'postgres',
            'admin',
            5432,
            'postgres'
        )
    }
    private mapData<R>(classObj: R, row: any): R {
        const classProperties = Object.getOwnPropertyNames(classObj)
        const rowProperties = Object.getOwnPropertyNames(row)
        // map row property to classObject
        for (const rowProperty of rowProperties) {
            const mappedClassProperty = classProperties.find((property: string) => {
                return property == rowProperty
            })
            if (mappedClassProperty != undefined) {
                classObj[mappedClassProperty as keyof R] = row[rowProperty]
            }
        }
        return classObj
    }
    async fetchAllUsingTwoFields<R, T>(query: string, field1: string, field2: string): Promise<Pair<R, T>[]> {
        const result = await this.pool.query(query)
        const mapResult = await result.rows.map((row: any) => {
            const keyPair: Pair<R, T> = {key: row[field1], value: row[field2]}
            return keyPair
        })
        this.pool.end()
        return mapResult
    }

    async fetchAll<R>(query: string, obj: R): Promise<R[]> {
        const result = await this.pool.query(query)
        const mapResult = await result.rows.map((row) => {         
            let newObj = {...obj}
            return this.mapData(newObj, row)

        })
        this.pool.end()
        return mapResult
        
    }

    async fetch<R>(query: string, obj: R): Promise<R> {
        return this.fetchAll<R>(query, obj)
            .then((res: R[]) => {
                if (res.length == 0) {
                    return obj
                } else {
                    return res[0]
                }
            })
            .catch((err) => {
                console.log(err)
                return obj
            })
    }
    
    async fetchAllUsingField<R>(query: string, field: string): Promise<R[]> {
        const result = await this.pool.query(query)
        const mapResult = await result.rows.map((map: any) => {
            return map[field] as R
        })
        this.pool.end()
        return mapResult
    }

}