require("dotenv").config();
import express from "express";
import { App } from "./app";

import { Server } from "http";
import { Chat } from "./chat";

export class ChatServer {
  public server: Server;
  private PORT = process.env.PORT;
  private app = new App().getApp();
  private chat: Chat;
  constructor() {
    this.init();
    this.chat = new Chat(this.server);
  }

  private init() {
    this.server = this.app.listen(this.PORT, () => {
      console.log(`Running on port ${this.PORT}`);
    });
  }

  public getServer() {
    return this.server;
  }
  public getApp(): express.Application {
    return this.app;
  }
}

// export default new ChatServer().server;
