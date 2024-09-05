import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <main className="h-full flex flex-col justify-center sm:grid sm:place-content-center">
      <Outlet />
    </main>
  );
}
