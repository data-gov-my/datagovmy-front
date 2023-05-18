import { AccessorFn, createColumnHelper, DeepKeys, Row } from "@tanstack/react-table";

type ElectionSchema<T> = {
  key: DeepKeys<T> | AccessorFn<T>;
  id: string;
  header: string;
  cell?: (props: { getValue: () => any; row: Row<T> }) => unknown;
};

export const generateSchema = <T,>(schemas: ElectionSchema<T>[]) => {
  const helper = createColumnHelper<T>();
  return schemas.map(schema => {
    if (schema.cell)
      return helper.accessor(schema.key, {
        id: schema.id,
        header: schema.header,
        cell: schema.cell,
      });
    return helper.accessor(schema.key, {
      id: schema.id,
      header: schema.header,
    });
  });
};
