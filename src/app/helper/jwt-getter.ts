export function TokenGetter(): string {
  return localStorage.getItem('access_token');
}
