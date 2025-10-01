// let express = require("express");
// let mongoose = require("mongoose");
// let app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const cors = require("cors");
// app.use(cors());
// require("dotenv").config();

// const port = 3000;
// // let MongoURL = "mongodb://127.0.0.1:27017/eLearning";

// let MongoURL = process.env.DB_URL;

// main()
//   .then(console.log("connected to db"))
//   .catch((err) => {
//     console.log(err);
//   });
// async function main() {
//   await mongoose.connect(MongoURL);
// }

// let commentSchema = mongoose.Schema({
//   name: String,
//   image: {
//     type: String,
//     default:
//       "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp",

//     set: (v) =>
//       v === ""
//         ? "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
//         : v,
//   },
//   rating: Number,
//   comment: String,
//   date: {
//     type: Date,
//     default: Date.now(),
//   },
// });

// let Feedback = mongoose.model("Feedback", commentSchema);

// app.post("/feedback/new", async (req, res) => {
//   console.log(req.body);
//   let { name, image, rating, comment, date } = req.body;
//   let newFeedback = new Feedback({ name, image, rating, comment, date });
//   await newFeedback.save();
//   res.redirect("https://e-learning-six-iota.vercel.app/feedback");
// });

// app.get("/feedback", async (req, res) => {
//   let data = await Feedback.find({});
//   // console.log(data);
//   res.send(data);
// });

// app.get("/feedback/:id", async (req, res) => {
//   let { id } = req.params;
//   let data = await Feedback.findOneAndDelete({ _id: id });
//   // console.log(data);
//   res.redirect("https://e-learning-six-iota.vercel.app/feedback");
// });

// app.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });
// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sql, poolPromise } = require("./db"); // we'll create db.js for SQL connection

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 3000;

// -------------------- FEEDBACK ROUTES -------------------- //

// Add new feedback
app.post("/feedback/new", async (req, res) => {
  const { name, image, rating, comment } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("name", sql.NVarChar, name)
      .input("image", sql.NVarChar, image || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp")
      .input("rating", sql.Int, rating)
      .input("comment", sql.NVarChar, comment)
      .query(`INSERT INTO Feedbacks (name, image, rating, comment, date)
              VALUES (@name, @image, @rating, @comment, GETDATE())`);
    res.redirect("https://e-learning-six-iota.vercel.app/feedback");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Get all feedback
app.get("/feedback", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Feedbacks ORDER BY date DESC");
    res.send(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Delete feedback by id
app.get("/feedback/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Feedbacks WHERE feedback_id = @id");
    res.redirect("https://e-learning-six-iota.vercel.app/feedback");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
