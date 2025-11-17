// src/app/shared/docente.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const docenteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const ok = auth.hasRole('DOCENTE');
  if (!ok) {
    router.navigate(['/login']);
  }
  return ok;
};
