import { Request, Response, NextFunction } from "express";

/**
 * Middleware that restricts access to admin-only routes.
 * Must be used after AuthenticationMid, which attaches the decoded JWT payload to req.user.
 * Returns 401 if the user is not authenticated, 403 if authenticated but not an admin.
 */
export function AuthorizedAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || !user.role) {
    return res.status(401).json({ error: "Not authorized!" });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}
