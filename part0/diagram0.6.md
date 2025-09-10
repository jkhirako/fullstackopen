```mermaid
sequenceDiagram
    participant browser
    participant server

    browser ->> server: POST /exampleapp/new_note_spa (note data)
    server -->> browser: 201 Created

    Note right of browser: JavaScript updates the DOM to show the new note
```
