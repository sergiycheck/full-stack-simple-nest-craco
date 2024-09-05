import { Button } from '@/components/ui/button';
import { useUser } from '@/state/user-provider';
import { Outlet } from 'react-router-dom';

export function AuthenticatedLayout() {
  const userData = useUser();

  return (
    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-4 min-h-screen">
      <aside className="col-span-12 sm:col-span-2 p-4 border-r flex items-end">
        <Button
          className="w-full"
          variant={'default'}
          onClick={() => {
            userData.logout();
          }}
        >
          Sign out
        </Button>
      </aside>

      <main className="col-span-12 sm:col-span-9  p-4">
        <Outlet />
      </main>
    </div>
  );
}
