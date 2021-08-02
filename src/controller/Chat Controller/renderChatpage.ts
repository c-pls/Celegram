import { Request, Response } from "express";
import { pool } from "../../model/database";
import { QueryResult } from "pg";

export async function renderEnterRoom(
  req: Request,
  res: Response
): Promise<void> {
  let userSession = req.session;
  if (userSession.userID) {
    // list all the room availabe
    // find all the room
    try {
      const result: QueryResult = await pool.query("SELECT * from rooms");
      res.render("home", { roomInfo: result.rows });
    } catch (e) {
      res.status(403);
    }
  } else {
    res.redirect("/login");
  }
}

export async function renderChatRoom(
  req: Request,
  res: Response
): Promise<void> {
  const roomID = req.params.roomId;
  const userID = req.session.userID;
  const userInfo: QueryResult = await pool.query(
    "SELECT * from users WHERE id=$1",
    [userID]
  );
  res.render("chat", {
    userID: userID,
    fullname: userInfo.rows[0].first_name + " " + userInfo.rows[0].last_name,
  });
}
