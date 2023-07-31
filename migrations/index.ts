import setupRoles from './001_setupRoles';
import permissions from './003_permissionsTable';
import blockedRole from './004_blockedRole';
import setupProfileTypes from './004_setupProfileTypes';

export const migrations = [
  setupRoles,
  permissions,
  blockedRole,
  setupProfileTypes
];
