import express, { Application } from "express";
import path from "path";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(express.json());

app.use("/api/jobs", require("./routes/api/jobs"));

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../client", "build")));

  // Serve index.html on all routes except any api routes above
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}
