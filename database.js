var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DATABASE = "database.db"

let db = new sqlite3.Database(DATABASE, (err) => {

    if ( err ) {
      
      // Cannot open database
      console.error(err.message)
      throw err

    } else {

        console.log('Connected to the SQLite database.')

        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text NOT NULL, 
            email text NOT NULL UNIQUE, 
            password text NOT NULL, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,

        (err) => {

            if (err) {

                // Table already created

            } else {

                // Table just created, creating some rows
                var insert = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';

                db.run( insert, ["admin", "admin@example.com", md5("adm123")] );
                db.run( insert, ["user", "user@example.com", md5("user123")] );

            }

        });  

    }

});


module.exports = db