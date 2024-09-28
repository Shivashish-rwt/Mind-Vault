const dotenv = require("dotenv");
dotenv.config({
    path: "./.env"
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routes/user.route");
const noteRouter = require("./routes/note.route");

const app = express();

mongoose
    .connect(`${process.env.MONGODB_URL}`)
    .then(() => console.log(`Server is connected to database`))
    .catch((err) => console.log(err));

app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(express.json({limit: "16kb"}));

//Routes
app.use("/user", userRouter);
app.use("/note", noteRouter);

app.listen(process.env.PORT || 8000, () => {
    console.log("Server running at 8000 port")
});

module.exports = app;