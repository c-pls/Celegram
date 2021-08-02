import { Request, Response } from "express";
import { uuidv4 } from "../../utils/utilities";
import { pool } from "../../model/database";
import bcrypt from "bcrypt";
// interface User {
//   uuid: string;
//   first_name: string;
//   last_name: string;
//   username: string;
//   password: string;
//   created_at: Date;
// }

export async function userRegister(req: Request, res: Response): Promise<void> {
  const uuid = uuidv4();
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const username = req.body.username;
  const password = await bcrypt.hash(req.body.password, 7);
  const created_at = new Date();

  try {
    const reponse = await pool.query(
      "INSERT INTO users(uuid,first_name,last_name,username,password,created_at) VALUES ($1,$2,$3,$4,$5,$6)",
      [uuid, first_name, last_name, username, password, created_at]
    );
  } catch (e) {
    res.status(500).send("Internal Server error\n" + e);
  }
}
