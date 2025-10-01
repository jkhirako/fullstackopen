const mongoose = require("mongoose");

const password = process.argv[2];
const url = `mongodb+srv://jkhirakosocmed_db_user:${password}@cluster0.tkdrzv7.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number,
});
const Contact = mongoose.model("Contact", phonebookSchema);
if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note);
      mongoose.connection.close();
    });
  });
} else {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });

  contact.save().then((result) => {
    console.log(`added ${contact.name} number ${contact.number} to phonebook`);
    mongoose.connection.close();
  });
}
