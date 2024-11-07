#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Department, Course, User, Teacher, Student

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

        # Generate students

        s1 = Student(first_name='George', last_name='Jefferson', email='georgejeff@gmail.com', _password_hash='georgejeff')
        db.session.add(s1)
        db.session.commit()
        t1 = Teacher(first_name='Bob', last_name='Jefferson', email='bobjeff@gmail.com', _password_hash='bobjeff')
        db.session.add(t1)
        db.session.commit()