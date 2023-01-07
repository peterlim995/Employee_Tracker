const inquirer = require('inquirer');
const mysql = require('mysql2');
const logo = require('asciiart-logo');
const config = require('./package.json');
const cTable = require('console.table');
const e = require('express');
const db = require('./db/connection');
const EmployeeTracker = require('./db')


console.log(logo(config).render());

const employeeTracker = new EmployeeTracker(db);

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

    employeeTracker.viewEmployee()
        .then(async results => {
            for(let i = 0; i < results.length; i++){
                const result = results[i];
                if(result.manager){
                    result.manager =  await employeeTracker.getManagerId(result.manager);
                }
            }
            console.table('\n', results);
            menu();            
        })
        .catch(err =>
            console.error(err)
        );           
}


function roleList() {
    return ['Sales Lead', 'Salesperson'];
}

function managerList() {
    return ['John Doe', 'Mike Chan'];
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstname',
                message: `What is the employee's first name?`,
            },
            {
                type: 'input',
                name: 'lastname',
                message: `What is the employee's last name?`,
            },
            {
                type: 'list',
                name: 'role',
                message: `What is the employee's role?`,
                choices: roleList(),
            },
            {
                type: 'list',
                name: 'manager',
                message: `Who is the employee's manager?`,
                choices: managerList(),
            },
        ])
        .then(answer => {
            const { firstname, lastname, role, manager } = answer;

            employeeTracker.createEmployee([firstname, lastname, 2, 2])
                .then(results => {
                    console.log('\n', results);
                    menu();
                })
                .catch(err =>
                    console.error(err)
                );
        })
}

function employeeList() {
    return ['John Doe', 'Mike Chan'];
}

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'employeeName',
                message: `Which employee's role do you want to update?`,
                choices: employeeList(),
            },
            {
                type: 'list',
                name: 'role',
                message: `Which role do you want to assign the selected employee?`,
                choices: roleList(),
            },
        ])
        .then(answer => {
            const { employeeName, role } = answer;
  
            employeeTracker.updateEmployee([2, 'John', 'Doe'])
                .then(results => {
                    console.log('\n', results);
                    menu();
                })
                .catch(err =>
                    console.error(err)
                );
        })
}

function viewAllRole() {

    employeeTracker.viewRole()
        .then(results => {
            console.table('\n', results);
            menu();
        })
        .catch(err =>
            console.error(err)
        );
}

// return array of department name
async function departmentList() {
    let department = await employeeTracker.viewDepartment()
    // console.log(department);
    return department.map(result => result.name)
    // return ['Sales', 'Engineering'];
}


// Add Role
async function addRole() {

    let departList = await departmentList();
    // console.log("call: ", departList);
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to?',                
                choices: departList,
            },
        ])
        .then(async answer => {
            const { role, salary, department } = answer;

            try {
            const departmentId = await employeeTracker.departmentIdbyName(department);

            const results = await employeeTracker.createRole([role, salary, departmentId])
            
            console.log('\n', results);
                    menu();
            
            } catch(err) { 
                    console.error(err)
            }
        })
}

// View all Department
function viewAllDepartments() {

    employeeTracker.viewDepartment()
        .then(results => {
            console.table('\n', results);
            menu();
        })
        .catch(err =>
            console.error(err)
        );        
}

// Add Department
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
            },
        ])
        .then(answer => {
            const { department } = answer;
            employeeTracker.createDepartment(department)
                .then(results => {
                    console.log('\n', results);
                    menu();
                })
                .catch(err =>
                    console.error(err)
                );
        })

}

// Finish the program
function quit() {
    console.log("\nGoodbye!");
    process.exit(0);
}

function test() {
    return new Promise((rs, rj) => {
        rs('Peter Lim');
    });
}

menu();