import { Dispatch, ReactNode, SetStateAction, useRef } from 'react';
import { Transition } from 'react-transition-group';
import './Modal.scss';

const Modal = ({
    children,
    isOpen,
    setIsOpen
} : {
    children: ReactNode,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {

    const nodeRef = useRef(null);

    return (
        // <Transition
        //     nodeRef={nodeRef}
        //     in={isOpen}
        //     appear={true}
        //     timeout={300}
        // >
        //     {state => 
        <>
            {isOpen && <div className={`modal-wrapper`}>
                <div className="overlay"></div>
                <div className="modal">
                    {children}
                </div>
            </div>}
        </>
            // } </Transition>
    );
}

export default Modal;