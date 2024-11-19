#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Department, Course, User, Teacher, Student, Admin, Assignment

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        Department.query.delete()
        Course.query.delete()
        User.query.delete()
        Teacher.query.delete()
        Student.query.delete()

        # Generate departments

        # Generate users
        a1 = Admin(first_name='Ad', last_name='min', email='admin@school.edu', _password_hash='123')
        db.session.add(a1)
        s1 = Student(first_name='George', last_name='Jefferson', email='georgejeff@gmail.com', _password_hash='georgejeff')
        db.session.add(s1)
        t1 = Teacher(first_name='Bob', last_name='Jefferson', email='bobjeff@gmail.com', _password_hash='bobjeff')
        db.session.add(t1)
        db.session.commit()