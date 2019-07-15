

// export type PersistedData<T> = T | string | null;

// export interface PersistentStorage<T> {
//   getItem: (key: string) => Promise<T> | T | null;
//   setItem: (key: string, data: T) => Promise<T> | Promise<void> | void | T;
//   removeItem: (key: string) => Promise<T> | Promise<void> | void;
// }

// export interface GraphiQLPersistOptions<TSerialized> {
//   // cache: LRUCache<TSerialized>;
//   storage: PersistentStorage<PersistedData<TSerialized>>;
//   debounce?: number;
//   key?: string;
//   serialize?: boolean;
//   maxSize?: number | false;
//   debug?: boolean;
// }
