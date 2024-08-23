import { JwtPayload } from "jsonwebtoken";

// add user to query object with type as global
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
