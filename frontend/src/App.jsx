import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from "./components/Layout"

import Dashboard from "./pages/Dashboard"
import Expenses from "./pages/Expenses"
import AdminRoute from "./components/AdminRoute"
import ExpenseForm from "./pages/ExpensesForm"

import Collections from "./pages/Collections"

import Admin from "./pages/Admin"
import CreateForm from "./pages/CreateForm"

/* NEW PAGES */
import FormsList from "./pages/FormsList"
import EditForm from "./pages/EditForm"
import ViewForm from "./pages/ViewForm"
import InstallApp from "./components/InstallApp"
import PWAInstall from "./pages/PWAInstall"

function App() {

  return (
    <BrowserRouter>
      <PWAInstall/>

      <Layout>

        <Routes>

          {/* EXISTING ROUTES (UNCHANGED) */}

          <Route path="/" element={<Dashboard />} />

          <Route path="/installApp" element={<InstallApp />} />
          <Route path="/expenses" element={<Expenses />} />


          <Route path="/collections" element={<Collections />} />
          <Route path="/create-collection" element={<CreateForm />} />
          <Route path="/collections/new" element={<CreateForm />} />

          <Route path="/admin" element={<Admin />} />


          {/* NEW ADMIN FORM ROUTES */}
          <Route path="admin/expenses/new" element={
            <AdminRoute>
              <ExpenseForm />
            </AdminRoute>
          } />



          <Route path="/admin/forms" element={
            <AdminRoute>
              <FormsList />
            </AdminRoute>
          } />

          <Route path="/admin/forms/create" element={
            <AdminRoute>
              <CreateForm />
            </AdminRoute>
          } />

          <Route path="/admin/forms/edit/:id" element={
            <AdminRoute>
              <EditForm />
            </AdminRoute>
          } />

          <Route path="/admin/forms/:id" element={
            <AdminRoute>
              <ViewForm />
            </AdminRoute>
          } />


          {/* PUBLIC FORM */}

          <Route path="/form/:id" element={<ViewForm />} />

        </Routes>

      </Layout>

    </BrowserRouter>
  )
}

export default App