const express = require("express");
// const logger = require("morgan");
// const cors = require("cors");
const { modifyArchive } = require("./archiveHelper");
const app = express();
// const formatsLogger = app.get("env") === "development" ? "dev" : "short";
// app.use(logger(formatsLogger));
// app.use(cors());
// app.use(express.json());
// app.use((req, res) => {
//   res.status(404).json({ message: "Not found" });
// });

// основная функция сервера
modifyArchive();

module.exports = app;
