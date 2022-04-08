import { Role } from '../enum/role';

/**
 * User model for back End HTTP request mapping
 * @param id Database id used for updates or deletes
 * @param firstName User First Name
 * @param lastName User Last Name
 * @param username
 * @param role Refer to {@link Role}
 * @param token Contains JWT Token
 */
export class User {
  id!: number;
  name!: string;
  surname!: string;
  username!: string;
  role!: Role;
  token!: string;
}
