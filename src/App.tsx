import { Routes, Route, Navigate } from 'react-router'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import HomeCalm from './pages/HomeCalm'
import HomeModern from './pages/HomeModern'
import HomeMinimal from './pages/HomeMinimal'
import HomeShowcase from './pages/HomeShowcase'
import HomeShowcase2 from './pages/HomeShowcase2'
import About from './pages/About'
import Services from './pages/Services'
import Operators from './pages/Operators'
import Resources from './pages/Resources'
import Regulations from './pages/Regulations'
import Connect from './pages/Connect'
import AdminDashboard from './pages/admin/Dashboard'
import MobileApp from './pages/MobileApp'
import Performance from './pages/Performance'
import Article from './pages/news/Article'
import NewsCatalog from './pages/NewsCatalog'
import NotFound from './pages/NotFound'
import Chronicles from './pages/Chronicles'
import Media from './pages/Media'
import ServiceCharter from './pages/ServiceCharter'
import PensionAct from './pages/PensionAct'
import RegDocPage from './pages/RegDocPage'
import ReportPage from './pages/ReportPage'
import FormsChecklists from './pages/FormsChecklists'

export default function App() {
  return (
    <Routes>
      {/* Main website with Layout (Header + Footer + Chatbot) */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomeModern />} />
        <Route path="/home-retirees" element={<HomeCalm />} />
        <Route path="/home-minimal" element={<HomeMinimal />} />
        <Route path="/home-showcase" element={<HomeShowcase />} />
        <Route path="/home-showcase2" element={<HomeShowcase2 />} />
        <Route path="/home-classic" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/operators" element={<Operators />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/faq" element={<Resources />} />
        <Route path="/regulations" element={<Regulations />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/news" element={<NewsCatalog />} />
        <Route path="/news/:slug" element={<Article />} />
        <Route path="/chronicles" element={<Chronicles />} />
        <Route path="/media" element={<Media />} />
        <Route path="/about/service-charter" element={<ServiceCharter />} />
        <Route path="/regulations/pension-reform-act" element={<PensionAct />} />
        <Route path="/regulations/doc/:id" element={<RegDocPage />} />
        <Route path="/resources/reports/q1-2026" element={<ReportPage />} />
        <Route path="/resources/forms-and-checklists" element={<FormsChecklists />} />
        <Route path="/resources/chronicles" element={<Navigate to="/chronicles" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      {/* Standalone routes (no Layout) */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/mobile" element={<MobileApp />} />
    </Routes>
  )
}
