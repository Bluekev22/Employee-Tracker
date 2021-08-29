const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");
const validate = require('./js/validate');
const { response } = require("express");

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

function addEmployee() {
  return (
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?",
          validate: addFirstName => {
            if (addFirstName) {
              return true;
            } else {
              console.log('Please enter a first name');
              return false;
            }
          }
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
            validate: addLastName => {
              if (addLastName) {
                return true;
              } else {
                console.log('Please enter a first name');
                return false;
              }
            }
          }
      ])

      .then(answers => {
        const emp = [answers.firstName, answers.lastName];
        const sql = `SELECT role.id, role.title FROM role`;
        db.query(sql, (err, result) => {
          if (err) throw err;
          const roles = result.map(({id, title}) => ({name: title, value: id}));
          inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles,
            }
          ])
          .then(chosenRole => {
            const role = chosenRole.role;
            emp.push(role);
            const managerSql = 'SELECT * FROM employee';
            db.query(managerSql, (err, result) => {
              if (err) throw err;
              const managers = result.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id}));
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: "Who is the employee's manager?",
                  choices: managers,
                }
              ])
              .then(chosenManager => {
                const manager = chosenManager.manager;
                emp.push(manager);
                const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                db.query(sql, emp, (err) => {
                  if (err) throw err;
                  console.log("Employee has been added!")
                  viewAllEmployees();
                })
              })
            })
          })
        })
      })
      //shows error if any
      .catch((err) => console.error(err))
  );
}

function updateEmployeeRole() {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
  FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
  db.query(sql, (err, info) => {
    if (err) throw err;
    let employeeArr = [];
    info.forEach((emp) => {employeeArr.push(`${emp.first_name} ${emp.last_name}`);});
    
    let sql = `SELECT role.id, role.title FROM role`;
    db.query(sql, (err, result) => {
      if (err) throw err;
      let rolesArr = [];
      result.forEach((role) => {rolesArr.push(role.title);});

      inquirer.prompt([
        {
          name: 'chosenEmployee',
          type: 'list',
          choices: employeeArr,
        },
        {
          name: 'chosenRole',
          type: 'list',
          message: 'What is their new role?',
          choices: rolesArr,
        }
      ])
      .then((answers) => {
        let newTitleId;
        let employeeId;
        result.forEach((role) => {
          if (answers.chosenRole === role.title) {
            newTitleId = role.id;
          }
        });

        info.forEach((employee) => {
          if (answers.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
            employeeId = employee.id;
          }
        });

        let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
        db.query(sqls, [newTitleId, employeeId], (err) => {
          if (err) throw err;
          console.log('Employee Role Has Been Updated!');
          startTable();
        })
      })
    })
  })
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
