import App from './components/App';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import NewStudent from './pages/NewStudent';
import NewCourse from './pages/NewCourse';
import NewTeacher from './pages/NewTeacher';
import Verify from './pages/Verify';
import CoursePage from './pages/CoursePage';
import NewAssignment from './pages/NewAssignment';
import AssignmentPage from './pages/AssignmentPage';

const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/courses',
                element: <Courses />,
            },
            {
                path: '/courses/new',
                element: <NewCourse />
            },
            {
                path: '/teachers/new',
                element: <NewTeacher />
            },
            {
                path: '/students/new',
                element: <NewStudent />
            },
            {
                path: '/verify/:userId',
                element: <Verify />
            },
            {
                path: '/courses/:courseId',
                element: <CoursePage />
            },
            {
                path: '/assignments/:assignmentId',
                element: <AssignmentPage />,
            },
            {
                path: '/courses/:courseId/newassignment',
                element: <NewAssignment />
            }
        ]
    }
]

export default routes;