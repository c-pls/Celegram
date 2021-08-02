import { saveNewRoom } from "../Database Controller/data.controller";
import { Request, Response } from "express";
import { uuidv4 } from "../../utils/utilities";

export function createNewRoom(req: Request, res: Response) {
  const creator_id = req.session.userID;
  const uuid = uuidv4();
  const room_name = req.body.room_name;
  const users = [];
  users.push(req.session.userID);
  const last_updated = new Date();

  let newRoom = [];
  newRoom.push(creator_id, uuid, room_name, users, last_updated);
  saveNewRoom(newRoom);
}
