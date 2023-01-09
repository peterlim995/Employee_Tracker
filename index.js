const inquirer = require('inquirer');
const logo = require('asciiart-logo');
// const config = require('./package.json');
const cTable = require('console.table');
const db = require('./db/connection');
const EmployeeTracker = require('./db');
// const questions = require('./db/prompt');


// EmployeeTracker Class 
const employeeTracker = new EmployeeTracker(db);

initApp();

function initApp() {
    // Logo Prompt
    // console.log(logo(config).render());
    console.log(logo({ name: "Employee Manager" }).render());

    menu();
}



// Prompt the menu
async function menu() {

    try {
        const answer = await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'todo',
                    message: 'What would you like to do?',
                    choices: [
                        {
                            name: 'View All Employees',
                            value: 1
                        },
                        {
                            name: 'Add Employee',
                            value: 2
                        },
                        {
                            name: 'Update Employee Role',
                            value: 3
                        },
                        {
                            name: 'View All Roles',
                            value: 4
                        },
                        {
                            name: 'Add Role',
                            value: 5
                        },
                        {
                            name: 'View All Departments',
                            value: 6
                        },
                        {
                            name: 'Add Department',
                            value: 7
                        },
                        {
                            name: 'Update employee manager',
                            value: 8
                        },
                        {
                            name: 'View employees by manager',
                            value: 9
                        },
                        {
                            name: 'View employees by department',
                            value: 10
                        },
                        {
                            name: 'Delete department',
                            value: 11
                        },
                        {
                            name: 'Delete role',
                            value: 12
                        },
                        {
                            name: 'Delete employee',
                            value: 13
                        },
                        {
                            name: 'View total utilized budget of department',
                            value: 14
                        },
                        {
                            name: 'Quit',
                            value: 0
                        }
                    ]
                }
            ]);

        const { todo } = answer;
        switch (todo) {
            case 1:
                viewAllEmployees();
                break;
            case 2:
                addEmployee();
                break;
            case 3:
                updateEmployeeRole();
                break;
            case 4:
                viewAllRole();
                break;
            case 5:
                addRole();
                break;
            case 6:
                viewAllDepartments();
                break;
            case 7:
                addDepartment();
                break;
            case 8:
                updateEmployeeManager();
                break;
            case 9:
                viewEmployeesByManager();
                break;
            case 10:
                viewEmployeesByDepartment();
                break;
            case 11:
                deleteDepartment();
                break;
            case 12:
                deleteRole();
                break;
            case 13:
                deleteEmployee();
                break;
            case 14:
                departmentBudget();
                break;
            case 0:
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
                result.manager = await employeeTracker.employeeName(result.manager);
            }
        }

        console.table('\n', results);

        // const employee = results.map(async (result) => {
        //     if (result.manager) {
        //         result.manager = await employeeTracker.employeeName(result.manager);
        //     }
        //     return result;
        // })

        // console.table('\n', employee);
        menu();
    }
    catch (err) {
        console.error(err)
    }

}

// Role title list return
async function roleList() {
    const role = await employeeTracker.viewRole();
    return role.map(result => {
        return {
            name: result.title,
            value: {
                id: result.id,
                title: result.title
            }
        }

    });
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
                name: 'managerId',
                message: `Who is the employee's manager?`,
                choices: [
                    {
                        name: 'None',
                        value: -1
                    }, ...managerNames
                ],
            },
        ]);

        // console.log("answer: ", answer);

        const { firstname, lastname, role, managerId } = answer;

        // const roleId = await employeeTracker.roleIdbyTitle(role);
        let results;

        // if No manager
        if (managerId === -1) {
            results = await employeeTracker.createEmployee([firstname, lastname, role.id]);
        } else {
            results = await employeeTracker.createEmployee([firstname, lastname, role.id, managerId]);
        }

        console.log('\n', results);
        menu();

    } catch (err) {
        console.error(err)
    }

}

