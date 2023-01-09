
class EmployeeTracker {
    constructor(db) {
        this.db = db;
    }

    // find all departments
    async viewDepartment() {
        const sql = `select * from department order by name`;
        let result = await this.db.promise().query(sql);
        return result[0];
    }


    // find all roles - join with departments to diplay department names
    async viewRole() {
        const sql = `SELECT role.id, title, name AS department, salary
        FROM role
        LEFT JOIN department ON role.department_id = department.id`;
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
        const sql2 = `INSERT INTO employee (first_name, last_name, role_id) 
        VALUES (?,?,?)`;
        if (employee.length === 3) {
            await this.db.promise().query(sql2, employee);
        } else {
            await this.db.promise().query(sql, employee);
        }

        return `Added ${employee[0]} ${employee[1]} to the database`;
    }

    // update employee's role - takes employee id and role id as input parameters
    async updateEmployee(employeeId) {
        const sql = `UPDATE employee SET role_id = ? where id = ?`;
        let result = await this.db.promise().query(sql, employeeId);
        return `Updated employee's role`;
    }

    // return employee's full name by id
    async employeeName(employeeId) {
        const sql = `select first_name, last_name from employee where id = ?`;
        let result = await this.db.promise().query(sql, employeeId);
        const { first_name, last_name } = result[0][0];
        // console.log("result: ", result);
        return first_name + ' ' + last_name;
    }

    // update Managger - takes employee id and manager id as input parameters
    async updateManager(update) {
        const sql = `UPDATE employee SET manager_id = ? where id = ?`;
        let result = await this.db.promise().query(sql, update);
        return `Updated Manager`;
    }

    // view Employees by manager - take manager id as input parameter
    async viewEmployeeByManager(managerId) {
        const sql = `SELECT employee.id, first_name, last_name, title, name as department,  salary 
        FROM employee        
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        WHERE manager_id = ?;`;
        let result = await this.db.promise().query(sql, managerId);
        return result[0];
    }

    // view Employees by department - take manager id as input parameter
    async viewEmployeeByDepartment(departmentId) {
        const sql = `SELECT employee.id AS id, employee.first_name, employee.last_name, title, name AS department, salary, CONCAT(em.first_name, ' ', em.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee em ON em.id = employee.manager_id
        WHERE department_id = ?;`;
        let result = await this.db.promise().query(sql, departmentId);
        return result[0];
    }


    // Delete department - takes department id as input parameters
    async deleteDepartment(departmentId) {
        const sql = `DELETE FROM department WHERE id = ?;`;
        let result = await this.db.promise().query(sql, departmentId);
        return `Delete the department`;
    }

    // Delete role - takes role id as input parameters
    async deleteRole(roleId) {
        const sql = `DELETE FROM role WHERE id = ?;`;
        let result = await this.db.promise().query(sql, roleId);
        return `Delete the role`;
    }

    // Delete employee - takes employee id as input parameters
    async deleteEmployee(employeeId) {
        const sql = `DELETE FROM employee WHERE id = ?;`;
        let result = await this.db.promise().query(sql, employeeId);
        return `Delete the employee`;
    }

    // total utilized budget of a department 
    async departmentBudget(departmentId) {
        const sql = `SELECT name AS Department, SUM(salary) AS "Total Utilized Budget"
        FROM employee        
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        WHERE department.id = ?
        GROUP BY department;`;
        let result = await this.db.promise().query(sql, departmentId);
        return result[0];
    }

}

module.exports = EmployeeTracker;