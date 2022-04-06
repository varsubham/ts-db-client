import { Pair } from '../utils/utils';
import { RowMapper } from '../utils';

export interface IDBClient {
    // fetch multiple rows
    fetchAll<R>(query: string, obj: R): Promise<R[]>
    fetchAllUsingField<R>(query: string, field: string): Promise<R[]>
    fetchAllUsingTwoFields<R, T>(query: string, field1: string, field2: string): Promise<Pair<R, T>[]>

    // fetch single row
    fetch<R>(query: string, obj: R): Promise<R>
}

