import { Outlet, useRouterState } from '@tanstack/react-router';
import Navbar from './Navbar';
import Footer from './Footer';
import AdvancedHomeBackground from './AdvancedHomeBackground';

export default function Layout() {
  const routerState = useRouterState();
  const isHome = routerState.location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {isHome && <AdvancedHomeBackground />}
      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
