/*
  Decodes a JWT token and returns the payload.
  Handles tokens with or without the "Bearer " prefix.
 */
export function decodeToken(token: string): { id: string; role: string } {
    const raw = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    return JSON.parse(atob(raw.split('.')[1]));
}
