const express = require('express')
const md5 = require("md5")
const bodyParser = require("body-parser");
const db = require('./database.js')


const app = express()
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );


const HTTP_PORT = 3000 


// Start server
app.listen( HTTP_PORT, () => {

    console.log( "Server running on %PORT%".replace("%PORT%",HTTP_PORT) )

});


// Root endpoint
app.get("/", (req, res, next) => {

    res.json({"message":"Ok"})

});


// List users
app.get("/api/users", (req, res, next) => {

    let sql = "SELECT * FROM users";
    let params = [];
    db.all(sql, params, (err, rows) => {
    
        if (err) {
        
          res.status(400).json({ "error": err.message });
          return;

        }


        // HTML output
        if ( req.query.output === 'html' ) {
        
            let html = '';
            for ( data of rows ) {
            
                html += '<tr>';
                html += '<td>'+data.name+'</td>';
                html += `<td><a href="mailto:${data.email}">`+data.email+'</td>';
                html += '</tr>';

            }

            res.send(

                '<html>'+
                '<table>'+
                    '<tr>'+
                    '<th>Username</th>'+
                    '<th>E-Mail</th>'+
                    '</tr>'+
                    html+
                '</table>'+
                '</html>'

            )

        } else {
        // JSON Output

            res.json({

                "message": "success",
                "data": rows

            })
        
        }




    });

});


// Create new user
app.post("/api/user/", (req, res, next) => {

    let errors = [];

    if ( !req.body.name ) {
    
        errors.push("You haven't specified a username.");

    }

    if ( req.body.name && req.body.name.length < 3 ) {
    
        errors.push("You have specified a too short username.");

    }

    if ( !req.body.password ) {
    
        errors.push("You haven't specified a password.");

    }

    if ( !req.body.email ) {

        errors.push("Sorry! You haven't specified an e-mail.");

    }

    if ( errors.length ) {

        res.status(400).json({ "error": errors.join(",") });
        return;

    }

    let data = {

        name: req.body.name,
        email: req.body.email,
        password : md5(req.body.password)

    }

    const query ='INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

    let params =[data.name, data.email, data.password];
    
    db.run(query, params, function (err, result) {

        if (err){

            res.status(400).json({ "error": err.message })
            return;

        }

        res.json({

            "message": "success",
            "data": data,
            "id" : this.lastID

        })

    });

})


// Return single user information
app.get("/api/user/:id", (req, res, next) => {

    const sql = "SELECT * FROM users WHERE id = ?"
    let params = [req.params.id]

    db.get(sql, params, (err, row) => {

        if (err) {

          res.status(400).json({ "error": err.message });
          return;

        }
        
        res.json({

            "message": "success",
            "data": row

        })

    });

});


// Update user information
app.patch("/api/user/:id", (req, res, next) => {

    let data = {

        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null
        
    }

    db.run(
        `UPDATE users SET 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        
        function (err, result) {
            if (err) {

                res.status(400).json({ "error": err.message })
                return;

            }
            res.json({

                message: "success",
                data: data,
                changes: this.changes

            })
        }
    );

})


// Delete user
app.delete("/api/user/:id", (req, res, next) => {
    
    db.run(
    
        'DELETE FROM users WHERE id = ?',
    
        req.params.id,
        function (err, result) {
            
            if (err) {

                res.status(400).json({"error": err.message})
                return;

            }

            res.json({

                "message":"deleted",
                changes: this.changes

            })

        }
    );

})


// Response for unknown endpoints
app.use(function(req, res){
    
    res.status(404);

});