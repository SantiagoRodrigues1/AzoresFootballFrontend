import type { User } from '@/types';

const CLUB_MANAGER_ROLES = new Set(['club_manager', 'team_manager']);
const PREMIUM_ACTIVE_STATUSES = new Set(['active', 'trialing', 'past_due']);

export function isClubManagerRole(role?: string | null) {
  return CLUB_MANAGER_ROLES.has(String(role || ''));
}

export function normalizeRole(role?: string | null) {
  if (isClubManagerRole(role)) {
    return 'club_manager';
  }

  return String(role || 'fan');
}

export function hasClubManagerAccess(user?: User | null) {
  return Boolean(user && (user.role === 'admin' || isClubManagerRole(user.role)));
}

export function hasPremiumAccess(user?: User | null) {
  if (!user) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  return user.plan === 'premium' && PREMIUM_ACTIVE_STATUSES.has(String(user.subscriptionStatus || 'inactive'));
}

export function getPlanLabel(user?: User | null) {
  if (!user) {
    return 'Free';
  }

  if (user.plan === 'premium') {
    return 'Premium';
  }

  if (user.plan === 'club_manager' || isClubManagerRole(user.role)) {
    return 'Club Manager';
  }

  return 'Free';
}