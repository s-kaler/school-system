#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, jsonify, request, make_response, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_mail import Message
from config import mail
import random

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
            send_email(student)
            db.session.commit()
            return student.to_dict(), 201
        except Exception as err:
            db.session.rollback()
            if "UNIQUE constraint failed: users.email" in str(err):
                return {'error': 'Email already exists'}, 422
    
api.add_resource(Students, '/students', endpoint='students')


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


if __name__ == '__main__':
    app.run(port=5555, debug=True)