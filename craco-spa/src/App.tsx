import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './templates/layout';
import { SignUp } from './features/sign-up/sign-up';
import { SignIn } from './features/sign-in/sign-in';
import { AuthenticatedLayout } from './templates/authenticated-layout';
import { Greeting } from './features/greeting/greeting';
import { useUser } from './state/user-provider';
import { LoaderCircle } from 'lucide-react';
import { useToast } from './hooks/use-toast';
import { useEffect } from 'react';
import { decodeJwt } from 'jose';
import { JwtPayload } from './api/users/types';
import apiUsers from './api/users/api-users';

const RestrictedLayout = () => {
  const { user, loading } = useUser();

  const loadingPart = (
    <div className="h-full grid place-content-center">
      <LoaderCircle className="text-foreground animate-spin" />
    </div>
  );

  return loading ? (
    <>{loadingPart}</>
  ) : !loading && user ? (
    <AuthenticatedLayout />
  ) : (
    <Navigate to="/auth/sign-in" />
  );
};

function App() {
  const { login, setLoading, logout } = useUser();

  const { toast } = useToast();

  useEffect(() => {
    async function fetchUser() {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;
      try {
        const payload = decodeJwt(accessToken);

        if (!payload) return;
        if (!payload.email) return;

        const { email } = payload as JwtPayload;

        setLoading(true);
        const user = await apiUsers.getUser({ email }, accessToken);

        if (!user) return;

        login({ user, authInfo: { accessToken } });
        setLoading(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error fetching user'
        });

        logout();
      } finally {
        setLoading(false);
      }
    }

    async function fetchUserAndSetLoading() {
      await fetchUser();
      setLoading(false);
    }

    fetchUserAndSetLoading();
  }, [logout, toast, login, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth" element={<Layout />}>
          <Route index={true} path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>

        <Route path="/" element={<RestrictedLayout />}>
          <Route index={true} element={<Greeting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
