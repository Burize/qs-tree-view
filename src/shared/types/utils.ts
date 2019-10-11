export type GetProps<T extends React.ComponentType<any>> =
  T extends React.StatelessComponent<infer SP> ? SP :
  T extends React.ComponentClass<infer CP> ? CP : never;

export type ReturnPromisedType<T extends (...args: any[]) => any> =
  T extends (...args: any[]) => Promise<infer R> ? R : ReturnType<T>;

export type Flavoring<B, T> = { _type?: B } & T;