// return array object of employee's full name and id
async function employeeList() {
    const employees = await employeeTracker.viewEmployee();
    return employees.map(result => {
        return {
            name: result.first_name + ' ' + result.last_name,
            value: result.id
        }
    });
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
                name: 'employeeId',
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


        const { employeeId, role } = answer;

        // const roleId = await employeeTracker.roleIdbyTitle(role);
        const results = await employeeTracker.updateEmployee([role.id, employeeId]);
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
    return department.map(result => {
        return {
            name: result.name,
            value: {
                id: result.id,
                name: result.name
            }
        }
    }
    );
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
        // const departmentId = await employeeTracker.departmentIdbyName(department);
        const results = await employeeTracker.createRole([role, salary, department.id])
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

// Update Employee Manager
async function updateEmployeeManager() {
    try {

        const employees = await employeeList();

        const chosenEmployee = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: `Which employee\'s manager do you want update?`,
                choices: employees,
            },
        ]);

        const { employeeId } = chosenEmployee;

        const managerNames = employees.filter(result => result.value != employeeId);

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'managerId',
                message: `Who is the employee's manager?`,
                choices: [
                    {
                        name: 'None',
                        value: -1
                    }, ...managerNames
                ],
            },
        ]);

        const { managerId } = answer;

        const result = await employeeTracker.updateManager([managerId, employeeId]);
        console.log(result);
        menu();

    } catch (err) {
        console.error(err)
    }
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

    // create object of Manager full name and id
    for (let i = 0; i < employeeIdList.length; i++) {
        employeeList.push({
            name: await employeeTracker.employeeName(employeeIdList[i]),
            value: employeeIdList[i]
        });
    }
    return employeeList;
}


// View employees by manager
async function viewEmployeesByManager() {
    try {
        const managers = await managerList();

        const chosenManager = await inquirer.prompt([
            {
                type: 'list',
                name: 'managerId',
                message: `Which manager's employees do you want to see?`,
                choices: managers,
            },
        ]);

        const { managerId } = chosenManager;

        const results = await employeeTracker.viewEmployeeByManager(managerId);

        console.table('\n', results);

        menu();

    } catch (err) {
        console.error(err)
    }

}

// View employees by department
async function viewEmployeesByDepartment() {
    try {
        const departList = await departmentList();

        const chosenDepartment = await inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: `Which department employees do you want to see?`,
                choices: departList,
            },
        ]);

        const { department } = chosenDepartment;

        const results = await employeeTracker.viewEmployeeByDepartment(department.id);

        if (results.length !== 0) {
            console.table('\n', results);
        } else {
            console.log(`There is no employee in the department`);
        }
        menu();

    } catch (err) {
        console.error(err)
    }

}

// Delete Department
async function deleteDepartment() {
    try {
        const departList = await departmentList();

        const chosenDepartment = await inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: `Which department do you want to delete?`,
                choices: departList,
            },
        ]);

        const { department } = chosenDepartment;

        const results = await employeeTracker.deleteDepartment(department.id);

        console.log(results);

        menu();

    } catch (err) {
        console.error(err)
    }

}

// Delete role
async function deleteRole() {
    try {
        const rolelist = await roleList();

        const chosenRole = await inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: `Which role do you want to delete?`,
                choices: rolelist,
            },
        ]);

        const { role } = chosenRole;

        const results = await employeeTracker.deleteRole(role.id);

        console.log(results);

        menu();

    } catch (err) {
        console.error(err)
    }

}

// Delete Employee
async function deleteEmployee() {
    try {
        const employees = await employeeList();

        const chosenEmployee = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: `Which employee do you want to delete?`,
                choices: employees,
            },
        ]);

        const { employeeId } = chosenEmployee;

        const results = await employeeTracker.deleteEmployee(employeeId);

        console.log(results);

        menu();

    } catch (err) {
        console.error(err)
    }

}


// View total utilized budget of a department 
async function departmentBudget() {
    try {

        const departList = await departmentList();

        const chosenDepartment = await inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: `Which department budget do you want to see?`,
                choices: departList,
            },
        ]);

        const { department } = chosenDepartment;

        const results = await employeeTracker.departmentBudget(department.id);

        if(results.length === 0){
            results.push({
                Department: department.name,
                "Total Utilized Budget": 0
            })
            console.table('\n', results);
        } else{
            console.table('\n', results);
        }
        
        

        menu();

    } catch (err) {
        console.error(err)
    }

}


// Finish the program
function quit() {
    console.log("\nGoodbye!");
    process.exit(0);
}

