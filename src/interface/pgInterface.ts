import { Pair } from '../utils/utils';

export interface IDBClient {
    // fetch multiple rows
    fetchAll<R>(query: string, obj: R, parameters: any[]): Promise<R[]>
    fetchAllUsingField<R>(query: string, field: string, parameters: any[]): Promise<R[]>
    fetchAllUsingTwoFields<R, T>(query: string, field1: string, field2: string, parameters: any[]): Promise<Pair<R, T>[]>

    // fetch single row
    fetch<R>(query: string, obj: R, parameters: any[]): Promise<R>
}

