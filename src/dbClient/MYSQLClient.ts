import * as mysql from "mysql2";
import { Pool } from "mysql2";
import { RowDataPacket } from "mysql2";
import { IDBClient } from "../interface/pgInterface";
import { Pair } from "../utils";
import { QueryResult } from "pg";

export class MYSQLClient implements IDBClient {
  private pool: Pool;

  constructor(
    host: string,
    userName: string,
    datbase: string,
    password: string | undefined = undefined,
    port: number = 3306,
    waitForConnections: boolean = true,
    connectionLimit: number = 10,
    queueLimit: number = 0,
    rejectUnauthorized: boolean = true
  ) {
    this.pool = mysql.createPool({
      host: host,
      user: userName,
      password: password,
      database: datbase,
      port: port,
      waitForConnections: waitForConnections,
      connectionLimit: connectionLimit,
      queueLimit: queueLimit,
      ssl: {
        rejectUnauthorized: rejectUnauthorized,
      },
    });
  }
  updateRow(query: string, parameters: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pool.execute(query, parameters, (error, result) => {
        if (error) {
          console.error(error);
          return reject([]);
        }
        // this.pool.end();
        return resolve(result);
      });
    });
  }

  static defaultConfig(): MYSQLClient {
    return new MYSQLClient("localhost", "root", "Shubham", "password");
  }

  private mapData<R>(classObj: R, row: RowDataPacket): R {
    const classProperties = Object.getOwnPropertyNames(classObj);
    const rowProperties = Object.getOwnPropertyNames(row);
    // map row property to classObject
    for (const rowProperty of rowProperties) {
      const mappedClassProperty = classProperties.find((property: string) => {
        return property == rowProperty;
      });
      if (mappedClassProperty != undefined) {
        classObj[mappedClassProperty as keyof R] = row[rowProperty];
      }
    }
    return classObj;
  }

  fetchAll<R>(
    query: string,
    obj: R,
    parameters: any[] = new Array<any>()
  ): Promise<R[]> {
    return new Promise((resolve, reject) => {
      this.pool.execute(query, parameters, (error, result) => {
        if (error) {
          console.error(error);
          return reject([]);
        }
        const queryRows = <RowDataPacket[]>result;
        const mapResult = queryRows.map((row: RowDataPacket) => {
          const newObj = { ...obj };
          return this.mapData(newObj, row);
        });
        // this.pool.end();
        return resolve(mapResult);
      });
    });
  }

  fetchAllUsingField<R>(
    query: string,
    field: string,
    parameters: any[] = new Array<any>()
  ): Promise<R[]> {
    return new Promise((resolve, reject) => {
      this.pool.execute(query, parameters, (error, result) => {
        if (error) {
          console.error(error);
          return reject([]);
        }
        const queryRows = <RowDataPacket[]>result;
        const mapResult = queryRows.map((row: RowDataPacket) => {
          return row[field] as R;
        });
        // this.pool.end();
        return resolve(mapResult);
      });
    });
  }

  fetchAllUsingTwoFields<R, T>(
    query: string,
    field1: string,
    field2: string,
    parameters: any[] = new Array<any>()
  ): Promise<Pair<R, T>[]> {
    return new Promise((resolve, reject) => {
      this.pool.execute(query, parameters, (error, result) => {
        if (error) {
          console.error(error);
          return reject([]);
        }
        const queryRows = <RowDataPacket[]>result;
        const mapResult = queryRows.map((row: RowDataPacket) => {
          const keyPair: Pair<R, T> = { key: row[field1], value: row[field2] };
          return keyPair;
        });
        // this.pool.end();
        return resolve(mapResult);
      });
    });
  }

  fetch<R>(
    query: string,
    obj: R,
    parameters: any[] = new Array<any>()
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      this.fetchAll<R>(query, obj, parameters)
        .then((res: R[]) => {
          if (res.length == 0) {
            return resolve(obj);
          } else {
            return resolve(res[0]);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(obj);
        });
    });
  }
}
