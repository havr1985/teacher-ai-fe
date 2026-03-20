import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.tsx';
import { AuthInitializer } from '../features/auth/components/AuthInitializer.tsx';

function App() {
  return (
    <>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </>
  );
}

export default App;
