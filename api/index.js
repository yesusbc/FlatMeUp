'use strict'

const mongoose = require('mongoose')
const app      = require('./app')
const PORT     = 3800;

mongoose.Promise = global.Promise;

const uri = "mongodb+srv://admin:contraseña@cluster0.fp9nw.gcp.mongodb.net/FlatMeUp_development_DB?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
        .then(() =>{
            console.log("Database connection successfully...");

            // Create server
            app.listen(PORT, () => {
                console.log("Server running at http://localhost:3800");
            });

        })
        .catch(err => console.log(err));