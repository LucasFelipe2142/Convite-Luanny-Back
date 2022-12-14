import express from "express";
import cors from "cors";
import Joi from "joi";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

const app = start();

mongoClient.connect().then(() => {
  db = mongoClient.db("festaLuanny");
});

const schema = Joi.object().keys({
  name: Joi.string().min(1).required(),
});

app.post("/confirmarpresenca", (req, res) => {
  const result = schema.validate(req.body, Joi.messages);

  if (result.error) {
    res.send(result.error.details);
  } else {
    db.collection("confirmados")
      .insertOne({
        ...req.body,
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(400);
      });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});

function start() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  return app;
}
