const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");

const Document = require("./models/document");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost/wastebin");
    console.log("DB connected successfully");
  } catch (error) {
    console.error("connection error", error);
  }
};

connectDB();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const code = `Welcome to Wastebin!

Use the commands in the top right corner
to create a new file to share with others! `;
  res.render("code-display", { code, language: "plaintext" });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/save", async (req, res) => {
  const value = req.body.value;
  try {
    const document = await Document.create({ value });
    res.redirect(`/${document.id}`);
  } catch (error) {
    res.render("new", { value });
  }
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).send("document not found");
    }

    console.log("rendering code-display with ID", id);

    res.render("code-display", { code: document.value, id });
  } catch (error) {
    res.redirect("/");
  }
});

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).send("document not found");
    }

    res.render("new", { value: document.value });
  } catch (error) {
    res.redirect(`/${id}`);
  }
});

app.listen(3000);
