const express = require('express');
const inquirer = require("inquirer");
const cTable = require('console.table');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      
      user: 'root',
      
      password: 'password',
      database: 'courses_db'
    },
    console.log(`Connected to the courses_db database.`)
  );
  


  // Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });