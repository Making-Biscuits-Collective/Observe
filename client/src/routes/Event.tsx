import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutWrapper from '../partials/LayoutWrapper';
import { Event as EventType, Data } from '../types/types';
import { getEventById, getProjectById, getImageURLFromBucket, deleteEvent} from '../utils/supabase';
import './Event.scss';
import Button from '../components/Button';
import Modal from "../components/Modal";

const ModalContent = ({
    eventTitle,
    confirmDelete,
    setDeleteModalIsOpen
} : {
    eventTitle: string,
    confirmDelete: () => void,
    setDeleteModalIsOpen: Dispatch<SetStateAction<boolean>>
}) => (
    <div className="delete-modal">
        <h2 className="modal-title">Are you sure?</h2>
        <div className="modal-description">
            Deleting {eventTitle} will also delete all associated observations. This action cannot be undone.
        </div>
    
        <div className="flex-centered">
            <Button label="Delete" variation="primary" onClick={confirmDelete}/>
            <Button label="Cancel" variation="primary" onClick={() => setDeleteModalIsOpen(false)}/>
        </div>
    </div>
)

const Event = () => {

    const navigate = useNavigate();

    const { eventId } = useParams();

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

    const [eventData, setEventData] = useState<EventType>({
        title: '',
        date: '',
        location: '',
        map_path: ''
    });
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [loadedMapURL, setLoadedMapURL] = useState('');

    const getEventInfo = ({data, error}: Data<EventType[]>) => {


        if (error) {
            console.error('Oops, we had trouble fetching the event data!', error);
        } else {
            if (data) {
                const eventInfo: EventType | undefined = data?.[0];
                // Grab Map from Bucket
                getImageURLFromBucket({
                    imagePath: eventInfo.map_path,
                    bucket: 'event-maps'
                }).then(imageURL => {
                    setLoadedMapURL(imageURL);
                });

                // Grab Project Data as well
                if (eventInfo) {
                    setEventData(eventInfo);
                    console.log(eventInfo);
                    getProjectById(eventInfo.project, 'title, description').then(({data, error})=> {
                        if (error) {
                            console.log('Error fetching project data');
                        }
                        const dataProjectName: string | undefined = data?.[0].title;
                        const dataProjectDesc: string | undefined = data?.[0].description;
                        setProjectName(dataProjectName || '');
                        setProjectDesc(dataProjectDesc || '');
                    })
                    
                    
                    if (error) {
                        console.log('Error fetching project data');
                    }

                }
            }
        }
    }

    const onDeleteConfirm = () => {
            const projectId = eventData.project;
            deleteEvent(eventId).then(({status, error}) => {
                if(error) {
                    console.log(error)
                }
    
                console.log('Event deleted successfully', status);
                navigate(`/project/${projectId}`);
            })
        }

    useEffect(() => {
        getEventById(eventId).then(({ data, error }) => {
            getEventInfo({ data: data as EventType[] | null, error });
          });
    }, [])

    return (
        <>
        {deleteModalIsOpen && <Modal 
            isOpen={deleteModalIsOpen}
            setIsOpen={setDeleteModalIsOpen}
        >
            <ModalContent 
                eventTitle={eventData.title}
                setDeleteModalIsOpen={setDeleteModalIsOpen}
                confirmDelete={onDeleteConfirm}
            />
        </Modal>}
        
            <LayoutWrapper>
                <section className="observe-event-page">
                    <div className="container-max">
                        <div className="title">
                            <div className="page-title-box">
                                <h1 className="page-title">{eventData.title}</h1>
                                <img src="/icon/delete.svg" className="project-title-delete" width={26} onClick={() => setDeleteModalIsOpen(true)}/>
                            </div>
                            <h2 className="project-title">{projectName}</h2>
                        </div>
                        <div className="event-code-container">
                            <label htmlFor="event-code">Event Code</label>
                            <input type="text" value={eventData.id} className="event-code" disabled/>
                        </div>
                    </div>
                    <div className="map-container container-max">
                        <div className='actions'>
                            <Button 
                                label='Manage Observations' 
                                variation='primary'
                                onClick={() => navigate(`/event/${eventId}/activityMapping`)}
                            />
                            <Button 
                                label='Manage Heatmaps' 
                                variation='primary'
                                onClick={() => {}}
                            />
                        </div>
                        <div className='image-container'>
                            <img src={loadedMapURL} />
                        </div>
                    </div>
                    <div className="container-max grid">
                        <div className="event-information">
                            <span className="event-date">
                                <img src="/icon/calendar.svg" width={20} className="icon"/> {eventData.date}
                            </span>
                            <span className="event-location">
                                <img src="/icon/location.svg" width={20} className="icon"/> {eventData.location}
                            </span>
                        </div>
                        <div className="project-info">
                            <h2 className="project-title">About This Project</h2>
                            {projectDesc}
                        </div>
                    </div>
                </section>
            </LayoutWrapper>
        </>
    )
}

export default Event;