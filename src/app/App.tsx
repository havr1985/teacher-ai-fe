import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.tsx';
import { AuthInitializer } from '../features/auth/components/AuthInitializer.tsx';
import { ErrorBoundary } from '../shared/components/ui/ErrorBoundary.tsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <ErrorBoundary>
        <AuthInitializer>
          <RouterProvider router={router} />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFFFFF',
                color: '#2A2420',
                border: '1px solid #E8E3D8',
                borderRadius: '10px',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 20px rgba(42,36,32,0.12)',
              },
              success: {
                iconTheme: { primary: '#C8A96E', secondary: '#FFFFFF' },
              },
              error: {
                iconTheme: { primary: '#D94F3D', secondary: '#FFFFFF' },
              },
            }}
          />
        </AuthInitializer>
      </ErrorBoundary>
    </>
  );
}

export default App;
