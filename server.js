const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

const passwords = new Map(); // Stores encrypted passwords temporarily

// Generate a secure one-time link
app.post("/generate", (req, res) => {
  const { site, username, password } = req.body;
  const id = crypto.randomBytes(16).toString("hex");
  const encryptedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  passwords.set(id, { site, username, encryptedPassword });
  res.json({ link: `${req.protocol}://${req.get("host")}/access/${id}` });
});

// Access the login without revealing password
app.get("/access/:id", (req, res) => {
  const id = req.params.id;
  if (passwords.has(id)) {
    const data = passwords.get(id);
    passwords.delete(id); // Ensure one-time use
    res.render("autologin", { data });
  } else {
    res.send("This link has expired or is invalid.");
  }
});

app.listen(port, () => {
  console.log(`PassMeNot running at http://localhost:${port}`);
});
