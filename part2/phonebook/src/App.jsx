import { useState, useEffect } from "react";
import phonebookService from "./services/phonebook";
import Notification from "./components/Notification";

const Filter = ({ setFilter, filter }) => {
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

const PersonForm = ({
  addContact,
  newName,
  newNumber,
  setNewName,
  setNewNumber,
}) => {
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <form onSubmit={addContact}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, filter, handleDelete }) => {
  const phonebookFilter = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLocaleLowerCase())
      )
    : persons;

  return phonebookFilter.map((person) => (
    <div key={person.id}>
      {person.name} {person.number}{" "}
      <button onClick={() => handleDelete(person.id)}>delete</button>
    </div>
  ));
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notif, setNotif] = useState({ message: null, type: null });

  const showNotification = (message, type) => {
    setNotif({ message, type });
    setTimeout(() => {
      setNotif({ message: null, type: null });
    }, 5000);
  };

  useEffect(() => {
    phonebookService.getAll().then((data) => {
      setPersons(data);
    });
  }, []);

  const addContact = (event) => {
    event.preventDefault();

    const contactObject = {
      name: newName,
      number: newNumber,
    };

    if (persons.some((person) => person.name === newName)) {
      const person = persons.find((p) => p.name === newName);
      const updateContact = { ...person, number: newNumber };

      if (
        window.confirm(
          `${newName} is already added to phonebook, replace old number with a new one?`
        )
      ) {
        phonebookService
          .update(person.id, updateContact)
          .then((returnedContact) => {
            setPersons(
              persons.map((p) =>
                p.id === returnedContact.id ? returnedContact : p
              )
            );
            setNewName("");
            setNewNumber("");
            showNotification(`Updated ${newName}'s contact number`, "success");
          })
          .catch((error) => {
            showNotification(
              `Error: Information of ${newName} has already been removed from server`,
              "error"
            );
            setPersons(persons.filter((p) => p.id !== person.id));
            setNewName("");
            setNewNumber("");
          });
      }
      return;
    }

    phonebookService.create(contactObject).then((data) => {
      setPersons(persons.concat(data));
      setNewName("");
      setNewNumber("");
      showNotification(`Added ${newName}`, "success");
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      phonebookService.deleteContact(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  return (
    <div>
      <Notification message={notif.message} type={notif.type}></Notification>
      <h2>Phonebook</h2>
      <Filter setFilter={setFilter} filter={filter} />
      <h3>add a new</h3>
      <PersonForm
        addContact={addContact}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
