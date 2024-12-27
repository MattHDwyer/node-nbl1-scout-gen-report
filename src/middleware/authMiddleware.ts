import * as jwt from "jsonwebtoken";

export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send({ message: "Access Denied!" });
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.log("Error with the JWT Secret");
      return res.status(500).send({
        message: "Oh no! An error has occured... Please try again later",
      });
    }
    const decoded: any = jwt.verify(token, secret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send({ message: "Invalid Token" });
  }
};
