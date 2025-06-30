import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '../components/Button';
import './Landing.scss';
import { useNavigate } from 'react-router-dom';

const ObserveHeader = () => (
    <div className="front-page-header">
      <img 
      src="/observe.svg" 
      width={300}
      />
    </div>
  )
  
  const EventCodeInput = () => {
    const [eventCode, setEventCode] = useState<string>('');
  
    return (
      <div className="flex-centered">
        <input 
          type="number"
          value={eventCode}
          onChange={(event) => setEventCode(event.target.value)}
        >
        </input>
        <Button 
          variation="invert"
          label="Go"
          onClick={() => {}}
        />
      </div>
    )
  }

const Landing = () => { 
    const { 
        loginWithRedirect, 
        isAuthenticated
      } = useAuth0();

      const navigate = useNavigate();

      useEffect(() => {
        if (isAuthenticated) {
          navigate('/dashboard');
        }
      }, [isAuthenticated])

    return (
    <div className="observe-loaded">
        <section className="flex-centered preview">
          <div className="container">
            <ObserveHeader />
          </div>
        </section>
        <section className="flex-centered actions">
          <div className="container flex-column flex-centered">
            <h1 className="page-title">
              Welcome to Observe!
            </h1>
            <p>If you know your event code, enter it below to get started.</p>
            <EventCodeInput />
            <Button 
              variation="invert"
              label="Login / Signup"
              size="small"
              onClick={() => loginWithRedirect()}
            />
          </div>
        </section>
    </div>
)};

export default Landing;