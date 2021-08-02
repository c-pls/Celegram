require("dotenv").config();
import express from "express";
import path from "path";
import { userRegister } from "../controller/User Controller/user.register";
import { userLogin } from "../controller/User Controller/user.login";
import {
  renderEnterRoom,
  renderChatRoom,
} from "../controller/Chat Controller/renderChatpage";
import { createNewRoom } from "../controller/Chat Controller/createNewRoom";
import { auth } from "../middleware/auth";
const htmlPath = path.join(__dirname, "..", "..", "views");

import session from "express-session";
declare module "express-session" {
  export interface Session {
    userID: { [key: string]: any };
  }
}
export class Router {
  private router: express.Router;
  private oneHour = 1000 * 60 * 60;
  constructor() {
    this.router = express.Router();
    this.config();
    this.routing();
  }

  private config() {
    this.router.use(
      session({
        secret: process.env.SECRET,
        saveUninitialized: true,
        cookie: { maxAge: this.oneHour },
        resave: false,
      })
    );
  }

  private routing() {
    this.router
      .route("/")
      .get(auth, (req: express.Request, res: express.Response) => {
        renderEnterRoom(req, res);
      })
      .post(auth, (req: express.Request, res: express.Response) => {
        createNewRoom(req, res);
        res.redirect("/");
      });

    this.login();
    this.register();
    this.logout();
    this.room();
  }
  private login(): void {
    this.router
      .route("/login")
      .get((req: express.Request, res: express.Response) => {
        if (!req.session.userID) {
          res.render("login");
        } else {
          res.status(402).send("Sorry, logout first");
        }
      })

      .post((req: express.Request, res: express.Response) => {
        userLogin(req, res);
      });
  }

  private register(): void {
    this.router
      .route("/register")
      .get((req: express.Request, res: express.Response) => {
        // require logout
        if (!req.session.userID) {
          res.render("register");
        } else {
          res.status(402).send("Sorry, logout first");
        }
      })

      .post((req: express.Request, res: express.Response) => {
        userRegister(req, res);

        res.redirect("/login");
      });
  }

  private room(): void {
    this.router
      .route("/t/:roomId")
      .get(auth, (req: express.Request, res: express.Response) => {
        renderChatRoom(req, res);
      });
  }

  private logout(): void {
    this.router
      .route("/logout")
      .get(auth, (req: express.Request, res: express.Response) => {
        req.session.destroy((err) => {
          if (err) {
            res.status(403).send("Invalid resquest");
          }
          res.redirect("/");
        });
      });
  }
  public getRouter() {
    return this.router;
  }
}

// export default router;
