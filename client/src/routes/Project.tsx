import { useParams } from 'react-router-dom';
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import LayoutWrapper from "../partials/LayoutWrapper";
import { supabase, getImageURLFromBucket } from '../utils/supabase';
import { 
    ProjectLoadingState, 
    Project as ProjectType,
    Event as EventType
} from '../types/types';
import Loading from '../components/Loading';
import './Project.scss';
import Button from '../components/Button';
import Alert, { AlertType } from '../components/Alert';
import { Link } from 'react-router-dom';

const EventsView = ({
    events,
    projectId
} : {
    events: EventType[],
    projectId: string | undefined
}) => {

    const EventCard = ({eventData, children} : {
        eventData?: EventType,
        children?: ReactNode
    }) => (
        <div className="event-card">
            {children ? children : 
            <>
                <h3 className="event-card-name">{eventData?.title}</h3>
                <div className="event-card-detail">
                    <span className="icon">
                        <img src="/icon/calendar.svg" width={16}/>
                    </span>
                    {eventData?.date}
                </div>
                <div className="event-card-detail">
                    <span className="icon">
                        <img src="/icon/calendar.svg" width={16}/>
                    </span>
                    {eventData?.location}</div>
                <div className="event-card-detail observations-total">0 observations</div>
            </>
            }
        </div>
    )

    return (
        <section className="project-events">
            <div className="container-max">
                <h2 className="section-title">Events</h2>
                <div className="events-grid">
                    {events.map((eventData) => <>
                        <Link to={`/event/${eventData.id}`}>
                            <EventCard eventData={eventData}/>
                        </Link>
                    </>)}
                    <Link to={`/project/${projectId}/newEvent`}>
                        <EventCard>
                            <div className="create-event">
                                + Add New Event
                            </div>
                        </EventCard>
                    </Link>
                </div>
            </div>
        </section>
    )
}

const ModeView = ({editMode, setEditMode} : {
    editMode: boolean,
    setEditMode: Dispatch<SetStateAction<boolean>>,
}) => (
<div className="page-mode">
    <div 
    className={`mode-button${!editMode ? ' active' : ''}`}
    onClick={() => setEditMode(false)}
    >
    <span>
        <img 
            src={'/icon/eye.svg'} 
            width={16} 
            height={16}
            alt='View Mode'
        />
    </span>
    <span>View Mode</span>
    </div>
    <div 
    className={`mode-button${editMode ? ' active' : ''}`}
    onClick={() => setEditMode(true)}  
    >
    <span>
        <img 
        src={'/icon/pencil.svg'} 
        width={16} 
        height={16}
        alt='Edit Mode'
        />
    </span>
    <span>Edit Mode</span>
    </div>
</div>
);

const EditableProjectContent = ({
    editMode,
    setEditMode,
    title, 
    startDate, 
    endDate, 
    imagePath,
    shortDescription, 
    description,
    projectId,
    updateEditStatus,
    isAlertOpen,
    setIsAlertOpen,
    updateProjectData,
    imageURL
} : {
    editMode: boolean,
    setEditMode: Dispatch<SetStateAction<boolean>>,
    title: string,
    startDate?: string,
    endDate?: string, 
    imagePath?: string,
    shortDescription: string,
    description: string,
    projectId: number,
    updateEditStatus: Dispatch<SetStateAction<AlertType>>,
    isAlertOpen: boolean,
    setIsAlertOpen: Dispatch<SetStateAction<boolean>>,
    updateProjectData: Dispatch<SetStateAction<ProjectType>>,
    imageURL: string | undefined
}) => {

    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

    // Edited Project State
    const [editedTitle, setEditedTitle] = useState<string>(title);

    async function updateProject() {
        const { 
            status,
            error
        } = await supabase
        .from('projects')
        .update({
            title: editedTitle
        }) 
        .eq('id', projectId)
        .select();

        if (error) {
            console.log('Error updating project');
            updateEditStatus("ERR");
            setIsAlertOpen(true);
        } else {
            console.log('Project updated successfully', status);
            updateEditStatus("CONF");
            setIsAlertOpen(true);
            setEditMode(false);
            updateProjectData(prevData => ({ ...prevData, title: editedTitle }))
        }
 
        console.log('Project updated!')
    }

    return (
        <div className="container-max project-info">
            {editMode && 
                <div className="toolbar">
                    <div className="toolbar-actions">
                        <Button variation="primary" label="Save Changes" onClick={() => updateProject()}/>
                        <Button variation="primary" label="Cancel" onClick={() => setEditMode(false)}/>
                    </div>
                </div>
            }
            <div className="project-image">
                    <img src={imageURL} alt={title}/>
            </div>
            <div className="project-details">
                {editMode ? 
                    <>
                        <input type="text" 
                            value={editedTitle} 
                            onChange={
                                (event) => setEditedTitle(event.target.value)
                            }
                            className="large-edit-input"
                        />
                    </>
                : 
                    <h1 className="project-title">{title}</h1>}
                <h2 className="project-date">
                    <img src="/icon/calendar.svg" width={16}/>
                    {startDate}
                </h2>
                <p className="project-description">
                    {showFullDescription ? description : (
                        shortDescription ? shortDescription : description
                    )}    
                </p>
                {showFullDescription ? 
                <Button variation="text" label="Collapse -" onClick={
                    () => setShowFullDescription(false)
                }/> :
                <Button variation="text" label="Read More +" onClick={
                    () => setShowFullDescription(true)
                }/>}
            </div>
        </div>
    )
}

