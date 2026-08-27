export enum OPSTATUS {
  SUCCESS,
  // integrity violations
  FOREIGN_KEY_VIOLATION = 23503,
  UNIQUE_VIOLATION = 23505,
  CHECK_VIOLATION = 23514,
  NOT_NULL_VIOLATION = 23502,

  // transaction failure
  INVALID_TRANSACTION_STATE = 25000,

  // connection failure
  CONNECTION_DOES_NOT_EXIST = 8006,

  // other
  UNKNOWN_FAILURE = -1,
}
