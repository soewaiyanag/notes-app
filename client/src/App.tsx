import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PreferencesProvider } from '@/context/PreferencesContext'
import { NotesProvider } from '@/context/NotesContext'
import { ToastProvider } from '@/context/ToastContext'
import ProtectedRoute from '@/routes/ProtectedRoute'
import GuestRoute from '@/routes/GuestRoute'
import AppLayout from '@/layouts/AppLayout'

import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'

import AllNotesPage from '@/pages/AllNotesPage'
import ArchivedNotesPage from '@/pages/ArchivedNotesPage'
import TagPage from '@/pages/TagPage'
import TagsIndexPage from '@/pages/TagsIndexPage'
import SearchPage from '@/pages/SearchPage'

import SettingsLayout from '@/pages/settings/SettingsLayout'
import ColorThemePage from '@/pages/settings/ColorThemePage'
import FontThemePage from '@/pages/settings/FontThemePage'
import ChangePasswordPage from '@/pages/settings/ChangePasswordPage'

export default function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <NotesProvider>
          <ToastProvider>
            <Routes>
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<AllNotesPage />} />
                  <Route path="/archived" element={<ArchivedNotesPage />} />
                  <Route path="/tags" element={<TagsIndexPage />} />
                  <Route path="/tags/:tag" element={<TagPage />} />
                  <Route path="/search" element={<SearchPage />} />

                  <Route path="/settings" element={<SettingsLayout />}>
                    <Route path="color-theme" element={<ColorThemePage />} />
                    <Route path="font-theme" element={<FontThemePage />} />
                    <Route path="change-password" element={<ChangePasswordPage />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </NotesProvider>
      </PreferencesProvider>
    </AuthProvider>
  )
}
