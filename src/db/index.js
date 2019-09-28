const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const connect = () => {
  mongoose.connect("mongodb://localhost:27017/db", { useNewUrlParser: true });
  mongoose.connection.on("error", () => {
    console.error(
      "error",
      "MongoDB connection error. Please make sure MongoDB is running."
    );
    process.exit();
  });
  mongoose.connection.once("open", () =>
    console.log("info", "MongoDB has been connected.")
  );
};

module.exports = { connect };
