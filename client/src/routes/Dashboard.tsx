import LayoutWrapper from "../partials/LayoutWrapper";
import { getProjects, createNewProject } from '../utils/supabase';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Project, Data, CamelizeKeys } from "../types/types";
import ProjectCard from "../components/ProjectCard";
import Alert, {AlertType} from "../components/Alert";
import { withAuthenticationRequired } from '@auth0/auth0-react';
import './Dashboard.scss';
import Button from "../components/Button";
import Modal from "../components/Modal";
import Loading from "../components/Loading";

type NewProject = CamelizeKeys<Project>
type NewProjectStatus = "IDLE" | "CONF" | "ERR";

const ModalContent = ({
    newProject,
    setNewProject,
    onCreateNewProjectClick,
    setNewProjectModalIsOpen
} : {
    newProject: NewProject,
    setNewProject: Dispatch<SetStateAction<NewProject>>,
    onCreateNewProjectClick: () => void,
    setNewProjectModalIsOpen: Dispatch<SetStateAction<boolean>>
}) => (
    <div className="new-project-modal">
        <h2 className="modal-title">Create New Project</h2>
        <div className="input-block">
            <label 
                htmlFor="new-project-title"
                className="required"
            >
                Project Name
            </label>
            <input 
                id="new-project-title"
                type="text"
                placeholder="New Project"
                value={newProject.title}
                onChange={(event) => setNewProject(prevState => ({
                    ...prevState,
                    title: event.target.value
                }))}
            />
        </div>
        <div className="input-block">
            <label 
                htmlFor="new-project-date"
                className="required"
            >
                Project Date
            </label>
            <input 
                id="new-project-date"
                type="date"
                value={newProject.startDate}
                onChange={(event) => setNewProject(prevState => ({
                    ...prevState,
                    startDate: event.target.value
                }))}
            />
        </div>
        <div className="input-block">
            <label htmlFor="new-project-description" className="required">
                Project Description
            </label>
            <textarea
                className="new-project-description"
                placeholder="A description of your project. Don't worry, you can edit these later."
                id="new-project-description"
                onChange={(event) => setNewProject(prevState => ({
                    ...prevState,
                    description: event.target.value
                }))}
                value={newProject?.description}
            />
        </div>
        <div className="input-block">
            <label htmlFor="project-image" className="file-upload">
                Upload Project Image <img src="/icon/upload.svg" width={16}/>
            </label>
            <input 
                type="file" 
                id="project-image" 
                name="project-image" 
                accept="image/png, image/jpeg"
            />
        </div>
        <div className="flex-centered">
            <Button label="Create" variation="primary" onClick={onCreateNewProjectClick}/>
            <Button label="Cancel" variation="primary" onClick={() => setNewProjectModalIsOpen(false)}/>
        </div>
    </div>
)

const Dashboard = () => {

    const [newProjectModalIsOpen, setNewProjectModalIsOpen] = useState<boolean>(false);
    const [newProject, setNewProject] = useState<NewProject>({
        title: '',
        description: '',
        imagePath: '',
        startDate: ''
    });
    const [newProjectStatus, setNewProjectStatus] = useState<NewProjectStatus>("IDLE");
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);


   const getAlertType = (): AlertType => {
        if (newProjectStatus == "ERR") return "ERR";
        return "CONF";
    }

    const getProjectList = ({ data, error } : Data<Project[]>) => {
        if (data) {
            setProjectList(data);
            setIsLoading(false);
        } else {
            console.log(error);
        }
    }

    const onCreateNewProjectClick = () => {
        console.log('Creating project...')
        createNewProject(newProject).then(({data: projects, error}) => {
            setNewProjectStatus("CONF");
            setAlertOpen(true);
            console.log('Created Project', projects);
            
            setProjectList(prevState => ([
                    ...prevState, projects?.[0]]));
        })
    }

    const [projectList, setProjectList] = useState<Project[]>([]);

    useEffect(() => {
        getProjects().then(({data, error}) => getProjectList({data, error}));
    }, [])

    useEffect(() => {
        if (newProjectStatus == "CONF") {
            setAlertOpen(true);
            setNewProjectModalIsOpen(false);
        } else if (newProjectStatus == "ERR") {
            setAlertOpen(true);
        }
    }, [newProjectStatus])


    return (
        <>
        <Alert 
            message="Your project has been created successfully!"
            variation={getAlertType()}
            isOpen={alertOpen}
            setIsOpen={setAlertOpen}
        />
        {newProjectModalIsOpen && <Modal 
            isOpen={newProjectModalIsOpen}
            setIsOpen={setNewProjectModalIsOpen}
        >
            <ModalContent 
                newProject={newProject}
                setNewProject={setNewProject}
                onCreateNewProjectClick={onCreateNewProjectClick}
                setNewProjectModalIsOpen={setNewProjectModalIsOpen}
            />
        </Modal>}
        <LayoutWrapper>

            <div className="observe-dashboard">
                <section className="title">
                    <div className="container-max flex-centered">
                        <h1 className="page-title">Dashboard</h1>
                    </div>
                </section>
                <section className="projects">
                    <div className="dashboard-actions container-max">
                        <Button 
                            variation="primary" 
                            label="+ Create New Project" 
                            onClick={() => setNewProjectModalIsOpen(true)}
                        />
                    </div>
                    <div className="projects-grid container-max">
                        {isLoading && <Loading />}
                        {projectList.map((projectData) => 
                            <div className="project-grid-card" key={`grid-item-${projectData.title}`}>
                                <ProjectCard 
                                    projectData={projectData} 
                                />
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </LayoutWrapper>
        </>
    )
}

// export default withAuthenticationRequired(Dashboard, {
//     onRedirecting: () => (<div>Redirecting...</div>)
// });

export default Dashboard;