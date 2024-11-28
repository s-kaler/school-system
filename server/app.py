#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, jsonify, request, make_response, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_mail import Message
from config import mail
import random
import datetime

# Local imports
from config import app, db, api
# Add your model imports

from models import db, User, Admin, Teacher, Student, Department, Course, CourseEnrollment, Assignment, Submission

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


class Signup(Resource):
    def post(self):
        json = request.get_json()
        if 'email' not in json or 'first_name' not in json or 'last_name' not in json or 'password' not in json or 'user_type' not in json:
            return {'error': 'Missing required fields'}, 422
        
        user = User(
            first_name=json['first_name'],
            last_name=json['last_name'],
            email=json['email'],
            user_type=json['user_type']
        )
        user.password_hash = json['password']

        try:
            db.session.add(user)
            db.session.commit()
            #session['user_id'] = user.id
            return user.to_dict(), 201
        except Exception as err:
            db.session.rollback()
            if "UNIQUE constraint failed: user.user" in str(err):
                return {'error': 'Username already exists'}, 422
            elif "UNIQUE constraint failed: user.email" in str(err):
                return {'error': 'Email already exists'}, 422

class CheckSession(Resource):
    def get(self):
        
        #user_id = session['user_id']
        if 'user_id'  in session:
            user = User.query.filter(User.id == session['user_id']).first()
            if user:
                return user.to_dict(), 200
        
        return {}, 401

class Login(Resource):
    def post(self):
        email = request.get_json()['email']
        user = User.query.filter(User.email == email).first()
        if user:
            password = request.get_json()['password']
            if user.authenticate(password):
                session['user_id'] = user.id
                if user.user_type == 'admin':
                    user = Admin.query.filter(Admin.id == user.id).first()
                elif user.user_type == 'teacher':
                    user = Teacher.query.filter(Teacher.id == user.id).first()
                elif user.user_type =='student':
                    user = Student.query.filter(Student.id == user.id).first()
                return user.to_dict(), 200
        return {'error': 'Invalid email or password'}, 401

class Logout(Resource):
    def delete(self):
        if session['user_id']:
            session['user_id'] = None
            return {}, 204
        else:
            return {'error': 'User is not logged in'}, 401

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')

class Departments(Resource):
    def get(self):
        departments = Department.query.all()
        return [department.to_dict() for department in departments]
    
    def post(self):
        json = request.get_json()
        if 'name' not in json :
            return {'error': 'Missing required field'}, 422
        
        department = Department(name=json['name'])

        try:
            db.session.add(department)
            db.session.commit()
            return department.to_dict(), 201
        except Exception as err:
            db.session.rollback()
            if "UNIQUE constraint failed: courses.name" in str(err):
                return {'error': 'Course name already exists'}, 422

api.add_resource(Departments, '/departments', endpoint='departments')


class Courses(Resource):
    def get(self):
        courses = Course.query.all()
        return [course.to_dict() for course in courses]
    
    def post(self):
        json = request.get_json()
        if 'name' not in json or 'credits' not in json or 'teacherId' not in json or 'departmentId' not in json:
            return {'error': 'Missing required field'}, 422
        
        course = Course(name=json['name'], credits=json['credits'], teacher_id=json['teacherId'], department_id=json['departmentId'])
        if 'description' in json:
            course.description = json['description']

        try:
            db.session.add(course)
            db.session.commit()
            return course.to_dict(), 201
        except Exception as err:
            db.session.rollback()
            if "UNIQUE constraint failed: courses.name" in str(err):
                return {'error': 'Course name already exists'}, 422
            
api.add_resource(Courses, '/courses', endpoint='course')

class CourseById(Resource):
    def get(self, course_id):
        course = Course.query.filter(Course.id == course_id).first()
        if course:
            return course.to_dict()
        else:
            return {'error': 'Course not found'}, 404
        
    def patch(self, course_id):
        course = Course.query.filter(Course.id == course_id).first()
        if course:
            json = request.get_json()
            if 'name' in json:
                course.name = json['name']
            if 'department_id' in json:
                course.department_id = json['department_id']
            if 'teacher_id' in json:
                course.teacher_id = json['teacher_id']

            db.session.commit()
            return course.to_dict()
        else:
            return {'error': 'Course not found'}, 404
        
    def delete(self, course_id):
        course = Course.query.filter(Course.id == course_id).first()
        if course:
            db.session.delete(course)
            db.session.commit()
            return {}, 204
        else:
            return {'error': 'Course not found'}, 404
        
