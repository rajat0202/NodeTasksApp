const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectUrl, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log("Unable to connect ");
  }
  const db = client.db(databaseName);

  const retPromise = db.collection("Users").updateOne(
    {
      _id: new mongodb.ObjectID("5f48020d53a47987c4366f1e"),
    },
    {
      $set: {
        name: "Andrew",
      },
    }
  );

  retPromise
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
});
