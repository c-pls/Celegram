import { pool } from "../../model/database";
import { QueryResult } from "pg";

export async function saveNewRoom(newRoom: any) {
  try {
    const response: QueryResult = await pool.query(
      "INSERT INTO rooms (creator_id,uuid,room_name,users,last_updated) VALUES ($1,$2,$3,$4,$5)",
      newRoom
    );
  } catch (e) {
    console.log(e);
  }
}

export async function saveNewMessage(newMessage: any) {
  try {
    const response: QueryResult = await pool.query(
      "INSERT INTO messages (content,created_at,room_id,user_id) VALUES ($1,$2,$3,$4)",
      newMessage
    );
  } catch (e) {
    console.log(e);
  }
}
