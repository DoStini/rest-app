import { Decimal } from "@prisma/client/runtime/library";

export type DayType = {
  id: number;
  name: string;
  total: number | Decimal;
  closed: boolean;
  closedAt: Date | null;
  createdAt: Date;
};
