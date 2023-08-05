import setupRoles from './001_setupRoles';
import permissions from './003_permissionsTable';
import blockedRole from './004_blockedRole';

export const migrations = [
  setupRoles,
  permissions,
  blockedRole,
];
