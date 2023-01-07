-- view all department
select * from department;

-- view all roles
SELECT role.id, title, name AS department, salary
FROM role
JOIN department ON role.department_id = department.id;

-- view all employees
SELECT employee.id AS id, first_name, last_name, title, name AS department, salary, manager_id AS manager
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id;

-- select manager's first name and last name
select first_name, last_name from employee where id = ?;

-- insert new department name
INSERT INTO department (name) VALUES ('?');

-- select name of department
SELECT name from department;


-- select id of department by name
SELECT id 
FROM department
WHERE name = ?

-- select id of employee





SELECT employee.id AS id, first_name, last_name, title, name AS department, salary, 
IF(manager_id != null, CONCAT(first_name,' ',last_name), manager_id) AS manager
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id;



SELECT department, COUNT(id) AS number_courses
FROM course_names
GROUP BY department;

SELECT department, SUM(total_enrolled) AS sum_enrolled
FROM course_names
GROUP BY department;

SELECT *
FROM course_names
JOIN department ON course_names.department = department.id;


SELECT SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section