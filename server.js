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
      database: 'staffing_db'
    },
    console.log(`Connected to the staffing_db database.`)
  );
  
function startTable() {
  return inquirer
  .prompt([
    {
      type: "list",
      name: "toDo",
      message: "What would you like to do?",
      choices: ["View All Employees", "Add Employee", "Update Employee Role",
    "View All Roles", "Add Role", "View All Departments", "Add Department",
  "View All Employees", "Quit"],
    },
  ])

  .then((answers) => {
    switch (answers.toDo) {
      case "View All Employees":
        
        break;
      case "Add Employee":
        
        break;
        case "Update Employee Role":
        
        break;
        case "View All Roles":
        
        break;
        case "Add Role":
        
        break;
        case "View All Departments":
        
        break;
        case "Add Department":
        
        break;
        case "View All Employees":
        
        break;
        case "Quit":
        
        break;
      default:
        return;
    }
  })
  //shows error if any
  .catch((err) => console.error(err));
}




  // Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  startTable();