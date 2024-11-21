#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, jsonify, request, make_response, session
from flask_migrate import Migrate
from flask_restful import Api, Resource

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
            session.rollback()
            if "UNIQUE constraint failed: user.user" in str(err):
                return {'error': 'Username already exists'}, 422
            elif "UNIQUE constraint failed: user.email" in str(err):
                return {'error': 'Email already exists'}, 422

class CheckSession(Resource):
    def get(self):
        
        #user_id = session['user_id']
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

if __name__ == '__main__':
    app.run(port=5555, debug=True)