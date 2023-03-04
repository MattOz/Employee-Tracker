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
            'Add employee',
            'Update role'
            // 'Exit'
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
        choices: [
            {name: 'Professor', value: 1},
            {name: 'Assistant', value: 2},
            {name: 'Lab Technician', value: 3}
        ],// change to accept new roles?
        name: 'addEmployeeRole'
    },
    {
        type: 'input',
        message: 'Enter employee manger ID',
        name: 'addEmployeeManagerId'
    },
];

const updateRoleQuestion = [
    {
        type: 'list',
        message: 'Select employee',
        choices: getEmployeeList(),
        name: 'selectEmployee'
    },
    {
        type: 'input',
        message: 'Enter new role',
        name: 'updateRole'
    }
];

function getEmployeeList() {
    let currEmployees = []
    db.query('SELECT id FROM employee', function (err, results) {
        results.forEach(element => {
            currEmployees.push(element.id)
        });
    });
    return currEmployees;
}

function init() {
    startingQuestion();
};

function startingQuestion() {
    inquirer.prompt(initialQuestion)
    .then((response) => {
    switch (response.initialQuestion) {

        case "View all departments":
            viewDepartments();
            break;

        case "View all roles":
            viewRoles();
            break;

        case "View all employees":
            viewEmployees();
            break;

        case "Add department":
            addDepartment();
            break;

        case "Add role":
            addRole();
            break;

        case "Add employee":
            addEmployee();
            break;

        case "Update role":
            updateRole();
            break;

        // case "Exit":
        // exitApp();
    }
    });
};

function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        startingQuestion();
    });
};


function viewRoles() {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results);
        startingQuestion();
    });
};

function viewEmployees() {
    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results);
        startingQuestion();
    });
};

function addDepartment() {
    inquirer
    .prompt(addDepartmentQuestion)
    .then((response) => {
        db.query(`INSERT INTO department (department_name) VALUES ("${response.addDepartment}")`, function (err, results) {
            if (err) throw err;
        });
        console.log(`Added department`)
        startingQuestion();
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
        startingQuestion();
    })
};

function addEmployee() {
    inquirer
    .prompt(addEmployeeQuestion)
    .then((response) => {
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [response.addEmployeeFirstName, response.addEmployeeLastName, response.addEmployeeRole, response.addEmployeeManagerId], function (err, results) {
            if (err) throw err;
        });
        console.log(`Added role`)
        startingQuestion();
    })
};

function updateRole() {
    inquirer
    .prompt(updateRoleQuestion)
    .then((response) => {
        // let roleId = response.updateRole
        // let employeeId = response.selectEmployee
        db.query("UPDATE employee set role_id = ? where id = ?;", [response.updateRole, response.selectEmployee], function (err, results) {
            // if (err) throw err;
            console.log(err)
        });
        console.log(`Updated role`)
        startingQuestion();
    }
)};

// function exitApp() {
//     return
// };

init();