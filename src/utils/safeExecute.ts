type SuccessResult<T> = readonly [T, null];
type ErrorResult<E = Error> = readonly [null, E];
type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

export default async function safeExecute<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return [data, null] as const;
  } catch (err) {
    return [null, err as E] as const;
  }
}
