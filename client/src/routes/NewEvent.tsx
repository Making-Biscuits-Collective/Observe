import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import LayoutWrapper from '../partials/LayoutWrapper';
import Breadcrumb from '../components/Breadcrumb';
import './NewEvent.scss';
import { Project as ProjectType, Data, EventCode } from '../types/types';
import {getProjectById, uploadEventMap, createNewEvent } from '../utils/supabase';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Event } from '../types/types';

type ProjectTitle = { title: string }
type CreateProject = 'IDLE' | 'ERROR' | 'CONF';

const NewEventConfirmation = ({
    projectId,
    eventId,
    eventCode,
    eventName,
    isOpen,
    setIsOpen,
    resetValues
} : {
    projectId: string;
    eventId: string;
    eventCode: string;
    eventName: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    resetValues: () => void;
}) => {

    const navigate = useNavigate();
    const eventUrlString = `https://observe.culturehouse.cc/event/${eventId}`

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <>
                <h2 className="modal-title">Event Created</h2>
                <p>Your event <strong>{eventName}</strong> has been created! Use the following event code 
                or share the event URL to let other folks add observations.</p>
                <div className="navigate-event">
                    <div className="unique-event-code">{eventCode}</div>
                    <input 
                        type="text" 
                        value={eventUrlString}
                        className="event-code"
                    />
                    <div className="navigate-event-actions">
                        <Button 
                            variation="primary" 
                            label="View Event" 
                            onClick={() => navigate(`/event/${eventId}`)}
                        />
                        <Button 
                            variation="primary" 
                            label="Create Another Event" 
                            onClick={resetValues}
                        />
                    </div>
                </div>
            </>
        </Modal>
    )
}

const DefineLabels = ({eventInfo, setEventInfo} : {
    eventInfo: Event;
    setEventInfo: Dispatch<SetStateAction<Event>>;
}) => {
    return (
        <div className='label-definition'>
            <div className="col">
                <div className='label-item'>
                    <img src='/markers/activity-mapping/0.svg' width={24}/>
                    <input 
                        type='text' 
                        value={eventInfo.label_mapping0} 
                        onChange={(event) => setEventInfo((prevState) => ({
                            ...prevState,
                            label_mapping0: event.target.value
                        }))}
                    />
                    <img src='/icon/pencil.svg' width={18} height={18} className='bg-ico'/>
                </div>
                <div className='label-item'>
                    <img src='/markers/activity-mapping/1.svg' width={24}/>
                    <input 
                        type='text' 
                        value={eventInfo.label_mapping1} 
                        onChange={(event) => setEventInfo((prevState) => ({
                            ...prevState,
                            label_mapping1: event.target.value
                        }))}
                    />
                    <img src='/icon/pencil.svg' width={18} height={18} className='bg-ico'/>
                </div>
                <div className='label-item'>
                    <img src='/markers/activity-mapping/2.svg' width={24}/>
                    <input 
                        type='text' 
                        value={eventInfo.label_mapping2} 
                        onChange={(event) => setEventInfo((prevState) => ({
                            ...prevState,
                            label_mapping2: event.target.value
                        }))}
                    />
                    <img src='/icon/pencil.svg' width={18} height={18} className='bg-ico'/>
                </div>
            </div>
            <div className="col">
                <div className='label-item'>
                    <img src='/markers/activity-mapping/3.svg' width={24}/>
                    <input 
                        type='text' 
                        value={eventInfo.label_mapping3} 
                        onChange={(event) => setEventInfo((prevState) => ({
                            ...prevState,
                            label_mapping3: event.target.value
                        }))}
                    />
                    <img src='/icon/pencil.svg' width={18} height={18} className='bg-ico'/>
                </div>
                <div className='label-item'>
                    <img src='/markers/activity-mapping/4.svg' width={24}/>
                    <input 
                        type='text' 
                        value={eventInfo.label_mapping4} 
                        onChange={(event) => setEventInfo((prevState) => ({
                            ...prevState,
                            label_mapping4: event.target.value
                        }))}
                    />
                    <img src='/icon/pencil.svg' width={18} height={18} className='bg-ico'/>
                </div>
            </div>
        </div>
    )
}

