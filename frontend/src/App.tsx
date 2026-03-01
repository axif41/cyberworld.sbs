import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import ProfileSetupModal from './components/ProfileSetupModal';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ModuleViewerPage from './pages/ModuleViewerPage';
import CyberMentorPage from './pages/CyberMentorPage';
import ProjectShowcasePage from './pages/ProjectShowcasePage';
import DoubtsPage from './pages/DoubtsPage';
import DoubtDetailPage from './pages/DoubtDetailPage';
import CertificatesPage from './pages/CertificatesPage';
import ProfilePage from './pages/ProfilePage';

// Root layout with profile setup guard
function RootLayout() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !isLoading && isFetched && userProfile === null;

  return (
    <>
      <Layout />
      {showProfileSetup && <ProfileSetupModal open={true} />}
    </>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const coursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses',
  component: CoursesPage,
});

const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/$courseId',
  component: CourseDetailPage,
});

const moduleViewerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/$courseId/modules/$moduleId',
  component: ModuleViewerPage,
});

const mentorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mentor',
  component: CyberMentorPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: ProjectShowcasePage,
});

const doubtsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doubts',
  component: DoubtsPage,
});

const doubtDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doubts/$doubtId',
  component: DoubtDetailPage,
});

const certificatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/certificates',
  component: CertificatesPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const userProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$username',
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  coursesRoute,
  courseDetailRoute,
  moduleViewerRoute,
  mentorRoute,
  projectsRoute,
  doubtsRoute,
  doubtDetailRoute,
  certificatesRoute,
  profileRoute,
  userProfileRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
