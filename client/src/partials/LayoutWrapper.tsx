import { useEffect, useState, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import './LayoutWrapper.scss';

const LayoutWrapper = ({children} : {children: ReactNode}) => {

    const { isAuthenticated, user, logout, loginWithPopup } = useAuth0();

    const [accountName, setAccountName] = useState('');

    useEffect(() => {
        if (user?.name) {
            setAccountName(user?.name);
        } else if (user?.email) {
            setAccountName(user?.email);
        } else if (isAuthenticated) {
            setAccountName('User');
        }
    }, [isAuthenticated])

    const AccountDetails = () => {
        if (isAuthenticated) {
            return (<span className="account-info">Logged In as <strong>{accountName}</strong></span>);
        }
        return (<span>Login to Access</span>);
    }

    return (
        <>
            <div className='mobile-overlay-temp'>
                <div className='container-small'>
                    <h2>Heads Up!</h2>
                    <p>Observe currently only works on screen sizes larger than 1200px. A mobile responsive 
                        release will be coming shortly.
                    </p>
                </div>
            </div>
            <div className="page-header">
                <div className="container-max">
                    <Link to="/dashboard" className="logo-link">
                        <div className="observe-logo">
                            <img
                            src="/observe.svg"
                            width={150}
                            height={75}
                            alt="Observe by Culturehouse"
                            />
                        </div>
                    </Link>
                    <nav className="page-menu">
                        {isAuthenticated &&
                        <ul className="desktop-nav">
                            <li className="desktop-nav-item">
                                <Link to="/dashboard">Projects</Link>
                            </li>
                            <li className="desktop-nav-item">
                                <Link to="/help">Help</Link>
                            </li>
                        </ul>}
                        {isAuthenticated && <div className="user-ctas">
                            <AccountDetails />
                            <div className="call-to-actions">
                                {/* <Button 
                                    label="Account" 
                                    variation="cta"
                                /> */}
                                <Button 
                                    label="Logout" 
                                    variation="cta"
                                    onClick={() => {
                                        logout({ 
                                            logoutParams: {
                                              returnTo: window.location.origin
                                            }
                                          })
                                    }}
                                />
                            </div>
                        </div>}
                        {!isAuthenticated && 
                        <div className="login-action">
                            <Button 
                                label="Login" 
                                variation="cta"
                                onClick={() => loginWithPopup()}
                            />
                        </div>}
                    </nav>
                </div>
            </div>
            <div className="observe-content">
                {children}
            </div>
        </>
    )}

export default LayoutWrapper;