const NewEvent = () => {

    const { projectId } = useParams();
    const navigate = useNavigate();

    const [projectName, setProjectName] = useState<string>('');
    const [validProjectState, setValidProjectState] = useState<boolean>(true);
    const [eventInfo, setEventInfo] = useState<Event>({
        title: '',
        date: '',
        location: '',
        map_path: '',
        notes: '',
        label_mapping0: 'Sitting',
        label_mapping1: 'Standing',
        label_mapping2: 'Laying Down',
        label_mapping3: 'Idling',
        label_mapping4: 'Other',
    });

    const [createStatus, setCreateStatus] = useState<CreateProject>('IDLE');
    const [mapFile, setMapFile] = useState<File | null>(null);
    const [mapPreviewUrl, setMapPreviewUrl] = useState('');
    const [eventCreated, setEventCreated] = useState<boolean>(false);
    const [newEventId, setNewEventId] = useState<string>('');
    const [disableSubmission, setDisableSubmission] = useState<boolean>(true);
    const [eventCode, setEventCode] = useState<string>('');

    function resetValues() {
        setProjectName('');
        setEventInfo({
            title: '',
            date: '',
            location: '',
            map_path: '',
            notes: '',
        });
        setEventCreated(false);
    }

    const getBasicProjectInfo = ({data, error}: Data<ProjectType[]>) =>{


        if (error) {
            console.error('Hmm, it looks like this project does not exist!');
            setValidProjectState(false);
        } else {
            if (data) {
                setProjectName(data?.[0]?.title)
            }
        }

    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const image = event.target.files?.[0];
        if (image) {
            setMapFile(image);
            setEventInfo(
                (prevState) => ({
                    ...prevState,
                    map_path: image.name
                })
            )
        } else {
            setMapFile(null);
            setMapPreviewUrl('');
            setEventInfo(
                (prevState) => ({
                    ...prevState,
                    map_path: ''
                })
            )
        }
    }

    useEffect(() => {
        getProjectById(projectId, 'title').then(({data, error}) => 
            getBasicProjectInfo({data, error}));
    }, [])

    useEffect(() => {
        if (!mapFile) {
            setMapPreviewUrl('');
            return;
        }
        const objectURL = URL.createObjectURL(mapFile);
        setMapPreviewUrl(objectURL);

        return () => URL.revokeObjectURL(objectURL);
    }, [mapFile])

    useEffect(() => {
        if (mapFile && (
                eventInfo.title?.length > 0 &&
                eventInfo.date?.length > 0 &&
                eventInfo.location?.length > 0 &&
                eventInfo.map_path?.length > 0
            )) {
            setDisableSubmission(false);
        }
    }, [mapFile, eventInfo])

    const createEvent = () => {
        if (mapFile) { // Upload this to the event maps bucket

            uploadEventMap(mapFile).then(({ data: image, error: mapError }) => {

                if (mapError) {
                    console.error('There was a problem uploading your event map.', mapError);
                }

                createNewEvent({ 
                    title: eventInfo.title,
                    date: eventInfo.date,
                    location: eventInfo.location,
                    map_path: image?.path as string,
                    notes: eventInfo.notes,
                    project: projectId 
                }).then(({ data: event, error: dataError}) => {

                    if (dataError) {
                        console.error('There was a problem creating this event.', dataError);
                        setCreateStatus('ERROR');
                    } else {
                        const newEvent: EventCode | null = event?.[0];
                        if (newEvent) {
                            setNewEventId(newEvent.eventId);
                            setEventCode(newEvent.eventCode);
                            setEventCreated(true);
                            setCreateStatus('CONF');
                        }
                    }
                })
            })
        }
    }

    return (
        <LayoutWrapper>
            <div className="observe-event-creation">
                <div className="container-max">
                    <Breadcrumb 
                        label="Back to Event"
                        path={`/project/${projectId}`}
                        showIcon
                    />
                    <h1 className="page-title">Create New Event</h1>
                    <div className="new-event-form">
                        <div className="text-form">
                            <div className="new-event-intro">
                            <p>You are creating a new event for <Link to="">{projectName}</Link>. If you want to create an event 
                            for a different project, please do so from that project's event page. Visit the "Projects" tab in the 
                            navigation to view all projects you have access to.</p>

                            <p>Once you finish creating your event, you'll be able to add observations.</p>
                            </div>
                            <DefineLabels eventInfo={eventInfo} setEventInfo={setEventInfo}/>
                            <div className="input-box">
                                <label htmlFor="event-title" className="required">Event Title</label>
                                <input 
                                    type="text" 
                                    id="event-title" 
                                    value={eventInfo.title}
                                    placeholder="Event Title"
                                    onChange={(event) => setEventInfo(
                                        (prevState) => ({
                                            ...prevState,
                                            title: event.target.value
                                        })
                                    )}
                                />
                            </div>
                            <div className="input-box">
                                <label htmlFor="event-date" className="required">Event Date</label>
                                <input 
                                    type="date" 
                                    id="event-date" 
                                    name="event-date" 
                                    onChange={(event) => setEventInfo(
                                        (prevState) => ({
                                            ...prevState,
                                            date: event.target.value
                                        })
                                    )}
                                />
                            </div>
                            <div className="input-box">
                                <label htmlFor="event-type" className="required">Event Type</label>
                                <select name="event-type" id="event-type" disabled>
                                    <option value="activity-mapping">Activity Mapping</option>
                                </select>
                            </div>
                            <div className="input-box">
                                <label htmlFor="event-location" className="required">Event Location</label>
                                <input 
                                    type="text" 
                                    id="event-location" 
                                    value={eventInfo.location}
                                    placeholder="Event Location"
                                    onChange={(event) => setEventInfo(
                                        (prevState) => ({
                                            ...prevState,
                                            location: event.target.value
                                        })
                                    )}
                                />
                            </div>
                            <div className="input-box">
                                <label htmlFor="event-notes">Notes</label>
                                <textarea 
                                    id="event-notes" 
                                    value={eventInfo.notes}
                                    placeholder="Any additional notes"
                                    onChange={(event) => setEventInfo(
                                        (prevState) => ({
                                            ...prevState,
                                            notes: event.target.value
                                        })
                                    )}
                                />
                            </div>
                            <Button 
                                variation="primary"
                                label="Create Event"
                                onClick={() => createEvent()}
                                disabled={disableSubmission}
                            />
                            <NewEventConfirmation 
                                projectId={projectId || ''}
                                eventId={newEventId}
                                eventCode={eventCode}
                                eventName={eventInfo.title}
                                isOpen={eventCreated}
                                setIsOpen={setEventCreated}
                                resetValues={resetValues}
                            />
                        </div>
                        <div className="map-form">
                            <div className="map-actions">
                                <label htmlFor="event-image" className="file-upload">
                                    Upload Event Image <img src="/icon/upload.svg" width={16}/>
                                </label>
                                <div className="existing-image">
                                    <Button 
                                        variation="primary" 
                                        label="PICK EXISTING MAP" 
                                    />
                                </div>
                            </div>
                            <input 
                                type="file" 
                                id="event-image" 
                                name="event-image" 
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                            />
                            <div className="image-preview-container">
                                {mapPreviewUrl && <img src={mapPreviewUrl} />}
                                {!mapPreviewUrl && <p>Please upload an image for your map.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    )
}

export default NewEvent;