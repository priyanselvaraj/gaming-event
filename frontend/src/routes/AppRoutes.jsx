import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Components
import { ProtectedRoute } from '../components/ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/HomePage';
import { BrowseEventsPage } from '../pages/BrowseEventsPage';
import { EventDetailPage } from '../pages/EventDetailPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

// Shared Protected Pages
import { ProfilePage } from '../pages/ProfilePage';

// Gamer Pages
import { GamerDashboard } from '../pages/GamerDashboard';
import { MyRegistrationsPage } from '../pages/MyRegistrationsPage';
import { MyTicketsPage } from '../pages/MyTicketsPage';

// Organizer Pages
import { OrganizerDashboard } from '../pages/OrganizerDashboard';
import { MyEventsPage } from '../pages/MyEventsPage';
import { CreateEventPage } from '../pages/CreateEventPage';
import { TournamentManagementPage } from '../pages/TournamentManagementPage';
import { TicketManagementPage } from '../pages/TicketManagementPage';
import { ParticipantManagementPage } from '../pages/ParticipantManagementPage';

// Admin Pages
import { AdminDashboard } from '../pages/AdminDashboard';
import { EventApprovalPage } from '../pages/EventApprovalPage';
import { UserManagementPage } from '../pages/UserManagementPage';
import { CategoryManagementPage } from '../pages/CategoryManagementPage';
import { RegistrationMonitoringPage } from '../pages/RegistrationMonitoringPage';
import { PlatformReportsPage } from '../pages/PlatformReportsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<BrowseEventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
      </Route>

      {/* Auth Pages Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Gamer Protected Routes */}
      <Route
        path="/gamer"
        element={
          <ProtectedRoute allowedRoles={['ROLE_GAMER', 'GAMER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<GamerDashboard />} />
        <Route path="registrations" element={<MyRegistrationsPage />} />
        <Route path="tickets" element={<MyTicketsPage />} />
      </Route>

      {/* Organizer Protected Routes */}
      <Route
        path="/organizer"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ORGANIZER', 'ORGANIZER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<OrganizerDashboard />} />
        <Route path="events" element={<MyEventsPage />} />
        <Route path="events/create" element={<CreateEventPage />} />
        <Route path="tournaments" element={<TournamentManagementPage />} />
        <Route path="tickets" element={<TicketManagementPage />} />
        <Route path="participants" element={<ParticipantManagementPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="approvals" element={<EventApprovalPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="monitoring" element={<RegistrationMonitoringPage />} />
        <Route path="reports" element={<PlatformReportsPage />} />
      </Route>

      {/* User Profile Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