const ProjectContent = ({
    projectData,
    updateProjectData,
    loadedProjectImageURL
}: {
    projectData: ProjectType,
    updateProjectData: Dispatch<SetStateAction<ProjectType>>,
    loadedProjectImageURL: string | undefined
}) => {

    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedStatus, setEditedStatus] = useState<AlertType>('');
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

    const {
        title,
        start_date,
        end_date,
        image_path,
        short_description: shortDescription,
        description,
        id: projectId
    } = projectData;

    return (
        <>
            <section className="project">
                <Alert 
                    isOpen={isAlertOpen} 
                    setIsOpen={setIsAlertOpen}
                    variation={editedStatus}
                    message="Your project was saved successfully" //TODO: update for failures
                />
                <div className="container-max flex-centered">
                    <ModeView 
                        editMode={editMode} 
                        setEditMode={setEditMode}
                    />
                </div>
                <EditableProjectContent 
                    editMode={editMode}
                    setEditMode={setEditMode}
                    title={title}
                    startDate={start_date}
                    endDate={end_date}
                    imagePath={image_path}
                    shortDescription={shortDescription}
                    description={description}
                    projectId={projectId}
                    updateEditStatus={setEditedStatus}
                    isAlertOpen={isAlertOpen}
                    setIsAlertOpen={setIsAlertOpen}
                    updateProjectData={updateProjectData}
                    imageURL={loadedProjectImageURL}
                />
            </section>
        </>
    )
}

const Project = () => {

    const { projectId } = useParams();

    const [loadedProjectImageURL, setLoadedProjectImageURL] = useState<string | undefined>('');
    const [currentProjectData, setCurrentProjectData] = useState<ProjectType>({
        title: '',
        short_description: '',
        description: '',
        id: -1
    });
    const [events, setEvents] = useState<EventType[]>([]);
    const [projectLoadingState, setProjectLoadingState] = useState<ProjectLoadingState>("LOADING");

    /**
     * Grabs project data by the given project ID
     */
    async function getProjectById() {
       
        const { data, error } = await supabase
        .from('projects')
        .select('*') // Or specify columns like 'id,name,...'
        .eq('id', projectId)
        .limit(1) as { data: ProjectType[] | null, error: any }; 

        if (error) {
            console.log('This project does not exist or something went wrong.')
            setProjectLoadingState("ERROR")
        }

        const projectData: ProjectType | undefined = data?.[0];

        // Confirm project exists then grab event data
        if (projectData) {
            setCurrentProjectData(projectData);
            getImageURLFromBucket({
                imagePath: projectData.image_path,
                bucket: 'project-photos'
            }).then(imageURL => {
                setLoadedProjectImageURL(imageURL);
            });
            
            setLoadedProjectImageURL(projectData.image_path);
            const { data: eventsData, error } = 
                await supabase
                    .from('events')
                    .select('*')
                    .eq('project', projectId) as { data: EventType[] | null, error: any}
            
            if (error) {
                console.error('There was a problem fetching events for this project.');
                setProjectLoadingState("ERROR");
            }

            if (eventsData) {
                setEvents(eventsData);
            }

            setProjectLoadingState("LOADED")
        } 

    }

    /**
     * Fire on mount
     */
    useEffect(() => {
        getProjectById();
    }, [])

    return (
        <LayoutWrapper>
            <div className="observe-project">
                {projectLoadingState == 'LOADING' && <Loading />}
                {projectLoadingState == 'LOADED' && 
                <>
                    <ProjectContent 
                        projectData={currentProjectData} 
                        updateProjectData={setCurrentProjectData}
                        loadedProjectImageURL={loadedProjectImageURL}
                    />
                    <EventsView 
                        events={events}
                        projectId={projectId}
                    />
                </>
                }
            </div>
        </LayoutWrapper>
    )

}

export default Project;