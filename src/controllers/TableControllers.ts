import { TableCardType, TableType } from "@/types/TableTypes";

export class TableController {

  static _tables: TableType[] = [
    { id: "1", name: "Mesa 1", active: 2, accounts: [{id: "1", name:"José", value: 200}, {id: "2", name:"Pedro", value: 17.50}, ] },
    { id: "2", name: "Mesa 2", active: 3, accounts: [] },
    { id: "3", name: "Mesa 3", active: 2, accounts: [] },
  ];

  constructor() {}

  static async findActiveTables() {
    await Promise.resolve();
    return TableController._tables;
  }

  static async findTableById(id: string) {
    await Promise.resolve();
    return TableController._tables.find(table => table.id === id);
  }
}
