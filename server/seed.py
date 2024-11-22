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
        Admin.query.delete()
        Teacher.query.delete()
        Student.query.delete()

        # Generate departments

        # Generate users
        a1 = Admin(first_name='Ad', last_name='min', email='admin@school.edu')
        a1.password_hash = '123'
        db.session.add(a1)

        s1 = Student(first_name='George', last_name='Jefferson', email='georgejeff@gmail.com')
        s1.password_hash = 'georgejeff'
        db.session.add(s1)

        t1 = Teacher(first_name='Bob', last_name='Jefferson', email='bobjeff@gmail.com')
        t1.password_hash = 'bobjeff'
        db.session.add(t1)
        t2 = Teacher(first_name='Anna', last_name='Wellington', email='annawell@gmail.com')
        t2.password_hash = 'annawell'
        db.session.add(t2)

        db.session.commit()

        #Generate departements
        d1 = Department(name='Math')
        db.session.add(d1)
        d2 = Department(name='Science')
        db.session.add(d2)
        db.session.commit()

        #Generate courses

        c1 = Course(name='Biology 101', credits='4', department_id=d2.id, teacher_id=t1.id)
        db.session.add(c1)
        c2 = Course(name='Calculus 1', credits='4', department_id=d1.id, teacher_id=t2.id)
        db.session.add(c2)
        db.session.commit()