import React, { useState } from 'react';
import { Button } from '../components/ui/button';

const SampleProblems = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const problems = [
    {
      id: 1,
      title: "List all departments",
      description: "List all departments from the departments table.",
      hint: "Use a simple SELECT statement with * to retrieve all columns",
      solution: "SELECT * FROM departments;",
      difficulty: "easy"
    },
    {
      id: 2,
      title: "Employee Names",
      description: "List all employees showing only their first and last names.",
      hint: "Select only the first_name and last_name columns from the employees table",
      solution: "SELECT first_name, last_name FROM employees;",
      difficulty: "easy"
    },
    {
      id: 3,
      title: "Department Info",
      description: "Retrieve the name and location from the departments table.",
      hint: "Use a simple SELECT statement with specific columns",
      solution: "SELECT name, location FROM departments;",
      difficulty: "easy"
    },
    {
      id: 4,
      title: "Employee Positions",
      description: "Retrieve the full names and positions of every employee.",
      hint: "Use string concatenation or select multiple columns",
      solution: "SELECT first_name, last_name, position FROM employees;",
      difficulty: "easy"
    },
    {
      id: 5,
      title: "Employee Salaries",
      description: "Retrieve each employee's salary from the employees table.",
      hint: "Select the salary column along with identifier columns",
      solution: "SELECT id, first_name, last_name, salary FROM employees;",
      difficulty: "easy"
    },
    {
      id: 6,
      title: "Project Dates",
      description: "List the start and end dates for every project.",
      hint: "Select the start_date and end_date columns from the projects table",
      solution: "SELECT name, start_date, end_date FROM projects;",
      difficulty: "easy"
    },
    {
      id: 7,
      title: "Project Names",
      description: "List only the names of all projects.",
      hint: "Select only the name column from the projects table",
      solution: "SELECT name FROM projects;",
      difficulty: "easy"
    },
    {
      id: 8,
      title: "Addresses Overview",
      description: "Display all addresses with their city, state, and zip code.",
      hint: "Select the city, state, and zip columns from the addresses table",
      solution: "SELECT city, state, zip FROM addresses;",
      difficulty: "easy"
    },
    {
      id: 9,
      title: "Engineering Employees",
      description: "Retrieve the first and last names of employees working in the Engineering department.",
      hint: "Join the employees and departments tables",
      solution: "SELECT e.first_name, e.last_name FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.name = 'Engineering';",
      difficulty: "easy"
    },
    {
      id: 10,
      title: "Low Salary Employees",
      description: "Retrieve all employees whose salary is below 80000.",
      hint: "Use a WHERE clause with the < comparison operator",
      solution: "SELECT * FROM employees WHERE salary < 80000;",
      difficulty: "easy"
    },
    {
      id: 11,
      title: "Departments with Location",
      description: "List departments that have a location value (not null).",
      hint: "Use a WHERE clause with IS NOT NULL",
      solution: "SELECT * FROM departments WHERE location IS NOT NULL;",
      difficulty: "easy"
    },
    {
      id: 12,
      title: "Recent Hires",
      description: "Retrieve employees who joined after '2023-01-01' based on the created_at column.",
      hint: "Use a WHERE clause with a date comparison",
      solution: "SELECT * FROM employees WHERE created_at > '2023-01-01';",
      difficulty: "easy"
    },
    {
      id: 13,
      title: "Employee & Department Join",
      description: "Join the employees and departments tables to display each employee's full name along with the name of their department.",
      hint: "Use an INNER JOIN between employees and departments tables",
      solution: "SELECT e.first_name, e.last_name, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id;",
      difficulty: "intermediate"
    },
    {
      id: 14,
      title: "Sorted Employee List",
      description: "List employees along with their department names sorted by last name.",
      hint: "Use JOIN with ORDER BY",
      solution: "SELECT e.first_name, e.last_name, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id ORDER BY e.last_name;",
      difficulty: "intermediate"
    },
    {
      id: 15,
      title: "Address Join",
      description: "Retrieve addresses along with the corresponding employee full names by joining the employees and addresses tables.",
      hint: "Join the employees and addresses tables using the employee_id foreign key",
      solution: "SELECT e.first_name, e.last_name, a.address_line1, a.city, a.state, a.zip FROM employees e JOIN addresses a ON e.id = a.employee_id;",
      difficulty: "intermediate"
    },
    {
      id: 16,
      title: "Count Employees per Department",
      description: "Count the number of employees in each department.",
      hint: "Use GROUP BY with the COUNT aggregate function",
      solution: "SELECT d.name, COUNT(e.id) AS employee_count FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.id, d.name;",
      difficulty: "intermediate"
    },
    {
      id: 17,
      title: "Average Salary per Department",
      description: "Calculate the average salary for each department.",
      hint: "Use GROUP BY with the AVG aggregate function",
      solution: "SELECT d.name, AVG(e.salary) AS avg_salary FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.id, d.name;",
      difficulty: "intermediate"
    },
    {
      id: 18,
      title: "Employees on Projects",
      description: "Join the employees, employee_projects, and projects tables to retrieve details of employees working on projects.",
      hint: "Use multiple JOINs across three tables",
      solution: "SELECT e.first_name, e.last_name, p.name AS project_name FROM employees e JOIN employee_projects ep ON e.id = ep.employee_id JOIN projects p ON ep.project_id = p.id;",
      difficulty: "intermediate"
    },
    {
      id: 19,
      title: "Project Employee Count",
      description: "List projects along with the number of employees assigned to each project.",
      hint: "Use JOIN, GROUP BY and COUNT",
      solution: "SELECT p.name, COUNT(ep.employee_id) AS employee_count FROM projects p JOIN employee_projects ep ON p.id = ep.project_id GROUP BY p.id, p.name;",
      difficulty: "intermediate"
    },
    {
      id: 20,
      title: "High Salary Employees",
      description: "Retrieve employees whose salary is above 80000.",
      hint: "Use a WHERE clause with the > comparison operator",
      solution: "SELECT * FROM employees WHERE salary > 80000;",
      difficulty: "intermediate"
    },
    {
      id: 21,
      title: "Employees with Specific Initials",
      description: "List employees whose first name starts with the letter A or B.",
      hint: "Use the LIKE operator with % wildcard or use the OR operator",
      solution: "SELECT * FROM employees WHERE first_name LIKE 'A%' OR first_name LIKE 'B%';",
      difficulty: "intermediate"
    },
    {
      id: 22,
      title: "Departments with >2 Employees",
      description: "Retrieve details of departments that have more than two employees.",
      hint: "Use JOIN, GROUP BY, and HAVING",
      solution: "SELECT d.*, COUNT(e.id) AS employee_count FROM departments d JOIN employees e ON d.id = e.department_id GROUP BY d.id HAVING COUNT(e.id) > 2;",
      difficulty: "intermediate"
    },
    {
      id: 23,
      title: "Employee City",
      description: "Join the employees and addresses tables to display each employee's full name and the city where they reside.",
      hint: "Use JOIN to connect employees with their addresses",
      solution: "SELECT e.first_name, e.last_name, a.city FROM employees e JOIN addresses a ON e.id = a.employee_id;",
      difficulty: "intermediate"
    },
    {
      id: 24,
      title: "2024 Project Starts",
      description: "Retrieve project details for projects that start in the year 2024.",
      hint: "Use the strftime function or LIKE with the date",
      solution: "SELECT * FROM projects WHERE start_date LIKE '2024-%';",
      difficulty: "intermediate"
    },
    {
      id: 25,
      title: "All Employees with Departments",
      description: "List all employees along with their department information, including employees with no department.",
      hint: "Use a LEFT JOIN from employees to departments",
      solution: "SELECT e.first_name, e.last_name, d.name AS department FROM employees e LEFT JOIN departments d ON e.department_id = d.id;",
      difficulty: "intermediate"
    },
    {
      id: 26,
      title: "Detailed Project Assignment",
      description: "Join employees, employee_projects, and projects to retrieve detailed information about employees and their assigned projects.",
      hint: "Use multiple JOINs across three tables with appropriate columns",
      solution: "SELECT e.first_name, e.last_name, p.name AS project_name, p.start_date, p.end_date FROM employees e JOIN employee_projects ep ON e.id = ep.employee_id JOIN projects p ON ep.project_id = p.id;",
      difficulty: "intermediate"
    },
    {
      id: 27,
      title: "Employee Project Count",
      description: "List employees along with the total number of projects they are involved in.",
      hint: "Use JOIN, GROUP BY, and COUNT",
      solution: "SELECT e.first_name, e.last_name, COUNT(ep.project_id) AS project_count FROM employees e LEFT JOIN employee_projects ep ON e.id = ep.employee_id GROUP BY e.id, e.first_name, e.last_name;",
      difficulty: "intermediate"
    },
    {
      id: 28,
      title: "Top Salary per Department",
      description: "For each department, retrieve the employee with the highest salary using a subquery.",
      hint: "Use a correlated subquery with MAX()",
      solution: "SELECT d.name AS department_name, e.first_name, e.last_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.salary = (SELECT MAX(salary) FROM employees WHERE department_id = d.id);",
      difficulty: "hard"
    },
    {
      id: 29,
      title: "Employees with No Project",
      description: "List employees who are not assigned to any project.",
      hint: "Use a LEFT JOIN with IS NULL check, or a NOT EXISTS subquery",
      solution: "SELECT e.* FROM employees e LEFT JOIN employee_projects ep ON e.id = ep.employee_id WHERE ep.employee_id IS NULL;",
      difficulty: "hard"
    },
    {
      id: 30,
      title: "Multiple Project Assignments",
      description: "Retrieve employees who are assigned to more than one project.",
      hint: "Use GROUP BY with HAVING count > 1",
      solution: "SELECT e.first_name, e.last_name, COUNT(ep.project_id) AS project_count FROM employees e JOIN employee_projects ep ON e.id = ep.employee_id GROUP BY e.id HAVING COUNT(ep.project_id) > 1;",
      difficulty: "hard"
    },
    {
      id: 31,
      title: "Department Maximum Salary",
      description: "For each department, display the department name along with the maximum salary among its employees.",
      hint: "Use GROUP BY with MAX()",
      solution: "SELECT d.name, MAX(e.salary) AS max_salary FROM departments d JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name;",
      difficulty: "hard"
    },
    {
      id: 32,
      title: "Average Salary per Project",
      description: "Calculate the average salary for each project by joining the employees, employee_projects, and projects tables.",
      hint: "Use multiple JOINs with GROUP BY and AVG()",
      solution: "SELECT p.name, AVG(e.salary) AS avg_salary FROM projects p JOIN employee_projects ep ON p.id = ep.project_id JOIN employees e ON ep.employee_id = e.id GROUP BY p.id, p.name;",
      difficulty: "hard"
    },
    {
      id: 33,
      title: "Departments with No Employees",
      description: "Identify departments that have no employees using a subquery.",
      hint: "Use a LEFT JOIN with NULL check or a NOT EXISTS subquery",
      solution: "SELECT d.* FROM departments d LEFT JOIN employees e ON d.id = e.department_id WHERE e.id IS NULL;",
      difficulty: "hard"
    },
    {
      id: 34,
      title: "Employee Address Match",
      description: "Retrieve the details of employees who have addresses in the same city as their department's location.",
      hint: "Join employees, departments, and addresses with a WHERE clause comparing cities",
      solution: "SELECT e.first_name, e.last_name, a.city FROM employees e JOIN departments d ON e.department_id = d.id JOIN addresses a ON e.id = a.employee_id WHERE a.city = d.location;",
      difficulty: "hard"
    },
    {
      id: 35,
      title: "Above Company Average Salary",
      description: "List employees whose salary is above the overall company average using a subquery.",
      hint: "Use a subquery to calculate the average salary",
      solution: "SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
      difficulty: "hard"
    },
    {
      id: 36,
      title: "Projects Ended Before Date",
      description: "Retrieve projects that ended before a specific date.",
      hint: "Use a WHERE clause with date comparison",
      solution: "SELECT * FROM projects WHERE end_date < '2024-07-01';",
      difficulty: "hard"
    },
    {
      id: 37,
      title: "Employee Project Count Subquery",
      description: "For each employee, count the number of projects they are assigned to using a subquery.",
      hint: "Use a correlated subquery with COUNT()",
      solution: "SELECT e.first_name, e.last_name, (SELECT COUNT(*) FROM employee_projects ep WHERE ep.employee_id = e.id) AS project_count FROM employees e;",
      difficulty: "hard"
    },
    {
      id: 38,
      title: "Long Last Names",
      description: "List employees whose last name contains more than six characters.",
      hint: "Use the LENGTH() function with a WHERE clause",
      solution: "SELECT * FROM employees WHERE LENGTH(last_name) > 6;",
      difficulty: "hard"
    },
    {
      id: 39,
      title: "Departments with High Average Salary",
      description: "Retrieve departments that have an average employee salary higher than the overall company average using a subquery.",
      hint: "Use GROUP BY with HAVING clause and a subquery",
      solution: "SELECT d.name, AVG(e.salary) AS avg_salary FROM departments d JOIN employees e ON d.id = e.department_id GROUP BY d.id HAVING AVG(e.salary) > (SELECT AVG(salary) FROM employees);",
      difficulty: "hard"
    },
    {
      id: 40,
      title: "Employee View with Project Count",
      description: "Create a view that displays each employee with their department name and the number of projects they are involved in.",
      hint: "Use CREATE VIEW with a subquery for project count",
      solution: "CREATE VIEW employee_summary AS SELECT e.id, e.first_name, e.last_name, d.name as department, (SELECT COUNT(*) FROM employee_projects ep WHERE ep.employee_id = e.id) as project_count FROM employees e JOIN departments d ON e.department_id = d.id;",
      difficulty: "super hard"
    },
    {
      id: 41,
      title: "Comma-Separated Employee Names",
      description: "Retrieve a comma-separated list of employee full names for each project using an aggregate function.",
      hint: "Use GROUP_CONCAT() function",
      solution: "SELECT p.name, GROUP_CONCAT(e.first_name || ' ' || e.last_name) AS employees FROM projects p JOIN employee_projects ep ON p.id = ep.project_id JOIN employees e ON ep.employee_id = e.id GROUP BY p.id;",
      difficulty: "super hard"
    },
    {
      id: 42,
      title: "Top Three Salaries",
      description: "List the top three highest paid employees using a subquery.",
      hint: "Use ORDER BY and LIMIT",
      solution: "SELECT * FROM employees ORDER BY salary DESC LIMIT 3;",
      difficulty: "super hard"
    },
    {
      id: 43,
      title: "Above Department Average",
      description: "Retrieve employees who earn more than the average salary of their department using a subquery.",
      hint: "Use a correlated subquery to calculate department average",
      solution: "SELECT e.* FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id);",
      difficulty: "super hard"
    },
    {
      id: 44,
      title: "Project Details with Employees",
      description: "Join the projects and employee_projects tables to display project details along with the names of employees working on them, including projects with no assigned employees.",
      hint: "Use a LEFT JOIN from projects to employee_projects and employees",
      solution: "SELECT p.*, e.first_name, e.last_name FROM projects p LEFT JOIN employee_projects ep ON p.id = ep.project_id LEFT JOIN employees e ON ep.employee_id = e.id;",
      difficulty: "super hard"
    },
    {
      id: 45,
      title: "Create Benefits Table",
      description: "Create a new table called benefits with columns for id, employee_id, benefit_type, description, and created_at.",
      hint: "Use CREATE TABLE with appropriate column definitions",
      solution: "CREATE TABLE benefits (id INTEGER PRIMARY KEY AUTOINCREMENT, employee_id INT NOT NULL, benefit_type VARCHAR(100) NOT NULL, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(employee_id) REFERENCES employees(id));",
      difficulty: "super hard"
    },
    {
      id: 46,
      title: "Delete Unassigned Projects",
      description: "Delete projects that have no employees assigned using a subquery.",
      hint: "Use DELETE with a NOT EXISTS subquery",
      solution: "DELETE FROM projects WHERE NOT EXISTS (SELECT 1 FROM employee_projects WHERE project_id = projects.id);",
      difficulty: "super hard"
    },
    {
      id: 47,
      title: "Employees with Multiple Addresses",
      description: "Retrieve employees who have more than one address record.",
      hint: "Use GROUP BY with a HAVING clause",
      solution: "SELECT e.first_name, e.last_name, COUNT(a.id) AS address_count FROM employees e JOIN addresses a ON e.id = a.employee_id GROUP BY e.id HAVING COUNT(a.id) > 1;",
      difficulty: "super hard"
    },
    {
      id: 48,
      title: "Overlapping Project Dates",
      description: "Find employees working on projects with overlapping date ranges.",
      hint: "Use self-join with date comparison",
      solution: "SELECT DISTINCT e.first_name, e.last_name FROM employees e JOIN employee_projects ep1 ON e.id = ep1.employee_id JOIN projects p1 ON ep1.project_id = p1.id JOIN employee_projects ep2 ON e.id = ep2.employee_id JOIN projects p2 ON ep2.project_id = p2.id WHERE p1.id <> p2.id AND p1.start_date <= p2.end_date AND p2.start_date <= p1.end_date;",
      difficulty: "super hard"
    },
    {
      id: 49,
      title: "Salary Difference",
      description: "Retrieve each employee along with the difference between their salary and the average salary of their department using a subquery.",
      hint: "Use a subquery to get department average salary",
      solution: "SELECT e.first_name, e.last_name, e.salary, e.salary - (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id) AS salary_diff FROM employees e;",
      difficulty: "super hard"
    },
    {
      id: 50,
      title: "Drop Benefits Table",
      description: "Write a query to drop the table named benefits if it exists.",
      hint: "Use the DROP TABLE IF EXISTS statement",
      solution: "DROP TABLE IF EXISTS benefits;",
      difficulty: "super hard"
    }
  ];

  const filteredProblems = selectedDifficulty === 'all'
    ? problems
    : problems.filter(problem => problem.difficulty === selectedDifficulty);

  return (
    <div className="problems-container">
      <h3 className="problems-title">SQL Practice Problems</h3>

      <div className="difficulty-filters">
        <Button
          variant={selectedDifficulty === 'all' ? "default" : "outline"}
          onClick={() => setSelectedDifficulty('all')}
          className="filter-button cursor-pointer"
        >
          All
        </Button>
        <Button
          variant={selectedDifficulty === 'easy' ? "default" : "outline"}
          onClick={() => setSelectedDifficulty('easy')}
          className="filter-button cursor-pointer"
        >
          Easy
        </Button>
        <Button
          variant={selectedDifficulty === 'intermediate' ? "default" : "outline"}
          onClick={() => setSelectedDifficulty('intermediate')}
          className="filter-button cursor-pointer"
        >
          Intermediate
        </Button>
        <Button
          variant={selectedDifficulty === 'hard' ? "default" : "outline"}
          onClick={() => setSelectedDifficulty('hard')}
          className="filter-button cursor-pointer"
        >
          Hard
        </Button>
        <Button
          variant={selectedDifficulty === 'super hard' ? "default" : "outline"}
          onClick={() => setSelectedDifficulty('super hard')}
          className="filter-button cursor-pointer"
        >
          Super Hard
        </Button>
      </div>

      <div className="problems-grid">
        {filteredProblems.map(problem => (
          <div key={problem.id} className="schema-table problem-card">
            <h3 className="problem-title">{problem.title}</h3>
            <div className="problem-content">
              <p className="problem-description">{problem.description}</p>

              <details className="problem-details">
                <summary className="problem-summary">Show Hint</summary>
                <p className="problem-hint">{problem.hint}</p>
              </details>

              <details className="problem-details">
                <summary className="problem-summary">Show Solution</summary>
                <pre className="problem-solution">{problem.solution}</pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(problem.solution);

                  }}
                >
                  Copy
                </Button>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SampleProblems;
