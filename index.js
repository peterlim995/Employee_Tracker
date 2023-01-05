const inquirer = require('inquirer');
const mysql = require('mysql2');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);


// Prompt the menu
function menu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'todo',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Role', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
            },
        ])
        .then(answer => {
            const { todo } = answer;
            switch (todo) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Role':
                    viewAllRole();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    quit();
                    break;
            }
        })
}

function viewAllEmployees() {
    menu();
}

function addEmployee() {
    menu();
}

function updateEmployeeRole() {
    menu();
}

function viewAllRole() {
    menu();
}

function addRole() {
    menu();

}

function viewAllDepartments() {

    db.promise().query('select * from department')
        .then(results => {
            console.log(results[0]);
            menu();
        })
        .catch(err =>
            console.error(err)
        );

    
}

function addDepartment() {

    menu();
}

function quit() {
    console.log("\nGoodbye!");
    process.exit(0);
}

menu();