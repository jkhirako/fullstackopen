```mermaid
sequenceDiagram
participant browser
participant server

    browser ->> server: GET /exampleapp/spa
    server -->> browser: HTML document
    browser ->> server: GET /exampleapp/main.css
    server -->> browser: CSS file
    browser ->> server: GET /exampleapp/spa.js
    server -->> browser: javascript file
    browser ->> server: GET /exampleapp/data.json
    server -->> browser: data JSON with the notes
```
