import { Request, Response } from "express";
export function auth(req: Request, res: Response, next) {
  try {
    const userSession = req.session;
    if (userSession.userID) {
      next();
    } else {
      // res.status(403).send("Hehe you do not have the permission to do that");
      res.redirect("/login");
    }
  } catch {
    res.send("Invalid request");
  }
}
