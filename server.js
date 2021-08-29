const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");
const validate = require('./js/validate');

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "staffing_db",
  },
  console.log(`Connected to the staffing_db database.`)
);

function startTable() {
  return (
    inquirer
      .prompt([
        {
          type: "list",
          name: "toDo",
          message: "What would you like to do?",
          choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "Quit",
          ],
        },
      ])

      .then((answers) => {
        switch (answers.toDo) {
          case "View All Employees":
            viewAllEmployees();
            break;
          case "Add Employee":
            addEmployee();
            break;
          case "Update Employee Role":
            updateEmployeeRole();
            break;
          case "View All Roles":
            viewAllRoles();
            break;
          case "Add Role":
            addRole();
            break;
          case "View All Departments":
            viewAllDepartments();
            break;
          case "Add Department":
            addDepartment();
            break;
          case "Quit":
            db.end();
            break;
          default:
            return;
        }
      })
      //shows error if any
      .catch((err) => console.error(err))
  );
}

function viewAllEmployees() {
  const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
	ON m.id = e.manager_id`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.table(result);
      startTable();
    }
  });
}



function viewAllRoles() {
  const sql = `SELECT role.id, role.title, department.name AS department, role.salary
  FROM role
  INNER JOIN department ON role.department_id = department.id`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.table(result);
      startTable();
    }
  });
}

function viewAllDepartments() {
  const sql = `SELECT department.id AS id, department.name AS department
  FROM department`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.table(result);
      startTable();
    }
  });
}

startTable();
