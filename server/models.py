from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, bcrypt

class Department(db.Model, SerializerMixin):
    __tablename__ = 'departments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)

    classses = db.relationship('Class', back_populates='department')


class Class(db.Model, SerializerMixin):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    department = db.relationship('Department', back_populates='classses')

    #teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'))

class Teacher(db.Model, SerializerMixin):
    __tablename__ = 'teachers'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    password_hash = db.Column(db.String(128))
    classes = association_proxy('class_teachers', 'class')

    @hybrid_property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'
    
    @full_name.setter
    def full_name(self, value):
        first_name, last_name = value.split(' ')
        self.first_name = first_name
        self.last_name = last_name

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    class_teachers = db.relationship('ClassTeacher', back_populates='teacher')


class ClassTeacher(db.Model):
    __tablename__ = 'class_teachers'
    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'))
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'))
    class_ = db.relationship('Class', back_populates='class_teachers')
    teacher = db.relationship('Teacher', back_populates='class_teachers')


class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    password_hash = db.Column(db.String(128))
    classes = association_proxy('student_classes', 'class')

    @hybrid_property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'
    
    @full_name.setter
    def full_name(self, value):
        first_name, last_name = value.split(' ')
        self.first_name = first_name
        self.last_name = last_name

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    class_teachers = db.relationship('StudentClass', back_populates='student')
    student_classes = db.relationship('Class', secondary='student_classes', back_populates='students')


class StudentClass(db.Model):
    __tablename__ = 'student_classes'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'))
    student = db.relationship('Student', back_populates='student_classes')
    class_ = db.relationship('Class', back_populates='student_classes')

