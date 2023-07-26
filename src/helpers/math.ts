import { Decimal } from "@prisma/client/runtime/library";

export const round2 = (value: Decimal | number) => {
  return Number(value.toFixed(2));
};
