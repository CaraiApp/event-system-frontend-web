import Footer from './pages/Footer'
import Header from './pages/Header'
import {Outlet} from "react-router-dom"
import DebugPanel from './components/DebugPanel/DebugPanel'

export default function Layout() {
  return (
    <div className='flex flex-col min-h-screen'> 
      <Header />
      <Outlet />
      <Footer />
      <DebugPanel />
    </div>
  )
}
