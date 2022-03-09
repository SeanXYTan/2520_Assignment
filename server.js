const express = require("express");
const app = express();
const index = require("./routes");
const ev = require("./routes/ev");
const config = require('./config');
const mongoose = require('mongoose');


// View engine
const ejsEngine = require("ejs-locals");
app.engine("ejs", ejsEngine);           // support master pages
app.set("view engine", "ejs");          // ejs view engine

mongoose.connect(`mongodb://${config.database_server}:${config.database_port}/sales`, 
function (err) {
   if (err) throw err;
   console.log(`Successfully connected do database server ${config.database_server}:${config.database_port}.`);
});

//If people want to see your documentation, they'd go to url/docs
app.use("/", index);
app.use("/api", ev);

app.listen(config.http_port, function() {
    console.log(`Server started on port: ${config.http_port}`);
    console.log(`Using mongo database on server ${config.database_server}:${config.database_port} `);
});