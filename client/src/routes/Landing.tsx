import { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '../components/Button';
import './Landing.scss';

const ObserveHeader = () => (
    <div className="front-page-header">
      <img 
      src="/observe.svg" 
      width={300}
      />
    </div>
  )
  
  const EventCodeInput = ({navigate} : {
    navigate: NavigateFunction
  }) => {
    const [eventCode, setEventCode] = useState<string>('');
  
    return (
      <>
      <h2>Event Code</h2>
      <div className="flex-centered">
        <input 
          type="number"
          value={eventCode}
          onChange={(event) => setEventCode(event.target.value)}
          className="large-edit-input"
        >
        </input>
        <Button 
          variation="invert"
          label="Go"
          onClick={() => navigate(`/event/${eventCode}`)}
        />
      </div>
      </>
    )
  }

const Landing = () => { 
    const { 
        loginWithPopup, 
        isAuthenticated,
      } = useAuth0();

      const navigate = useNavigate();

      useEffect(() => {
        if (isAuthenticated) {
          navigate('/dashboard');
        }
      }, [isAuthenticated])

    return (
    <div className="observe-loaded container">
        <section className="flex-centered preview">
          <div className="centered">
            <ObserveHeader />
            <p><b>Welcome to Observe!</b> If you know your event code, please enter it in the 
            textbox on the right to add new observations.</p>
            <Button 
              variation="primary"
              label="Login or Signup"
              onClick={() => loginWithPopup()}
            />
          </div>
        </section>
        <section className="flex-centered actions">
          <div className="container flex-column flex-centered">
            <EventCodeInput navigate={navigate}/>
          </div>
        </section>
    </div>
)};

export default Landing;