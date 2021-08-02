import express from "express";
import { Router } from "./router/routes";
import path from "path";

export class App {
  private app: express.Application;
  private router: express.Router;
  constructor() {
    this.app = express();
    this.config();
    this.router = new Router().getRouter();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    this.app.use("/", this.router);
  }
  private config(): void {
    this.app.set("view engine", "ejs");
    this.app.use(
      express.urlencoded({
        extended: false,
      })
    );

    this.app.use(
      "/static",
      express.static(path.join(__dirname, "..", "static"))
    );
  }
  public getApp() {
    return this.app;
  }
}

// export default new App().app;
