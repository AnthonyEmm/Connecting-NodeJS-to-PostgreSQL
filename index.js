const express = require("express");

const app = express();

const PORT = process.env.PORT || 8040;

app.get("/", (req, res) => {
  res.send(`<h1>My Small App</h1>`);
});

app.listen(PORT, console.log(`listening on http://localhost:${PORT}`));
