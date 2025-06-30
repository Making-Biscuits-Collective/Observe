import { Transition } from 'react-transition-group';
import { MouseEventHandler, useRef, useEffect, SetStateAction, Dispatch } from 'react';
import './Alert.scss';

export type AlertType = "CONF" | "WARN" | "ERR" | "";

const Alert = ({
    message, 
    variation, 
    isOpen, 
    setIsOpen,
    customCallback
} : {
    message: string,
    variation: AlertType,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    customCallback?: () => void
}) => {

    const nodeRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            setIsOpen(false);
            if (customCallback) {
                customCallback();
            }
        }, 5000)
    }, [isOpen])

    return (
        <Transition
            nodeRef={nodeRef}
            in={isOpen}
            appear={true}
            timeout={300}
        >
            {state => (
                <div 
                    className={`alert ${variation} ${state}`}
                    ref={nodeRef}
                >
                    <span className="alert-icon"></span>
                    <span className="alert-message">{message}</span>
                </div>
            )}
        </Transition>
    );
}

export default Alert;
