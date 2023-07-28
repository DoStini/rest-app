import { Decimal } from "@prisma/client/runtime/library";

export const round2 = (value: Decimal | number) => {
  return Number(value.toFixed(2));
};

export const mulTwoDecimals = (a: Decimal | number, b: Decimal | number) => {
  return round2(round2(a) * round2(b));
};

export const sumTwoDecimals = (a: Decimal | number, b: Decimal | number) => {
  return round2(round2(a) + round2(b));
};
