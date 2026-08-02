export interface LookupOption<TId extends string | number = string> {
  id: TId;
  name?: string;
  code?: string;
}
