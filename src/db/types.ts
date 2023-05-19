import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type question = {
  id: Generated<number>;
  questionPageId: Generated<number>;
  leftQuestion: string;
  rightQuestion: string;
  leftChosen: Generated<number>;
  totalChosen: Generated<number>;
  createdAt: Generated<Timestamp>;
};
export type DB = {
  question: question;
};
