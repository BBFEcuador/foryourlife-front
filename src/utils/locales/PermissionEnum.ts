export enum PermissionEnum {
  SEE_EMISSION_POINTS = "SEE_EMISSION_POINTS",
  CREATE_EMISSION_POINTS = "CREATE_EMISSION_POINTS",
  UPDATE_EMISSION_POINTS = "UPDATE_EMISSION_POINTS",
  DELETE_EMISSION_POINTS = "DELETE_EMISSION_POINTS",

  SEE_USERS = "SEE_USERS",
  CREATE_USERS = "CREATE_USERS",
  UPDATE_USERS = "UPDATE_USERS",
  DELETE_USERS = "DELETE_USERS",

  SEE_CAMPUS = "SEE_CAMPUS",
  CREATE_CAMPUS = "CREATE_CAMPUS",
  UPDATE_CAMPUS = "UPDATE_CAMPUS",
  DELETE_CAMPUS = "DELETE_CAMPUS",

  SEE_PRODUCTS = "SEE_PRODUCTS",
  CREATE_PRODUCTS = "CREATE_PRODUCTS",
  UPDATE_PRODUCTS = "UPDATE_PRODUCTS",
  DELETE_PRODUCTS = "DELETE_PRODUCTS",

  SEE_DISCOUNTS = "SEE_DISCOUNTS",
  CREATE_DISCOUNTS = "CREATE_DISCOUNTS",
  UPDATE_DISCOUNTS = "UPDATE_DISCOUNTS",
  DELETE_DISCOUNTS = "DELETE_DISCOUNTS",

  SEE_PAYMENTS = "SEE_PAYMENTS",
  CREATE_PAYMENTS = "CREATE_PAYMENTS",
  UPDATE_PAYMENTS = "UPDATE_PAYMENTS",
  DELETE_PAYMENTS = "DELETE_PAYMENTS",

  SEE_PAYMENT_METHODS = "SEE_PAYMENT_METHODS",
  CREATE_PAYMENT_METHODS = "CREATE_PAYMENT_METHODS",
  UPDATE_PAYMENT_METHODS = "UPDATE_PAYMENT_METHODS",
  DELETE_PAYMENT_METHODS = "DELETE_PAYMENT_METHODS",

  SEE_TRAINERS = "SEE_TRAINERS",
  CREATE_TRAINERS = "CREATE_TRAINERS",
  UPDATE_TRAINERS = "UPDATE_TRAINERS",
  DELETE_TRAINERS = "DELETE_TRAINERS",

  SEE_TRAININGS = "SEE_TRAININGS",
  CREATE_TRAININGS = "CREATE_TRAININGS",
  UPDATE_TRAININGS = "UPDATE_TRAININGS",
  DELETE_TRAININGS = "DELETE_TRAININGS",

  SEE_ATTENDANCES_DECLARATIONS = "SEE_ATTENDANCES_DECLARATIONS",
  CREATE_ATTENDANCES_DECLARATIONS = "CREATE_ATTENDANCES_DECLARATIONS",
  UPDATE_ATTENDANCES_DECLARATIONS = "UPDATE_ATTENDANCES_DECLARATIONS",
  DELETE_ATTENDANCES_DECLARATIONS = "DELETE_ATTENDANCES_DECLARATIONS",

  SEE_TEAMS = "SEE_TEAMS",
  CREATE_TEAMS = "CREATE_TEAMS",
  UPDATE_TEAMS = "UPDATE_TEAMS",
  DELETE_TEAMS = "DELETE_TEAMS",

  SEE_PARTICIPANTS = "SEE_PARTICIPANTS",
  CREATE_PARTICIPANTS = "CREATE_PARTICIPANTS",
  UPDATE_PARTICIPANTS = "UPDATE_PARTICIPANTS",
  DELETE_PARTICIPANTS = "DELETE_PARTICIPANTS",

  SEE_MASTER_LIFES = "SEE_MASTER_LIFES",
  CREATE_MASTER_LIFES = "CREATE_MASTER_LIFES",
  UPDATE_MASTER_LIFES = "UPDATE_MASTER_LIFES",
  DELETE_MASTER_LIFES = "DELETE_MASTER_LIFES",

  SEE_VISIONARIES = "SEE_VISIONARIES",
  CREATE_VISIONARIES = "CREATE_VISIONARIES",
  UPDATE_VISIONARIES = "UPDATE_VISIONARIES",
  DELETE_VISIONARIES = "DELETE_VISIONARIES",

  SEE_STAFF = "SEE_STAFF",
  CREATE_STAFF = "CREATE_STAFF",
  UPDATE_STAFF = "UPDATE_STAFF",
  DELETE_STAFF = "DELETE_STAFF",

  SEE_CONFIGURATIONS = "SEE_CONFIGURATIONS",
  UPDATE_CONFIGURATIONS = "UPDATE_CONFIGURATIONS"

}

/**
 * Grupos de permisos predefinidos para diferentes roles
 */
export const PermissionGroups = {
  // Grupo de administrador con todos los permisos
  ADMIN: Object.values(PermissionEnum),
};

/**
 * Función para verificar si un usuario tiene un permiso específico
 * @param userPermissions Array de permisos del usuario
 * @param requiredPermission Permiso requerido para acceder a una funcionalidad
 * @returns boolean indicando si el usuario tiene el permiso
 */
export function hasPermission(userPermissions: PermissionEnum[], requiredPermission: PermissionEnum): boolean {
  return userPermissions.includes(requiredPermission);
}

/**
 * Función para verificar si un usuario tiene al menos uno de los permisos requeridos
 * @param userPermissions Array de permisos del usuario
 * @param requiredPermissions Array de permisos requeridos (al menos uno)
 * @returns boolean indicando si el usuario tiene al menos uno de los permisos
 */
export function hasAnyPermission(userPermissions: PermissionEnum[], requiredPermissions: PermissionEnum[]): boolean {
  return requiredPermissions.some((permission) => userPermissions.includes(permission));
}

/**
 * Función para verificar si un usuario tiene todos los permisos requeridos
 * @param userPermissions Array de permisos del usuario
 * @param requiredPermissions Array de permisos requeridos (todos)
 * @returns boolean indicando si el usuario tiene todos los permisos
 */
export function hasAllPermissions(userPermissions: PermissionEnum[], requiredPermissions: PermissionEnum[]): boolean {
  return requiredPermissions.every((permission) => userPermissions.includes(permission));
}
