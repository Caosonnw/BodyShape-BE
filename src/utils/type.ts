export const Role = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  COACH: 'COACH',
  CUSTOMER: 'CUSTOMER',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];
export const RoleValues = [
  Role.OWNER,
  Role.ADMIN,
  Role.COACH,
  Role.CUSTOMER,
] as const;

export const TokenType = {
  AccessToken: 'AccessToken',
  RefreshToken: 'RefreshToken',
} as const;

export const StatusProduct = {
  Available: 'Available',
  OutOfStock: 'Out of Stock',
};
