import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing'
import { Checklist } from './pages/Checklist'
import { Intake } from './pages/Intake'
import { Dashboard } from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/check" element={<Checklist />} />
          <Route path="/talk" element={<Intake />} />
          <Route path="/research" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
