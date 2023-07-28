import { Decimal } from "@prisma/client/runtime/library";

export type DayType = {
  id: number;
  name: string;
  total: Decimal;
  closed: boolean;
};
