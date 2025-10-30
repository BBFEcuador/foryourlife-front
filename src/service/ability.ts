import { Ability, AbilityBuilder, defineAbility } from '@casl/ability';
import { jwtDecode } from 'jwt-decode';
import type { PermissionEnum } from '@/utils/locales/PermissionEnum.ts';
import { useAbility } from '@casl/vue';

export const ability = defineAbility((can) => {
  let rol = localStorage.getItem('admin-store');
  if (rol) {
    const st = JSON.parse(rol);
    if (st.token) {
      const decoded = jwtDecode<any>(st.token);
      if (decoded.authorities as string) {
        decoded.authorities.split(',').forEach((rol: string) => {
          can(rol, 'all');
        });
      }
    }
  }
});


export const updateAbilitiesWithToken = (token: string) => {
  ability.update([]);
  const { can, rules } = new AbilityBuilder(Ability);
  if (token) {
    const decoded = jwtDecode<any>(token);
    if (decoded.authorities as string) {
      decoded.authorities.split(',').forEach((rol: string) => {
        can(rol, 'all');
      });
    }
  }
  ability.update(rules);
};

export const updateAbilities = () => {
  ability.update([]);
  let rol = localStorage.getItem('admin-store');
  const { can, rules } = new AbilityBuilder(Ability);
  if (rol) {
    const st = JSON.parse(rol);
    if (st.token) {
      const decoded = jwtDecode<any>(st.token);
      console.log(`rol`, decoded);
      if (decoded.authorities as string) {
        decoded.authorities.split(',').forEach((rol: string) => {
          console.log(`rol`, rol);
          can(rol, 'all');
        });
      }
    }
  }
  ability.update(rules);
};

export const showSideBarItem = (p: PermissionEnum[] | undefined) => {
  const { rules } = useAbility();
  console.log(p);
  if (!p || p.length === 0) {
    return true; // Si no hay permisos definidos, mostrar por defecto
  }

  if (!rules || rules.length === 0) {
    return false; // Si el usuario no tiene permisos, no mostrar
  }

  const permissions = p;

  const userActions = rules.map((rule) => rule.action);

  return permissions.some((requiredPermission) => userActions.includes(requiredPermission));
};

