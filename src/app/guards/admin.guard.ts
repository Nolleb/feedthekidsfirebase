import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import { AuthStore } from '../stores/auth/auth.store';
import { Role } from '../models/user.model';

export const adminGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore)
  
  const router = inject(Router)

  const role = authStore.getUserRole()

  if (role !== Role.ADMIN) {
    router.navigateByUrl('/')
    return false
  }
  return true
};
