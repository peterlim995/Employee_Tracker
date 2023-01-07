// const db = require('./connection');
// const mysql = require('mysql2');

class EmployeeTracker {
    constructor(db) {
        this.db = db;
    }

    // find all departments
    async viewDepartment() {
        const sql = `select * from department`;
        let result = await this.db.promise().query(sql);
        return result[0];
    }

    
    // find all roles - join with departments to diplay department names
    async viewRole() {
        const sql = `SELECT role.id, title, name AS department, salary
        FROM role
        JOIN department ON role.department_id = department.id`;
        let result = await this.db.promise().query(sql);
        return result[0];
    }

    // find all employees, join with roles and departments to display their roles, salaries, departments, and managers
    async viewEmployee() {
        const sql = `SELECT employee.id AS id, first_name, last_name, title, name AS department, salary, manager_id AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id;`;
        let result = await this.db.promise().query(sql);
        return result[0];
    }


    // create a new department - takes in department object as input parameter
    async createDepartment(department) {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        let result = await this.db.promise().query(sql, department);
        return `Added ${department} to the database`;
    }

    // create a new role - takes in role object as input parameter
    async createRole(role) {
        const sql = `INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`;
        let result = await this.db.promise().query(sql, role);
        return `Added ${role[0]} to the database`;
    }

    // create a new employee - takes employee object as input parameter
    async createEmployee(employee) {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
        VALUES (?,?,?,?)`;
        let result = await this.db.promise().query(sql, employee);
        return `Added ${employee[0]} ${employee[1]} to the database`;
    }

    // update employee's role - takes employee id and role id as input parameters
    async updateEmployee(employee) {
        const sql = `UPDATE employee SET role_id = ? where first_name = ? and last_name = ?`;
        let result = await this.db.promise().query(sql, employee);
        return `Updated employee's role`;
    }

    // return manager's full name by id
    async getManagerId(id) {
        const sql = `select first_name, last_name from employee where id = ?`;
        let result = await this.db.promise().query(sql, id);
        const { first_name, last_name } = result[0][0];
        // console.log("result: ", result);
        return first_name + ' ' + last_name;
    }

    // update employee's role - takes employee id and role id as input parameters
    async departmentIdbyName(name) {
        const sql = `SELECT id 
        FROM department
        WHERE name = ?`;
        let result = await this.db.promise().query(sql, name);
        const { id } = result[0][0];
        return id;
    }
}


module.exports = EmployeeTracker;