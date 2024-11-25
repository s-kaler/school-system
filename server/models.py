from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


from config import db, bcrypt


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email= db.Column(db.String, unique=True, nullable=False)
    verified = db.Column(db.Boolean, default=False)
    verification_code = db.Column(db.String)
    _password_hash = db.Column(db.String)
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
    

#make admin, teacher, and student children of user class

class Admin(User):
    __tablename__ = 'admins'
    __mapper_args__ = {'polymorphic_identity': 'admin'}
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

class Teacher(User):
    __tablename__ = 'teachers'
    __mapper_args__ = {'polymorphic_identity': 'teacher'}
    serialize_rules=('-department.teachers', '-department.courses', '-courses.assignments', '-courses.teacher_id', '-courses.teacher', '-courses.department_id', '-courses.department', '-courses.course_enrollments', '-courses.description')
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
    serialize_rules = ('-department.courses', '-department.teachers', '-department.id', '-teacher.user_type', '-teacher.courses', '-teacher._password_hash', '-teacher.department','-teacher.rating', '-teacher.verification_code', '-teacher.verified', '-teacher.id', '-teacher.department_id', '-student.courses')
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    credits = db.Column(db.Integer)
    description = db.Column(db.String)

    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)
    department = db.relationship('Department', back_populates='courses')

    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)
    teacher = db.relationship('Teacher', back_populates='courses')

    course_enrollments = db.relationship('CourseEnrollment',  back_populates='course', cascade='all, delete-orphan')
    students = association_proxy('course_enrollments', 'student', creator=lambda student_obj: CourseEnrollment(student=student_obj))

    assignments = db.relationship('Assignment', back_populates='course', cascade='all, delete-orphan')


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

    submissions = db.relationship('Submission', back_populates='course_enrollment', cascade='all, delete-orphan')
    assignments = association_proxy('submissions', 'assignment', creator=lambda assignment_obj: Submission(assignment=assignment_obj))


class Assignment(db.Model):
    __tablename__ = 'assignments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    published = db.Column(db.Boolean)
    published_at = db.Column(db.DateTime)
    due_date = db.Column(db.DateTime)

    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    course = db.relationship('Course', back_populates='assignments')

    submissions = db.relationship('Submission', back_populates='assignment', cascade='all, delete-orphan')
    course_enrollments = association_proxy('submissions', 'course_enrollment', creator=lambda enrollment_obj:  Submission(course_enrollment=enrollment_obj))

#enrollments to assignments
class Submission(db.Model):
    __tablename__ = 'submissions'
    id = db.Column(db.Integer, primary_key=True)
    file_path = db.Column(db.String)
    submitted_at = db.Column(db.DateTime)
    grade = db.Column(db.Integer)

    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.id'), nullable=False)
    assignment = db.relationship('Assignment', back_populates='submissions')

    course_enrollment_id = db.Column(db.Integer, db.ForeignKey('course_enrollments.id'), nullable=False)
    course_enrollment = db.relationship('CourseEnrollment', back_populates='submissions')


