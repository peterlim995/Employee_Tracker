-- view all department
select * from department;

-- view all roles
SELECT role.id, title, name AS department, salary
FROM role
JOIN department ON role.department_id = department.id;

-- view all employees
SELECT employee.id, first_name, last_name, title, name AS department, salary, 
IF(manager_id != null, CONCAT(first_name,' ',last_name), manager_id) AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;
-- JOIN employee ON employee.manager_id = employee.id;





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