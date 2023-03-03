const mysql = require('mysql2');
const express = require('express');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

const initialQuestion = [
    {
        type: 'list',
        message: 'Select action',
        choices: [
            'View all departments', 
            'View all roles', 
            'View all employees', 
            'Add department', 
            'Add role', 
            'Add employee'
        ],
        name: 'initialQuestion'
    }
  ];

const addDepartmentQuestion = [
    {
        type: 'input',
        message: 'Enter department name',
        name: 'addDepartment'
    }
];

const addRoleQuestion = [
    {
        type: 'input',
        message: 'Enter role name',
        name: 'addRoleName'
    },
    {
        type: 'input',
        message: 'Enter salary',
        name: 'addRoleSalary'
    },
    {
        type: 'input',
        message: 'Enter department',
        name: 'addRoleDepartment'
    }
];

const addEmployeeQuestion = [
    {
        type: 'input',
        message: 'Enter employee first name',
        name: 'addEmployeeFirstName'
    },
    {
        type: 'input',
        message: 'Enter employee last name',
        name: 'addEmployeeLastName'
    },
    {
        type: 'list',
        message: 'Select employee role',
        choices: [{name: 'Computer Science', value: 1},{name: 'Psychology', value: 2},{name: 'Biology', value: 3}],
        name: 'addEmployeeRole'
    }
];

function init() {
    startingQuestion();
};

function startingQuestion() {
    inquirer.prompt(initialQuestion)
    .then((response) => {
    switch (response.initialQuestion) {

        case "View all departments":
        viewDepartments();

        case "View all roles":
        viewRoles();

        case "View all employees":
        viewEmployees();

        case "Add department":
        addDepartment();

        case "Add role":
        addRole();

        case "Add employee":
        addEmployee();
    }
    });
};

function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        mainQ();
      });
};

function viewRoles() {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results);
        initialQuestion();
    });
};

function viewEmployees() {
    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results);
        initialQuestion();
    });
};

function addDepartment() {
    inquirer
    .prompt(addDepartmentQuestion)
    .then((response) => {
        db.query(`INSERT INTO department (employee_name) VALUES ("${response.addDepartment}")`, function (err, results) {
            if (err) throw err;
        });
        console.log(`Added department`)
        initialQuestion();
    })
};

function addRole() {
    inquirer
    .prompt(addRoleQuestion)
    .then((response) => {
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.addRoleName, response.addRoleSalary, response.addRoleDepartment], function (err, results) {
            if (err) throw err;
        });
        console.log(`Added role`)
        initialQuestion();
    })
};

function addEmployee() {
    inquirer
    .prompt(addEmployeeQuestion)
    .then((response) => {
        db.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)", [response.addEmployeeFirstName, response.addEmployeeLastName, response.addEmployeeRole], function (err, results) {
            if (err) throw err;
        });
        console.log(`Added role`)
        initialQuestion();
    })
};

init();