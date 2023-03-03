INSERT INTO department (employee_name)
VALUES ("Computer Science"),
       ("Psychology"),
       ("Biology");

INSERT INTO role (title, salary, department_id)
VALUES ("Professor", 100000, 1),
       ("Assistant", 80000, 2),
       ("Lab Technician", 150000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Brad", "Pitt", 1),
       ("Matt", "Damon", 2),
       ("Shia", "LaBeouf", 3);