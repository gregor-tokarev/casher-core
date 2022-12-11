export interface Tree<T> {
  node: T;
  children: Tree<T>[];
}
