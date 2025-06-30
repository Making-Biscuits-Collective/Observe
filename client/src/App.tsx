import React, { ReactElement, ReactNode, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Landing from './routes/Landing';
import Project from './routes/Project';
import Dashboard from './routes/Dashboard';
import NewEvent from './routes/NewEvent';
import Event from './routes/Event';
import ActivityMapping from './routes/observations/ActivityMapping';
import './App.scss';
import Loading from './components/Loading';
import { supabase } from './utils/supabase'

function App() {
  const { 
    loginWithRedirect, 
    getAccessTokenSilently, 
    isAuthenticated 
  } = useAuth0();

  // useEffect(() => {
  //   async function getToken() {
  //     try {
  //       const accessToken = await getAccessTokenSilently({
  //         authorizationParams: {
  //           audience: `https://observe.culturehouse.cc`,
  //         },
  //       });

  //       console.log(accessToken);
  //     } catch (error) {
  //       console.error('Error fetching access token:', error);
  //     }
  //   }
  //   getToken();
  // }, [])

  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/project/:projectId" element={<Project />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:projectId/newEvent" element={<NewEvent />} />
        <Route path="/event/:eventId/activityMapping" element={<ActivityMapping />} />
        <Route path="/event/:eventId" element={<Event />} />
      </Routes>

    </div>
  );
}

export default App;
