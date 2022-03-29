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
        minPoolSize: number,
        port: number
    ) {
        this.host = host
        this.userName = userName
        this.password = password
        this.minPoolSize = minPoolSize
        this.port = port
        this.pool = new Pool({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'admin',
            database: 'postgres',
        });
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


    async fetchAll<R>(query: string, rowMapper: RowMapper<R>): Promise<R[]> {
        const result = await this.pool.query(query)
        const mapResult =  await result.rows.map((row: any) => {
            return rowMapper.mapRow(row)
        })
        this.pool.end()
        return mapResult
        
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