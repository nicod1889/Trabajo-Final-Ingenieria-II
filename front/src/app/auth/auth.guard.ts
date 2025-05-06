import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from './auth.service';
import { hasValidRoles } from '../util/rolesUtil';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentemployeeLoginOn.pipe(
    take(1),
    map((loggedIn: boolean) => {
      if (loggedIn) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

export const viajeGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentemployeeLoginOn.pipe(
    take(1),
    map((loggedIn: boolean) => {
      if(!loggedIn) router.navigate(['/login']);
      return hasValidRoles(authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO", "ROL_CAMIONERO"]);
    })
  );
};

export const ClientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentemployeeLoginOn.pipe(
    take(1),
    map((loggedIn: boolean) => {
      if(!loggedIn) router.navigate(['/login']);
      return hasValidRoles(authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
    })
  );
};

export const servicesGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentemployeeLoginOn.pipe(
    take(1),
    map((loggedIn: boolean) => {
      if(!loggedIn) router.navigate(['/login']);
      return hasValidRoles(authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO", "ROL_CAMIONERO"]);
    })
  );
};

export const vehiclesGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentemployeeLoginOn.pipe(
    take(1),
    map((loggedIn: boolean) => {
      if(!loggedIn) router.navigate(['/login']);
      return hasValidRoles(authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
    })
  );
};

export const camionesGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentemployeeLoginOn.pipe(
    take(1),
    map((loggedIn: boolean) => {
      if(!loggedIn) router.navigate(['/login']);
      return hasValidRoles(authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
    })
  );
};

export const marcasGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentemployeeLoginOn.pipe(
    take(1),
    map((loggedIn: boolean) => {
      if(!loggedIn) router.navigate(['/login']);
      return hasValidRoles(authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
    })
  );
};

export const ciudadesGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentemployeeLoginOn.pipe(
    take(1),
    map((loggedIn: boolean) => {
      if(!loggedIn) router.navigate(['/login']);
      return hasValidRoles(authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
    })
  );
};

export const cargaGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentemployeeLoginOn.pipe(
    take(1),
    map((loggedIn: boolean) => {
      if(!loggedIn) router.navigate(['/login']);
      return hasValidRoles(authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
    })
  );
};

export const tipoCargaGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentemployeeLoginOn.pipe(
    take(1),
    map((loggedIn: boolean) => {
      if(!loggedIn) router.navigate(['/login']);
      return hasValidRoles(authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
    })
  );
};

export const employeeGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentemployeeLoginOn.pipe(
    take(1),
    map((loggedIn: boolean) => {
      if(!loggedIn) router.navigate(['/login']);
      return hasValidRoles(authService.employeeData, ["ROL_ADMIN"]);
    })
  );
};


export const authGuardNotLogin: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentemployeeLoginOn.pipe(
    take(1),
    map((loggedIn: boolean) => {
      if (loggedIn) {
        router.navigate(['/inicio']);
        return false;
      } else {
        return true;
      }
    })
  );
};