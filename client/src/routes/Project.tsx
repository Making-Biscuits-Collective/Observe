import { useParams, useNavigate } from 'react-router-dom';
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import LayoutWrapper from "../partials/LayoutWrapper";
import {
    getImageURLFromBucket,
    updateProject,
    getProjectById,
    getEventsByProjectId,
    deleteProject
} from '../utils/supabase';
import { 
    ProjectLoadingState, 
    Project as ProjectType,
    Event as EventType,
    Data
} from '../types/types';
import Loading from '../components/Loading';
import './Project.scss';
import Button from '../components/Button';
import Alert, { AlertType } from '../components/Alert';
import { Link } from 'react-router-dom';
import Modal from "../components/Modal";
import Breadcrumb from '../components/Breadcrumb';
import { formatDateToMonthDayYear } from '../utils/util';


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
                {/* <div className="event-card-detail observations-total">0 observations</div> */}
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

const ModalContent = ({
    projectTitle,
    confirmDelete,
    setDeleteModalIsOpen
} : {
    projectTitle: string,
    confirmDelete: () => void,
    setDeleteModalIsOpen: Dispatch<SetStateAction<boolean>>
}) => (
    <div className="delete-modal">
        <h2 className="modal-title">Are you sure?</h2>
        <div className="modal-description">
            Deleting {projectTitle} will also delete all associated events and observations. This action cannot be undone.
        </div>
    
        <div className="flex-centered">
            <Button label="Delete" variation="primary" onClick={confirmDelete}/>
            <Button label="Cancel" variation="primary" onClick={() => setDeleteModalIsOpen(false)}/>
        </div>
    </div>
)

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
    imageURL,
    setDeleteModalIsOpen
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
    imageURL: string | undefined,
    setDeleteModalIsOpen: Dispatch<SetStateAction<boolean>>
}) => {

    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

    // Edited Project State
    const [editedTitle, setEditedTitle] = useState<string>(title);
    const [editedDate, setEditedDate] = useState<string>(startDate || '')
    const [editedDesc, setEditedDesc] = useState<string>(description)

    const onEditProjectClick = () => {
        
        updateProject({
            title: editedTitle,
            description: editedDesc,
            start_date: editedDate,
            id: projectId
        }).then(({status, error}) => {

            if (error) {
                console.log('Error updating project');
                updateEditStatus("ERR");
                setIsAlertOpen(true);
            } else {
                console.log('Project updated successfully', status);
                updateEditStatus("CONF");
                setIsAlertOpen(true);
                setEditMode(false);
                updateProjectData(prevData => (
                    { ...prevData, 
                        title: editedTitle,
                        description: editedDesc,
                        start_date: editedDate
                    }))
            }
        
            console.log('Project updated!')
        })
    }

    useEffect(() => {
        if(!editMode && editedTitle != title) {
            setEditedTitle(title);
        }

        if(!editMode && startDate && editedDate != startDate) {
            setEditedDate(startDate);
        }

        if(!editMode && editedDesc != description) {
            setEditedDesc(description);
        }

    }, [editMode])

    return (
        <div className="container-max project-info">
            {editMode && 
                <div className="toolbar">
                    <div className="toolbar-actions">
                        <Button variation="primary" label="Save Changes" onClick={onEditProjectClick}/>
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
                    <div className="project-title">
                        <input type="text" 
                            value={editedTitle} 
                            onChange={
                                (event) => setEditedTitle(event.target.value)
                            }
                            className="large-edit-input"
                        />
                        <img src="/icon/delete.svg" className="project-title-delete" width={26} onClick={() => setDeleteModalIsOpen(true)}/>
                    </div>
                    <div className="edit-date-container">
                        <input 
                            type="date"
                            value={editedDate}
                            onChange={(event) => setEditedDate(event.target.value)}
                        />
                    </div>
                    <div className="edit-desc-container">

                        <textarea
                            className="edit-desc-textarea"
                            onChange={(event) => setEditedDesc(event.target.value)}
                            value={editedDesc}
                        />
                    </div>
                    </>
                : 
                <>
                    <h1 className="project-title">
                        <div className="project-title-text">{title}</div>
                        <img src="/icon/delete.svg" className="project-title-delete" width={26} onClick={() => setDeleteModalIsOpen(true)}/>
                    </h1>
                    <h2 className="project-date">
                        <img src="/icon/calendar.svg" width={16}/>
                        {startDate && formatDateToMonthDayYear(startDate)}
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
                </>
                    }
                
                
                
            </div>
        </div>
    )
}

const ProjectContent = ({
    projectData,
    updateProjectData,
    loadedProjectImageURL,
    setDeleteModalIsOpen
}: {
    projectData: ProjectType,
    updateProjectData: Dispatch<SetStateAction<ProjectType>>,
    loadedProjectImageURL: string | undefined,
    setDeleteModalIsOpen: Dispatch<SetStateAction<boolean>>
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
                    message={`Your project was saved successfully`} //TODO: update for failures
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
                    shortDescription={shortDescription || ''}
                    description={description || ''}
                    projectId={projectId || 0}
                    updateEditStatus={setEditedStatus}
                    isAlertOpen={isAlertOpen}
                    setIsAlertOpen={setIsAlertOpen}
                    updateProjectData={updateProjectData}
                    imageURL={loadedProjectImageURL}
                    setDeleteModalIsOpen={setDeleteModalIsOpen}
                />
            </section>
        </>
    )
}

const Project = () => {

    const { projectId } = useParams();
    const navigate = useNavigate();

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

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
    const getProjectInfo = ({ data, error }: Data<ProjectType[]>) => {
       
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
            

            getEventsByProjectId(projectId).then(({data: eventsData, error}) => {
            
                if (error) {
                    console.error('There was a problem fetching events for this project.');
                    setProjectLoadingState("ERROR");
                }
            
                if (eventsData) {
                    setEvents(eventsData);
                }
            
                setProjectLoadingState("LOADED")
        })
        } 

    }

    const onDeleteConfirm = () => {
        deleteProject(projectId).then(({status, error}) => {
            if(error) {
                console.log(error)
            }

            console.log('Project deleted successfully', status);
            navigate('/dashboard');
        })
    }

    useEffect(() => {
        getProjectById(projectId).then(({data, error}) => getProjectInfo({data, error}));
    }, [])

    return (
        <>
        {deleteModalIsOpen && <Modal 
            isOpen={deleteModalIsOpen}
            setIsOpen={setDeleteModalIsOpen}
        >
            <ModalContent 
                projectTitle={currentProjectData?.title || ''}
                setDeleteModalIsOpen={setDeleteModalIsOpen}
                confirmDelete={onDeleteConfirm}
            />
        </Modal>}
        <LayoutWrapper>
            <div className="observe-project">
                <div className='container-max'>
                    <Breadcrumb 
                        label="Back to Projects"
                        path={`/dashboard`}
                        showIcon
                    />
                </div>
                {projectLoadingState == 'LOADING' && <Loading />}
                {projectLoadingState == 'LOADED' && 
                <>
                    <ProjectContent 
                        projectData={currentProjectData} 
                        updateProjectData={setCurrentProjectData}
                        loadedProjectImageURL={loadedProjectImageURL}
                        setDeleteModalIsOpen={setDeleteModalIsOpen}
                    />
                    <EventsView 
                        events={events}
                        projectId={projectId}
                    />
                </>
                }
            </div>
        </LayoutWrapper>
        </>
    )

}

export default Project;