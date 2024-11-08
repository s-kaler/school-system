from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


from config import db, bcrypt


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email= db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    user_type = db.Column(db.String, nullable=False)
    __mapper_args__ = {'polymorphic_on': user_type}

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))
    

#make teacher and student children of user class

class Teacher(User):
    __tablename__ = 'teachers'
    __mapper_args__ = {'polymorphic_identity': 'teacher'}
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    rating = db.Column(db.Integer)
    
    department_id = db.Column(db.Integer, db.ForeignKey("departments.id"))
    department = db.relationship('Department', back_populates="teachers")

    courses = db.relationship('Course', back_populates='teacher')


class Student(User):
    __tablename__ = 'students'
    __mapper_args__ = {'polymorphic_identity': 'student'}
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    major = db.Column(db.String)
    gpa = db.Column(db.Float)

    course_enrollments = db.relationship('CourseEnrollment', back_populates='student', cascade='all, delete-orphan')
    courses = association_proxy('course_enrollments', 'course', creator=lambda course_obj: CourseEnrollment(course=course_obj))


class Department(db.Model, SerializerMixin):
    __tablename__ = 'departments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)

    courses = db.relationship('Course', back_populates='department')
    teachers = db.relationship('Teacher', back_populates='department')


class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    credits = db.Column(db.Integer)

    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)
    department = db.relationship('Department', back_populates='courses')

    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)
    teacher = db.relationship('Teacher', back_populates='courses')

    course_enrollments = db.relationship('CourseEnrollment',  back_populates='course', cascade='all, delete-orphan')
    students = association_proxy('course_enrollments', 'student', creator=lambda student_obj: CourseEnrollment(student=student_obj))

#proxy models

#students to courses
class CourseEnrollment(db.Model):
    __tablename__ = 'course_enrollments'
    id = db.Column(db.Integer, primary_key=True)
    enrollment_date = db.Column(db.DateTime)
    grade = db.Column(db.Integer)

    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    student = db.relationship('Student', back_populates='course_enrollments')

    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    course = db.relationship('Course', back_populates='course_enrollments')

