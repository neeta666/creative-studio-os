import { createBrowserRouter } from 'react-router-dom'
import VideoStudioPage  from '@/pages/VideoStudioPage'
import SocialAssetsPage from '@/pages/SocialAssetsPage'
import CopyWriterPage   from '@/pages/CopyWriterPage'
import PersonaPage      from '@/pages/PersonaPage'

/*
  Routes match sidebar nav items exactly:
  /          → Video Studio  (default landing)
  /social    → Social Assets
  /copy      → Copy Writer (BatchPanel lives here)
  /persona   → Persona selection
*/

const router = createBrowserRouter([
  { path: '/',        element: <VideoStudioPage /> },
  { path: '/social',  element: <SocialAssetsPage /> },
  { path: '/copy',    element: <CopyWriterPage /> },
  { path: '/persona', element: <PersonaPage /> },
  /*
  { path: '/history', element: <HistoryPage /> },
  { path: '/setup',   element: <SetupWizardPage /> },
  */
])

export default router
