# School Management System

This project is a full stack application modeling a school management system for three types of users:
admins, teachers, and students. This project is built on React.js and Flask-SQLAlchemy. In order to
start the application, you must run the seed.py python script in order to log in first as admin. Our
seeded database starts with some simple data that includes users and courses. In order to continue,
an admin is required. To create a new account, a real email address is required to send a email with
attached verification code and link to a new verification page.

For our three user types, they will interact with the database in diferent methods. Admins will be 
able to create new users and courses as well as approve student enrollments to courses. Teachers will
be assigned to courses and create assignments for each course, as well as grade submissions for those
assignments. Students will be able to enroll in different courses and create submissions for their
assignments.

The models represented in the database are:
Users
Admins
Teachers
Students
Courses
Departments
Course_Enrollments
Assignments
Submissions

This project models a many-to-many relationship, shown by many courses having many students. Full CRUD 
options, following REST conventions, are available on Assignments and Submissions. One feature that was
added that was taught outside of the given curriculum implementation of Flask-Mail. Use of state across 
different routes is handled by the useContext hook.