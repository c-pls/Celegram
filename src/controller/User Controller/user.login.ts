import { Request, Response } from "express";

import { pool } from "../../model/database";
import { compare } from "bcrypt";
import { QueryResult } from "pg";

export async function userLogin(req: Request, res: Response): Promise<void> {
  const client = await pool.connect();
  let username = req.body.username;
  try {
    const result: QueryResult = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    // if (username === result.rows[0].username) {
    const check = await compare(req.body.password, result.rows[0].password);
    if (check) {
      // res.render("test", {
      //   username: result.rows[0],
      //   id: result.rows[0].id,
      //   firstName: result.rows[0].first_name,
      //   lastName: result.rows[0].last_name,
      //   isAdmin: result.rows[0].is_admin,
      // });

      let userSession = req.session;
      userSession.userID = result.rows[0].id;

      res.redirect("/");
    } else {
      res.status(422).send("Password is not correct");
    }
  } catch (e) {
    res.status(422).send("username doesnt exist");
  } finally {
    client.release;
  }
}
