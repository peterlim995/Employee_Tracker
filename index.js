const inquirer = require('inquirer');
const logo = require('asciiart-logo');
const config = require('./package.json');
const cTable = require('console.table');
const db = require('./db/connection');
const EmployeeTracker = require('./db');
// const questions = require('./db/prompt');

// Logo Prompt
console.log(logo(config).render());

// EmployeeTracker Class 
const employeeTracker = new EmployeeTracker(db);

// Prompt the menu
async function menu() {

    try {
        const answer = await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'todo',
                    message: 'What would you like to do?',
                    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
                },
            ]);

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
    }
    catch (err) {
        console.error(err)
    }
}


// Show all Employees
async function viewAllEmployees() {

    try {
        const results = await employeeTracker.viewEmployee();

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result.manager) {
                result.manager = await employeeTracker.getManagerId(result.manager);
            }
        }
        console.table('\n', results);
        menu();
    }
    catch (err) {
        console.error(err)
    }

}

// Role title list return
async function roleList() {
    const role = await employeeTracker.viewRole();
    return role.map(result => result.title);
}

// Manager's full name list return
async function managerList() {

    // employee table receive
    const employee = await employeeTracker.viewEmployee();
    const employeeList = [];

    // employee id list
    const employeeIdList = [];

    // remove duplicate id
    employee.filter(result => result.manager != null).forEach(result => {
        if (employeeIdList.indexOf(result.manager) === -1)
            employeeIdList.push(result.manager);
    });

    // create Manager full name list
    for (let i = 0; i < employeeIdList.length; i++) {
        employeeList.push(await employeeTracker.getManagerId(employeeIdList[i]));
    }
    return employeeList;
}


// Add employee
async function addEmployee() {

    try {
        const titles = await roleList();
        const managerNames = await employeeList();

        const answer = await inquirer.prompt([
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
                choices: titles,
            },
            {
                type: 'list',
                name: 'manager',
                message: `Who is the employee's manager?`,
                choices: ['None', ...managerNames],
            },
        ]);

        const { firstname, lastname, role, manager } = answer;


        const roleId = await employeeTracker.roleIdbyTitle(role);
        let results;

        // if No manager
        if (manager === 'None') {
            results = await employeeTracker.createEmployee([firstname, lastname, roleId]);
        } else {
            const managerId = await employeeTracker.employeeIdByFullName(manager);
            results = await employeeTracker.createEmployee([firstname, lastname, roleId, managerId]);
        }

        console.log('\n', results);
        menu();

    } catch (err) {
        console.error(err)
    }

}

// return employee's full name list array
async function employeeList() {
    const employees = await employeeTracker.viewEmployee();
    return employees.map(result => result.first_name + ' ' + result.last_name);
}

// Update Employee Role
async function updateEmployeeRole() {

    try {
        // employee's full name array
        const employees = await employeeList();
        // role title list array
        const titles = await roleList();

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeName',
                message: `Which employee's role do you want to update?`,
                choices: employees,
            },
            {
                type: 'list',
                name: 'role',
                message: `Which role do you want to assign the selected employee?`,
                choices: titles,
            },
        ]);

        const { employeeName, role } = answer;
        const name = employeeName.split(' ');
        const first_name = name[0];
        const last_name = name[1];

        const roleId = await employeeTracker.roleIdbyTitle(role);
        const results = await employeeTracker.updateEmployee([roleId, first_name, last_name])
        console.log('\n', results);
        menu();

    } catch (err) {
        console.error(err)
    }

}

// View all role
async function viewAllRole() {

    try {
        const results = await employeeTracker.viewRole();
        console.table('\n', results);
        menu();
    }
    catch (err) {
        console.error(err)
    }
}

// return array of department name
async function departmentList() {
    const department = await employeeTracker.viewDepartment()
    return department.map(result => result.name);
}

// Add Role
async function addRole() {

    try {
        const departList = await departmentList();
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
                validate(value) {
                    if (typeof parseInt(value) === 'number' && value >= 0)
                        return true;
                    return 'Salary must be number and greater than zero';
                }
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to?',
                choices: departList,
            },
        ]);

        const { role, salary, department } = answer;
        const departmentId = await employeeTracker.departmentIdbyName(department);
        const results = await employeeTracker.createRole([role, salary, departmentId])
        console.log('\n', results);
        menu();

    } catch (err) {
        console.error(err)
    }

}

// View all Department
async function viewAllDepartments() {

    try {
        const results = await employeeTracker.viewDepartment();
        console.table('\n', results);
        menu();
    }
    catch (err) {
        console.error(err);
    }
}

// Add Department
async function addDepartment() {

    try {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
            },
        ]);

        const { department } = answer;
        const results = await employeeTracker.createDepartment(department);

        console.log('\n', results);
        menu();
    }
    catch (err) {
        console.error(err)

    }

}

// Finish the program
function quit() {
    console.log("\nGoodbye!");
    process.exit(0);
}


menu();