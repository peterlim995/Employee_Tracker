const inquirer = require('inquirer');
const mysql = require('mysql2');
const logo = require('asciiart-logo');
const config = require('./package.json');
const cTable = require('console.table');
const e = require('express');


console.log(logo(config).render());



const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employee_db'
    },
    // console.log(`Connected to the employee_db database.`)
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
    const sql = `SELECT employee.id AS id, first_name, last_name, title, name AS department, salary, manager_id AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id;`;

    let employee;

    db.promise().query(sql)
        .then(results =>
            managerName(results)
        )
        .catch(err =>
            console.error(err)
        );

    // console.log(results[0][0].manager);
    // employee = results;})

    // return results[0].map(table => {
    //     if (table.manager) {
    // let manager;
    // const promise1 = Promise.resolve(managerName(table.manager));

    // promise1.then(value => {
    //     table.manager = value;
    // })


    // test().then(result => table.manager = result);
    // console.log(table.manager);
    // managerName(table.manager)
    //     .then(result => table.manager = result);
    // .then(() => table.manager = manager);
    // table.manager = manager

    // table.manager = managerName(table.manager);

    //             // table.manager = await managerName(table.manager);
    //         }
    //         return table;
    //     });

    //     // return result;
    // })
    // .then(result => {
    //     console.table('\n', result);
    //     // managerName(2);
    //     menu();
    // })

    // .catch(err =>
    //     console.error(err)
    // );

    // // employee[0].map(table => {
    // for(let i=0; i<employee[0].length; i++){
    //     if (employee[0][i].manager) {
    //         employee[0][i].manager = await managerName(employee[0][i].manager);
    //     }
    // }

    // console.table('\n', employee[0]);
    // menu();

    // })
}

function addEmployee() {
    menu();
}

function updateEmployeeRole() {
    menu();
}

function viewAllRole() {

    const sql = `SELECT role.id, title, name AS department, salary
    FROM role
    JOIN department ON role.department_id = department.id`;

    db.promise().query(sql)
        .then(results => {
            console.table('\n', results[0]);
            menu();
        })
        .catch(err =>
            console.error(err)
        );

}

// return array of department name
function departmentList(){
    const sql = `SELECT name from department;`;

    // let departmentList;
    db.query(sql, (err,results) => {
        if(err)
            console.error(err);
        // console.log("result: ",results);
        return new Promise((resolve, reject) => resolve(results));
    });
        
    // return departmentList;    
}


async function addRole() {

    let departList = await departmentList();
    console.log("call: ",departList);
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
                choices: ['gdg','dgsdg'],
            },
        ])
        .then(answer => {
            const { role, salary, department } = answer;
            const sql = `INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`;
            // console.log("call: ",departList);

            db.promise().query(sql, [role, salary, 2])
                .then(results => {
                    console.log(`Added ${role} to the database`);
                    menu();
                })
                .catch(err =>
                    console.error(err)
                );
        })

}

function viewAllDepartments() {

    const sql = `select * from department`;

    db.promise().query(sql)
        .then(results => {
            console.table('\n', results[0]);
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
            const sql = `INSERT INTO department (name) VALUES (?)`;

            db.promise().query(sql, department)
                .then(results => {
                    console.log(`Added ${department} to the database`);
                    menu();
                })
                .catch(err =>
                    console.error(err)
                );
        })

}

function quit() {
    console.log("\nGoodbye!");
    process.exit(0);
}

function test() {
    return new Promise((rs, rj) => {
        rs('Peter Lim');
    });
}


function managerName(employee) {

    const table = employee[0];

    const newTable = new Promise((resolve, reject) => {
        for (let i = 0; i < table.length; i++) {
            if (table[i].manager) {

                const sql = `select first_name, last_name from employee where id = ?`;
                db.promise().query(sql, table[i].manager)
                    .then(results => {
                        const { first_name, last_name } = results[0][0];
                        return first_name + ' ' + last_name;
                    })
                    .then(manager => table[i].manager = manager)
                    .catch(err => {
                        console.error(err);

                    }
                    );

            }
        }
        resolve();
    })

    newTable.then(() => {
        console.table('\n', table);
        menu();
    })



    // const sql = `select first_name, last_name from employee where id = ?`;

    // let name;
    // db.promise().query(sql, id)
    //     .then(results => {
    //         const { first_name, last_name } = results[0][0];
    //         // console.log("Name: ", first_name, last_name);
    //         name = first_name + ' ' + last_name;
    //         console.log("Name: ", name);
    //         // resolve(name);
    //         // return new Promise((resolve, reject) => resolve(name));
    //     })
    //     .catch(err => {
    //         console.error(err);
    //         // reject(null);
    //         // return new Promise((resolve, reject) => resolve(null));
    //     }
    //     );

    // return new Promise((resolve, reject) => resolve(name));
    // let name;

    // db.query(sql, id, (err, result) => {
    //     if(err){
    //         console.error(err);
    //         return new Promise((r,j) => r(null));
    //     }

    //     const { first_name, last_name } = result[0][0];
    //     // console.log("Name: ", first_name, last_name);
    //     name = first_name + ' '+last_name;
    //     console.log("Name: ", name);

    // });

    // return new Promise((r,j) => r(name));
}
// });

menu();