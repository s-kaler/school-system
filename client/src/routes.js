import App from './components/App';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import NewStudent from './pages/NewStudent';
import NewCourse from './pages/NewCourse';
import NewTeacher from './pages/NewTeacher';



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
            }
        ]
    }
]

export default routes;