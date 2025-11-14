export const MAX_USER_NAME_LENGTH = 24
export const MIN_USER_NAME_LENGTH = 3
export const USERNAME_REGEXP = new RegExp(
  `^(\\p{Letter}|[0-9]|\\.|\\-|_){${MIN_USER_NAME_LENGTH},${MAX_USER_NAME_LENGTH}}$`,
  "u"
)
