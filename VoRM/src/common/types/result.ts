export type Result<T> =
  | { ok: true;  data: T;       status: number }
  | { ok: false; error: string; status: number }