api.add_resource(CourseById, '/courses/<int:course_id>', endpoint='course_by_id')

class Teachers(Resource):
    def get(self):
        teachers = Teacher.query.all()
        return [teacher.to_dict() for teacher in teachers]
    
    def post(self):
        json = request.get_json()
        if 'firstName' not in json or 'lastName' not in json or 'email' not in json or 'password' not in json or 'departmentId' not in json:
            return {'error': 'Missing required fields'}, 422
        
        teacher = Teacher(
            first_name=json['firstName'],
            last_name=json['lastName'],
            email=json['email'],
            department_id=json['departmentId'],
            verified=False,
            verification_code=generate_token()
        )

        try:
            db.session.add(teacher)
            db.session.commit()
            send_email(teacher)
            return teacher.to_dict(), 201
        except Exception as err:
            db.session.rollback()
            if "UNIQUE constraint failed: users.email" in str(err):
                return {'error': 'Email already exists'}, 422
            return {'error': str(err)}, 422

api.add_resource(Teachers, '/teachers', endpoint='teachers')

class TeacherById(Resource):
    def get(self, teacher_id):
        teacher = Teacher.query.filter(Teacher.id == teacher_id).first()
        if teacher:
            return teacher.to_dict()
        else:
            return {'error': 'Teacher not found'}, 404
        
    def patch(self, teacher_id):
        teacher = Teacher.query.filter(Teacher.id == teacher_id).first()
        if teacher:
            json = request.get_json()
            if 'first_name' in json:
                teacher.first_name = json['first_name']
            if 'last_name' in json:
                teacher.last_name = json['last_name']
            if 'email' in json:
                teacher.email = json['email']
            if 'department_id' in json:
                teacher.department_id = json['department_id']

            db.session.commit()
            return teacher.to_dict()
        else:
            return {'error': 'Teacher not found'}, 404
        
    def delete(self, teacher_id):
        teacher = Teacher.query.filter(Teacher.id == teacher_id).first()
        if teacher:
            db.session.delete(teacher)
            db.session.commit()
            return {}, 204
        else:
            return {'error': 'Teacher not found'}, 404
        

api.add_resource(TeacherById, '/teachers/<int:teacher_id>', endpoint='teacher_by_id')


class Students(Resource):
    def get(self):
        students = Student.query.all()
        return [student.to_dict() for student in students]
    
    def post(self):
        json = request.get_json()
        if 'firstName' not in json or 'lastName' not in json or 'email' not in json or 'password' not in json:
            return {'error': 'Missing required fields'}, 422
        
        student = Student(
            first_name=json['firstName'],
            last_name=json['lastName'],
            email=json['email'],
            verified=False,
            verification_code=generate_token()
        )

        try:
            db.session.add(student)
            db.session.commit()
            send_email(student)
            return student.to_dict(), 201
        except Exception as err:
            db.session.rollback()
            if "UNIQUE constraint failed: users.email" in str(err):
                return {'error': 'Email already exists'}, 422
    
api.add_resource(Students, '/students', endpoint='students')

class StudentById(Resource):
    def get(self, student_id):
        student = Student.query.filter(Student.id == student_id).first()
        if student:
            return student.to_dict()
        else:
            return {'error': 'Student not found'}, 404
        
    def patch(self, student_id):
        student = Student.query.filter(Student.id == student_id).first()
        if student:
            json = request.get_json()
            if 'first_name' in json:
                student.first_name = json['first_name']
            if 'last_name' in json:
                student.last_name = json['last_name']
            if 'email' in json:
                student.email = json['email']

            db.session.commit()
            return student.to_dict()
        else:
            return {'error': 'Student not found'}, 404
        
    def delete(self, student_id):
        student = Student.query.filter(Student.id == student_id).first()
        if student:
            db.session.delete(student)
            db.session.commit()
            return {}, 204
        else:
            return {'error': 'Student not found'}, 404
        
api.add_resource(StudentById, '/students/<int:student_id>')


class Email(Resource):
    def post(self):
        json = request.get_json()
        if 'email' not in json:
            return {'error': 'Missing required field'}, 422
        
        recipient = json['email']
        user_id = json['userId']
        name = json['name']
        user_type = json['userType']
        send_email(recipient, user_id, name, user_type)
        return {'message': 'Email sent successfully'}

