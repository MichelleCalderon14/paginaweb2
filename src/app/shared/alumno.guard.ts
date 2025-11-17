// src/app/shared/alumno.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const alumnoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const ok = auth.hasRole('ALUMNO');  // 👈 ahora el tipo acepta 'ALUMNO'
  if (!ok) {
    router.navigate(['/login']);
  }
  return ok;
};
