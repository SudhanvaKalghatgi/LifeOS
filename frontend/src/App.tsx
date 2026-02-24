import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { AppLayout } from './layouts/AppLayout';
import { useApiConfig } from './hooks/useApi';
import { useUserSync } from './hooks/useUserSync';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';

function App() {
  useApiConfig();
  useUserSync(); // Sync Clerk user to our MongoDB on every sign-in

  return (
    <BrowserRouter>
      <Routes>
        {/* Root: Landing Page for public, Dashboard for logged in */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <Home />
              </SignedOut>
            </>
          }
        />

        {/* Sign-in custom page */}
        <Route
          path="/sign-in/*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
              <SignIn routing="path" path="/sign-in" />
            </div>
          }
        />

        {/* Protected Routes inside AppLayout */}
        <Route
          element={
            <>
              <SignedIn>
                <AppLayout />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
