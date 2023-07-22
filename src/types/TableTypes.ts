export type TableType = {
    id: string
    name: string
    active: number
    accounts: TableAccountType[]
};

export type TableCardType = {
    id: string
    name: string
    active: number
};

export type TableAccountType = {
    id: string
    name: string
    owner: string
}
