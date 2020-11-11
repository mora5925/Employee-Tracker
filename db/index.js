
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Paviliondv731$",
    database: "employees"
});


connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    const logoText = logo({ name: "Employee Manager" }).render();
    console.log(logoText);
    loadPrompts();
}

function loadPrompts() {
    inquirer
    .prompt({
            name: "mainMenu",
            type: "list",
            message: "How would you like to do ?",
            choices: ["View All Employees", "Add Employees", "Update Employee Role", "Remove employee", "Exit"]
                })
                .then(function (answer) {
                    if (answer.mainMenu === "View All Employees") {
                      viewAll();
                    }
                    else if (answer.mainMenu === "Add Employees") {
                      roleInformation();
                    }
                    else if (answer.mainMenu === "Remove employee") {
                      employeeInforomation();
                    }
                    else if (answer.mainMenu === "Update Employee Role") {
                      updateRole();
                    }
                    else if (answer.mainMenu === "Exit") {
                      connection.end();
                    }
                    else {
                      connection.end();
                    }
                  });
              }

              function addEmployees(roleInformationChoices) {
                inquirer
                  .prompt([
                    {
                      type: "input",
                      name: "first_name",
                      message: "What is the employee's first name?"
                    },
                    {
                      type: "input",
                      name: "last_name",
                      message: "What is the employee's last name?"
                    },
                    {
                      type: "list",
                      name: "roleId",
                      message: "What is the employee's role?",
                      choices: roleInformationChoices
                    },
                  ])
                  .then(function (answer) {
              
                    var query = `INSERT INTO employee SET ?`
                    connection.query(query,
                      {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: answer.roleId,
                        manager_id: answer.managerId,
                      },
                      function (err, res) {
                        if (err) throw err;
                        console.log("Employee Inserted successfully!\n");
              
                        loadPrompts();
                      });
                  });
              }

function addDepartment() {
    inquirer.prompt(
        {
            type: "input",
            name: "department",
            message: "What department would you like to add?"
        }
    ).then(answers => {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: answers.department
            },
            function (err) {
                if (err) throw err;
                console.log("Added deparment successfully!");
                loadPrompts();
            }
        )
    })
}

function addRole() {
    inquirer.prompt([
        {
            input: "input",
            name: "role",
            message: "What role would you like to add?",
        },
        {
            input: "input",
            name: "salary",
            message: "How much does this role make?",
        },
        {
            input: "input",
            name: "id",
            message: "What is the ID for this role?",
        }
    ]).then(answers => {
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: answers.role,
                salary: answers.salary,
                department_id: answers.id
            },
            function (err) {
                if (err) throw err;
                console.log("Added role successfully!");
                loadPrompts();
            }
        )
    })
}
function updateEmployeeRole() {
    let query = "SELECT * FROM employee LEFT JOIN role ON role.id = employee.role_id";

    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer.prompt([

            {
                type: "list",
                name: "employee",
                message: "For which employee would you like to change roles?",
                choices: nameArr
            },
            {
                type: "list",
                name: "role",
                message: "What role would you like to give to this employee?",
                choices: roleArr
            }
        ]).then(answers => {
            getRoleId(answers.role, answers.employee);
        })
    })
}

function viewDepartments() {
    console.log(("view department"));
    connection.query(
        "SELECT name FROM department",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            loadPrompts();
        })


}
function viewEmployees() {
    console.log(("view employees"));
    connection.query(
        "SELECT * FROM employee",
        function (err, res) {
            if (err) throw err;
            console.table(res);

            loadPrompts();
        })
}
function viewRoles() {
    console.log(("view Role"));
    connection.query(
        "SELECT title FROM role",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            loadPrompts();
        })
}

function getRoleId(role, employee) {
    connection.query("SELECT id FROM role WHERE title = ?", [role],
        function (err, res) {
            if (err) throw err;
            roleId = res[0].id;
            updateRole(employee);
        })
}

function updateRole(employee) {
    connection.query(
        "UPDATE employee SET role_id = ? WHERE first_name = ?",
        [roleId, employee],
        function (err) {
            if (err) throw err;
            console.log("Added role successfully!");
            loadPrompts();
        }
    )
}

function getManagerId(employee) {
    connection.query("SELECT id FROM employee WHERE first_name = ?", [employee],
        function (err, res) {
            if (err) throw err;
            managerId = res[0].id;
        })
}

function getRoles() {
    connection.query("SELECT * FROM role",
        function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                roleArr.push(res[i].title);
            }
        })
}

function getEmployees() {
    connection.query("SELECT * FROM employee",
        function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                nameArr.push(res[i].first_name);
            }
        })
}