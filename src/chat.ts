const socket = require("socket.io");
import { Server } from "http";
import * as socketio from "socket.io";

import { formatMessage } from "./utils/formatMessage";
import { saveNewMessage } from "./controller/Database Controller/data.controller";

import { pool } from "./model/database";
import { QueryResult } from "pg";

export class Chat {
  private io: socketio.Server;

  constructor(server: Server) {
    this.io = socket(server, {
      cor: {
        origin: "127.0.0.1/8888",
      },
    });
    this.chatRoom();
  }

  private async chatRoom(): Promise<void> {
    this.io.on("connection", (socket: socketio.Socket) => {
      socket.on("joinRoom", async ({ userID, roomID }) => {
        //
        try {
          const userInfo: QueryResult = await pool.query(
            "SELECT * from users WHERE id=$1",
            [userID]
          );

          let roomInfo: QueryResult = await pool.query(
            "select rooms.room_name,messages.content,messages.created_at,messages.user_id,users.first_name,users.last_name,users.username from rooms inner join messages on rooms.id=messages.room_id inner join users on messages.user_id= users.id where rooms.id = $1",
            [roomID]
          );

          if (!roomInfo.rows[0]) {
            try {
              roomInfo = await pool.query("SELECT * from rooms WHERE id=$1", [
                roomID,
              ]);
            } catch (e) {
              console.log(e);
            }
          }

          socket.join(roomID);

          this.io.to(roomID).emit("roomInfo", {
            roomInfo: roomInfo.rows,
            userInfo: userInfo.rows,
          });

          // handle chat message
          socket.on("chatMessage", (msg) => {
            // listen to the chat message
            // emit message

            let newMessage = [];
            newMessage.push(
              msg,
              new Date(),
              parseInt(roomID),
              parseInt(userID)
            );
            // save to database
            saveNewMessage(newMessage);

            this.io
              .to(roomID)
              .emit(
                "message",
                formatMessage(
                  userInfo.rows[0].username,
                  userInfo.rows[0].first_name,
                  userInfo.rows[0].last_name,
                  msg,
                  userID
                )
              );
          });

          // listen on typing
          socket.on("typing", (user) => {
            socket.broadcast.emit("typing", {
              username: userInfo.rows[0].username,
            });
          });
        } catch (e) {
          console.log(e);
        }
      });
    });
  }
}
