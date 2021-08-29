const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");

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
            "View All Employees",
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
          case "View All Employees":
            viewAllEmployees();
            break;
          case "Quit":
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
  const sql = `SELECT employee.id, 
  employee.first_name, 
  employee.last_name, 
  role.title, 
  department.name AS 'department', 
  role.salary
  FROM employee, role, department 
  WHERE department.id = role.department_id 
  AND role.id = employee.role_id
  ORDER BY employee.id ASC`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.table(result);
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
    }
  });
}

startTable();
