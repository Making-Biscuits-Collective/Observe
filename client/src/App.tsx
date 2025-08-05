import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route } from 'react-router-dom';
import Landing from './routes/Landing';
import Project from './routes/Project';
import Dashboard from './routes/Dashboard';
import NewEvent from './routes/NewEvent';
import Event from './routes/Event';
import ActivityMapping from './routes/observations/ActivityMapping';
import Observations from './routes/observations/Observations';
import ActivityMappingEdit from './routes/observations/ActivityMappingEdit';
import Heatmaps from './routes/heatmaps/Heatmaps';
import CreateHeatmap from './routes/heatmaps/CreateHeatmap';
import EditHeatmap from './routes/heatmaps/EditHeatmap';
import Help from './routes/Help';
import MovingLines from './routes/observations/MovingLines';
import './App.scss';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/help" element={<Help />} />
        <Route path="/project/:projectId" element={<Project />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:projectId/newEvent" element={<NewEvent />} />
        <Route path="/event/:eventId/activityMapping" element={<ActivityMapping />} />
        <Route path="/event/:eventId/movingLines" element={<MovingLines />} />
        <Route path="/event/:eventId/observations" element={<Observations />} />
        <Route path="/event/:eventId/observations/edit/:observationId" element={<ActivityMappingEdit />} />
        <Route path="/event/:eventId" element={<Event />} />
        <Route path="/event/:eventId/heatmaps" element={<Heatmaps />} />
        <Route path="/event/:eventId/newHeatmap" element={<CreateHeatmap />} />
        <Route path="/event/:eventId/heatmaps/edit/:heatmapId" element={<EditHeatmap />} />
      </Routes>

    </div>
  );
}

export default App;
