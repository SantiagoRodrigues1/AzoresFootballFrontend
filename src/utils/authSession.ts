export const AUTH_INVALIDATED_EVENT = 'azores-score:auth-invalidated';

export function clearStoredSession() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('azores_score_user');
  localStorage.removeItem('azores_score_token');
}

export function invalidateSession(status?: number) {
  if (typeof window === 'undefined') {
    return;
  }

  clearStoredSession();
  window.dispatchEvent(
    new CustomEvent(AUTH_INVALIDATED_EVENT, {
      detail: { status }
    })
  );
}