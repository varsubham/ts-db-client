export interface Pair<T, U> {
    key: T,
    value: U
}

export interface RowMapper<T> {
    mapRow(rows: any): T
}