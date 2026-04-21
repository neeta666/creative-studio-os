import { createBrowserRouter } from 'react-router-dom'
import HomePage    from '@/pages/HomePage'
import PersonaPage from '@/pages/PersonaPage'

/*
  Add new routes here as you build each feature.
  import BatchPage        from '@/pages/BatchPage'
  import HistoryPage      from '@/pages/HistoryPage'
  import SetupWizardPage  from '@/pages/SetupWizardPage'
*/

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/persona',
    element: <PersonaPage />,
  },
  /*
  { path: '/batch',   element: <BatchPage /> },
  { path: '/history', element: <HistoryPage /> },
  { path: '/setup',   element: <SetupWizardPage /> },
  */
])

export default router