api.add_resource(Email, '/email', endpoint='email')

class UserById(Resource):
    def get(self, user_id):
        user = User.query.filter(User.id == user_id).first()
        if user:
            return user.to_dict()
        else:
            return {'error': 'User not found'}, 404
        
    def patch(self, user_id):
        user = User.query.filter(User.id == user_id).first()
        if user:
            json = request.get_json()
            if 'first_name' in json:
                user.first_name = json['firstName']
            if 'last_name' in json:
                user.last_name = json['lastName']
            if 'email' in json:
                user.email = json['email']
            if 'password' in json:
                user.password_hash = json['password']
            if 'verified' in json:
                user.verified = json['verified']

            db.session.commit()
            return user.to_dict()
        else:
            return {'error': 'User not found'}, 404
        
api.add_resource(UserById, '/users/<int:user_id>', endpoint='user_by_id')


DEFAULT_URL = 'localhost:4000'

def send_email(user):
    recipient = user.email
    name = f"{user.first_name} {user.last_name}"
    token = f"{user.verification_code}"

    url = f'{DEFAULT_URL}/verify/{user.id}'
    msg = Message('Set up your account', sender='skalerproject@gmail.com', recipients=[recipient])
    msg.body = f'Hello, {name}, your verification code is {token}.\nPlease verify your account to finish setup: {url}'
    mail.send(msg)
    return {'message': 'Email sent successfully'}

def generate_token():
    token = random.randint(0, 9999)
    token_str = f"{token:04d}"
    return token_str


class CoursesByTeacher(Resource):
    def get(self, teacher_id):
        courses = Course.query.filter(Course.teacher_id == teacher_id).all()
        if not courses:
            return {'error': 'No courses found for this teacher'}, 404
        course_dict_list = [course.to_dict() for course in courses]
        return make_response(course_dict_list, 200)
    
api.add_resource(CoursesByTeacher, '/teachers/<int:teacher_id>/courses')

class CoursesByStudent(Resource):
    def get(self, student_id):
        enrollments = CourseEnrollment.query.filter(CourseEnrollment.student_id == student_id).all()
        if not enrollments:
            return {'error': 'No courses found for this student'}, 404
        enrollment_dict_list = [enrollment.to_dict() for enrollment in enrollments]
        return make_response(enrollment_dict_list, 200)
    
    
api.add_resource(CoursesByStudent, '/students/<int:student_id>/enrollments')


class Assignments(Resource):
    def get(self):
        assignments = Assignment.query.all()
        return [assignment.to_dict() for assignment in assignments]
    
    def post(self):
        json = request.get_json()
        if 'courseId' not in json or 'name' not in json or 'description' not in json:
            return {'error': 'Missing required fields'}, 422
        
        assignment = Assignment(
            course_id=json['courseId'],
            name=json['name'],
            description=json['description'],
            published=False
        )

        db.session.add(assignment)
        db.session.commit()
        return assignment.to_dict(), 201
    
api.add_resource(Assignments, '/assignments')


class AssignmentById(Resource):
    def get(self, assignment_id):
        assignment = Assignment.query.filter(Assignment.id == assignment_id).first()
        if assignment:
            return assignment.to_dict()
        else:
            return {'error': 'Assignment not found'}, 404
        
    def patch(self, assignment_id):
        assignment = Assignment.query.filter(Assignment.id == assignment_id).first()
        if assignment:
            json = request.get_json()
            if 'name' in json:
                assignment.name = json['name']
            if 'description' in json:
                assignment.description = json['description']
            if 'published' in json:
                assignment.published = json['published']
                if assignment.published:
                    assignment.published_at = datetime.datetime.now()
                else:
                    assignment.due_date = None
            if 'due_date' in json and 'due_time' in json:
                due_date = json['due_date']
                due_time = json['due_time']
                assignment.due_date = combine_date_time(due_date, due_time)

            db.session.commit()
            return assignment.to_dict()
        else:
            return {'error': 'Assignment not found'}, 404
        
    def delete(self, assignment_id):
        assignment = Assignment.query.filter(Assignment.id == assignment_id).first()
        if assignment:
            db.session.delete(assignment)
            db.session.commit()
            return {}, 204
        else:
            return {'error': 'Assignment not found'}, 404
        
def combine_date_time(due_date, due_time):
  datetime_str = f"{due_date} {due_time}"
  datetime_obj = datetime.datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")

  return datetime_obj


