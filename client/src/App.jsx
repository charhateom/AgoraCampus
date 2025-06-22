import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage';
import {Toaster} from 'react-hot-toast'
import { AuthContext } from './context/AuthContext';
import CommunityPage from './pages/CommunityPage'; 

const App = () => {
  const {authUser} = useContext(AuthContext);

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
     
    <Toaster/>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login"/>} />
        <Route path='/login' element={!authUser ? <LoginPage />: <Navigate to="/"/>} />
        <Route path='/profile' element={authUser?<ProfilePage />: <Navigate to="/login"/>} />
         <Route path='/community' element={authUser ? <CommunityPage /> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  );
};

export default App;
