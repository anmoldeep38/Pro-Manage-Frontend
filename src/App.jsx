import './styles/App.css'

import { Route, Routes } from 'react-router-dom'

import Login from './pages/auth/Login'
import ProtectedRoute from './pages/auth/ProtectedRoute';
import Signup from './pages/auth/Signup'
import UnprotectedRoute from './pages/auth/UnprotectedRoute';
import Analytics from './pages/dashboard/Analytics'
import Board from './pages/dashboard/Board'
import Settings from './pages/dashboard/Settings'
import ViewTask from './pages/dashboard/ViewTask';
import NotFound from './pages/NotFound';

function App() {

  return (
    <>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route element={<UnprotectedRoute />}>
          <Route path='/' element={<Signup />} />
          <Route path='/login' element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path='/board' element={<Board />} />
          <Route path='/analytics' element={<Analytics />} />
          <Route path='/settings' element={<Settings />} />
        </Route>
        <Route path='/task/:taskId' element={<ViewTask />} />
      </Routes>
    </>
  )
}

export default App
