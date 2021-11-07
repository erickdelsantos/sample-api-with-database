# Sample API with database
The goal of this small sample project is to demonstrate how to deal with basic database operations through API endpoints.

Erick Delgado Santos
### Moules used
It's based on SQLite and Express.

### Endpoints
`/`
Accepts:
**GET** Use to check if the server is working, returns JSON message "Ok"

`/api/users`
Accepts:
**GET** Return user list. Accept output=html query param to return the output in a HTML table instead of JSON. (Ex.: http://localhost:3000/api/users?output=html)

`/api/user/**user_id**`
Accepts:
**GET** Re