api.add_resource(AssignmentById, '/assignments/<int:assignment_id>')

class AssignmentsByCourse(Resource):
    def get(self, course_id):
        assignments = Assignment.query.filter(Assignment.course_id == course_id).all()
        if not assignments:
            return {'error': 'No assignments found for this course'}, 404
        assignment_dict_list = [assignment.to_dict() for assignment in assignments]
        return make_response(assignment_dict_list, 200)
    

api.add_resource(AssignmentsByCourse, '/courses/<int:course_id>/assignments')

class Enrollments(Resource):
    def get(self):
        enrollments = CourseEnrollment.query.all()
        return [enrollment.to_dict() for enrollment in enrollments]
    
    def post(self):
        json = request.get_json()
        if 'courseId' not in json or'studentId' not in json:
            return {'error': 'Missing required fields'}, 422
        
        enrollment = CourseEnrollment(
            course_id=json['courseId'],
            student_id=json['studentId'],
            enrollment_date=None,
            approved=False
        )

        db.session.add(enrollment)
        db.session.commit()
        return enrollment.to_dict(), 201
    
api.add_resource(Enrollments, '/enrollments')

class EnrollmentsToBeApproved(Resource):
    def get(self):
        enrollments = CourseEnrollment.query.filter(CourseEnrollment.approved == False).all()
        return [enrollment.to_dict() for enrollment in enrollments]
    
api.add_resource(EnrollmentsToBeApproved, '/approve_enrollments')

class EnrollmentById(Resource):
    def get(self, enrollment_id):
        enrollment = CourseEnrollment.query.filter(CourseEnrollment.id == enrollment_id).first()
        if enrollment:
            return enrollment.to_dict()
        else:
            return {'error': 'Enrollment not found'}, 404
        
    def patch(self, enrollment_id):
        enrollment = CourseEnrollment.query.filter(CourseEnrollment.id == enrollment_id).first()
        if enrollment:
            json = request.get_json()
            if 'approved' in json:
                enrollment.approved = json['approved']
                if enrollment.approved:
                    enrollment.enrollment_date = datetime.datetime.now()
                else:
                    enrollment.enrollment_date = None
            db.session.commit()
            return enrollment.to_dict()
        else:
            return {'error': 'Enrollment not found'}, 404

api.add_resource(EnrollmentById, '/enrollments/<int:enrollment_id>')

class Submissions(Resource):
    def get(self):
        submissions = Submission.query.all()
        return [submission.to_dict() for submission in submissions]
    
    def post(self):
        json = request.get_json()
        if 'enrollment_id' not in json or 'assignment_id' not in json or 'submission_text' not in json:
            return {'error': 'Missing required fields'}, 422
        
        submission = Submission(
            course_enrollment_id=json['enrollment_id'],
            assignment_id=json['assignment_id'],
            submission_text=json['submission_text'],
            submitted_at=datetime.datetime.now(),
            grade=None
        )

        db.session.add(submission)
        db.session.commit()
        return submission.to_dict(), 201
    
api.add_resource(Submissions, '/submissions')

class SubmissionById(Resource):
    def get(self, submission_id):
        submission = Submission.query.filter(Submission.id == submission_id).first()
        if submission:
            return submission.to_dict()
        else:
            return {'error': 'Submission not found'}, 404
        
    def patch(self, submission_id):
        submission = Submission.query.filter(Submission.id == submission_id).first()
        if submission:
            json = request.get_json()
            if 'grade' in json:
                submission.grade = json['grade']
                
            db.session.commit()
            return submission.to_dict()
        else:
            return {'error': 'Submission not found'}, 404
        
    def delete(self, submission_id):
        submission = Submission.query.filter(Submission.id == submission_id).first()
        if submission:
            db.session.delete(submission)
            db.session.commit()
            return {}, 204
        else:
            return {'error': 'Submission not found'}, 404
        
api.add_resource(SubmissionById, '/submissions/<int:submission_id>')

class SubmissionsForAssignment(Resource):
    def get(self, assignment_id):
        submissions = Submission.query.filter(Submission.assignment_id == assignment_id).all()
        return [submission.to_dict() for submission in submissions]
    
api.add_resource(SubmissionsForAssignment, '/assignments/<int:assignment_id>/submissions/')


if __name__ == '__main__':
    app.run(port=5555, debug=True)