import './styles/globals.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import PrivateLayout from './components/layout/PrivateLayout';
import LandingPage from './pages/public/LandingPage';
import PublicChatPage from './pages/public/PublicChatPage';
import LoginPage from './pages/private/LoginPage';
import DashboardPage from './pages/private/DashboardPage';
import BusinessProfilePage from './pages/private/BusinessProfilePage';
import AgentSettingsPage from './pages/private/AgentSettingsPage';
import FaqsPage from './pages/private/FaqsPage';
import ServicesPage from './pages/private/ServicesPage';
import ConversationsPage from './pages/private/ConversationsPage';
import ConversationDetailPage from './pages/private/ConversationDetailPage';
import LeadsPage from './pages/private/LeadsPage';
import LeadDetailPage from './pages/private/LeadDetailPage';
import CommercialRequestsPage from './pages/private/CommercialRequestsPage';
import CommercialRequestDetailPage from './pages/private/CommercialRequestDetailPage';
import NotificationsPage from './pages/private/NotificationsPage';
import { useAuth } from './hooks/useAuth';

function AuthBootScreen() {
  return (
    <div className="app-shell">
      <div className="app-background" />

      <main
        className="login-page-shell"
        aria-busy="true"
        aria-live="polite"
        role="status"
      >
        <section className="login-card auth-boot-card auth-boot-card--wow">
          <div className="auth-boot-orbit" aria-hidden="true">
            <span className="auth-boot-orbit__core">✦</span>
            <span className="auth-boot-orbit__dot auth-boot-orbit__dot--one" />
            <span className="auth-boot-orbit__dot auth-boot-orbit__dot--two" />
            <span className="auth-boot-orbit__dot auth-boot-orbit__dot--three" />
          </div>

          <span className="mini-chip">Autenticación segura</span>

          <h1 className="login-title">Verificando sesión</h1>

          <p className="login-copy">
            Preparando acceso seguro al entorno privado de ReplyOS.
          </p>

          <div className="auth-boot-loader" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="auth-boot-steps" aria-hidden="true">
            <span>✓ Sesión</span>
            <span>✓ Panel</span>
            <span>✓ Agente</span>
          </div>
        </section>
      </main>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthReady, isBootstrappingAuth } = useAuth();

  if (!isAuthReady || isBootstrappingAuth) {
    return <AuthBootScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isAuthReady, isBootstrappingAuth } = useAuth();

  if (!isAuthReady || isBootstrappingAuth) {
    return <AuthBootScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <LandingPage />
          </PublicLayout>
        }
      />

      <Route
        path="/chat"
        element={
          <PublicLayout>
            <PublicChatPage />
          </PublicLayout>
        }
      />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <DashboardPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/business-profile"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <BusinessProfilePage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/agent-settings"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <AgentSettingsPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/faqs"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <FaqsPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/services"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <ServicesPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/conversations"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <ConversationsPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/conversations/:id"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <ConversationDetailPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/leads"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <LeadsPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/leads/:id"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <LeadDetailPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/commercial-requests"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <CommercialRequestsPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/commercial-requests/:id"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <CommercialRequestDetailPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/notifications"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <NotificationsPage />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;