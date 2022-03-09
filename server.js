const express = require("express");
const bodyParser = require("body-parser");
const index = require("./routes");
const ev = require("./routes/ev");
const config = require('./config');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

//Description that swagger uses to document your api
swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Sales PIE',
        description: 'Sales PIE information',
        contact: {
            name: "Sean Tan, Van Boi Hnem"
        },
        version: '1.0.0',
        servers: [
            {
                description: "Development Server"
            }
        ]
    }
}

const swaggerOptions = {
    swaggerDefinition,
    apis: ['routes/*.js']
}

const swaggerSpec = swaggerJsDoc(swaggerOptions);

mongoose.connect(`mongodb://${config.database_server}:${config.database_port}/ev`, function (err) {
   if (err) throw err;
   console.log(`Successfully connected to database server ${config.database_server}:${config.database_port}.`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//If people want to see your documentation, they'd go to url/docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", index);
app.use("/api", ev);

app.listen(config.http_port, function() {
    console.log(`Server started on port: ${config.http_port}`);
    console.log(`Using mongo database on server ${config.database_server}:${config.database_port} `);
});