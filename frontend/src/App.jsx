
import { Router, RouterProvider } from 'react-router-dom'
import router from './routes/routes'
import AuthProvider from './context/AuthProvider'
function App() {
  return (

    <RouterProvider router={router} />

  )
}

export default App
