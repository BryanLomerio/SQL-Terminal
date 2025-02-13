import React from 'react';

function SampleProblems() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
            <h1>Database Schema Overview</h1>
            <p>The database contains the following tables:</p>
            <ul>
                <li>
                    <strong>departments</strong>: Contains department information such as id, name, location,
                    created_at, and updated_at.
                </li>
                <li>
                    <strong>employees</strong>: Contains employee details including first_name, last_name,
                    department_id, position, salary, created_at, and updated_at. The department_id column
                    references the departments table.
                </li>
                <li>
                    <strong>projects</strong>: Contains project details such as id, name, start_date, end_date,
                    created_at, and updated_at.
                </li>
                <li>
                    <strong>employee_projects</strong>: A join table linking employees and projects with
                    employee_id and project_id.
                </li>
                <li>
                    <strong>addresses</strong>: Contains address details for employees including address_line1,
                    address_line2, city, state, zip, created_at, and updated_at. The employee_id column
                    references the employees table.
                </li>
            </ul>

            <h2>SQL Problems</h2>

            <h3>Easy Problems</h3>
            <ol>
                <li>List all departments from the departments table.</li>
                <li>List all employees showing only their first and last names.</li>
                <li>Retrieve the name and location from the departments table.</li>
                <li>Retrieve the full names and positions of every employee.</li>
                <li>Retrieve each employee's salary from the employees table.</li>
                <li>List the start and end dates for every project.</li>
                <li>List only the names of all projects.</li>
                <li>Display all addresses with their city, state, and zip code.</li>
                <li>Retrieve the first and last names of employees working in the Engineering department.</li>
                <li>Retrieve all employees whose salary is below 80000.</li>
                <li>List departments that have a location value (not null).</li>
                <li>Retrieve employees who joined after '2023-01-01' based on the created_at column.</li>
            </ol>

            <h3>Intermediate Problems</h3>
            <ol start="13">
                <li>
                    Join the employees and departments tables to display each employee's full name along with
                    the name of their department.
                </li>
                <li>
                    List employees along with their department names sorted by last name.
                </li>
                <li>
                    Retrieve addresses along with the corresponding employee full names by joining the
                    employees and addresses tables.
                </li>
                <li>Count the number of employees in each department.</li>
                <li>Calculate the average salary for each department.</li>
                <li>
                    Join the employees, employee_projects, and projects tables to retrieve details of employees
                    working on projects.
                </li>
                <li>List projects along with the number of employees assigned to each project.</li>
                <li>Retrieve employees whose salary is above 80000.</li>
                <li>List employees whose first name starts with the letter A or B.</li>
                <li>Retrieve details of departments that have more than two employees.</li>
                <li>
                    Join the employees and addresses tables to display each employee's full name and the city
                    where they reside.
                </li>
                <li>Retrieve project details for projects that start in the year 2024.</li>
                <li>
                    List all employees along with their department information, including employees with no
                    department.
                </li>
                <li>
                    Join employees, employee_projects, and projects to retrieve detailed information about
                    employees and their assigned projects.
                </li>
                <li>
                    List employees along with the total number of projects they are involved in.
                </li>
            </ol>

            <h3>Hard Problems</h3>
            <ol start="28">
                <li>
                    For each department, retrieve the employee with the highest salary using a subquery.
                </li>
                <li>List employees who are not assigned to any project.</li>
                <li>Retrieve employees who are assigned to more than one project.</li>
                <li>
                    For each department, display the department name along with the maximum salary among its
                    employees.
                </li>
                <li>
                    Calculate the average salary for each project by joining the employees, employee_projects,
                    and projects tables.
                </li>
                <li>
                    Identify departments that have no employees using a subquery.
                </li>
                <li>
                    Retrieve the details of employees who have addresses in the same city as their department's
                    location.
                </li>
                <li>
                    List employees whose salary is above the overall company average using a subquery.
                </li>
                <li>Retrieve projects that ended before a specific date.</li>
                <li>
                    For each employee, count the number of projects they are assigned to using a subquery.
                </li>
                <li>List employees whose last name contains more than six characters.</li>
                <li>
                    Retrieve departments that have an average employee salary higher than the overall company
                    average using a subquery.
                </li>
            </ol>

            <h3>Super Hard Problems</h3>
            <ol start="40">
                <li>
                    Create a view that displays each employee with their department name and the number of
                    projects they are involved in.
                </li>
                <li>
                    Retrieve a comma-separated list of employee full names for each project using an aggregate
                    function.
                </li>
                <li>List the top three highest paid employees using a subquery.</li>
                <li>
                    Retrieve employees who earn more than the average salary of their department using a
                    subquery.
                </li>
                <li>
                    Join the projects and employee_projects tables to display project details along with the
                    names of employees working on them, including projects with no assigned employees.
                </li>
                <li>
                    Create a new table called benefits with columns for id, employee_id, benefit_type,
                    description, and created_at.
                </li>
                <li>
                    Delete projects that have no employees assigned using a subquery.
                </li>
                <li>Retrieve employees who have more than one address record.</li>
                <li>Find employees working on projects with overlapping date ranges.</li>
                <li>
                    Retrieve each employee along with the difference between their salary and the average
                    salary of their department using a subquery.
                </li>
                <li>Write a query to drop the table named benefits if it exists.</li>
            </ol>
        </div>
    );
}

export default SampleProblems;
