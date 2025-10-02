const express = require("express");
const app = express();
app.use(express.json());
var morgan = require("morgan");
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(express.static("dist"));
require("dotenv").config();
const Contact = require("./models/contact");

app.get("/api/persons", (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

app.get("/info", (req, res) => {
  const time = new Date();
  Contact.countDocuments({}).then((count) => {
    res.send(`
    <div>Phonebook has info for ${count} people</div>
    <div>${time}</div>
    `);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Contact.findById(req.params.id).then((contact) => {
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({
        error: "Contact not found",
      });
    }
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phonebook = phonebook.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number missing",
    });
  }

  const person = new Contact({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedContact) => {
    res.json(savedContact);
  });
});

const PORT = process.env.port || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
