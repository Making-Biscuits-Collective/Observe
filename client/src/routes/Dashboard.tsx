import LayoutWrapper from "../partials/LayoutWrapper";
import { supabase } from '../utils/supabase';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Project } from "../types/types";
import ProjectCard from "../components/ProjectCard";
import Alert, {AlertType} from "../components/Alert";
import './Dashboard.scss';
import Button from "../components/Button";
import Modal from "../components/Modal";

type NewProject = {
    title: string;
    description: string;
    imagePath: string;
    start_date?: string;
}

type NewProjectStatus = "IDLE" | "CONF" | "ERR";

const ModalContent = ({
    newProject,
    setNewProject,
    createNewProject,
    setNewProjectModalIsOpen
} : {
    newProject: NewProject,
    setNewProject: Dispatch<SetStateAction<NewProject>>,
    createNewProject: () => {},
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
                value={newProject.start_date}
                onChange={(event) => setNewProject(prevState => ({
                    ...prevState,
                    start_date: event.target.value
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
            <Button label="Create" variation="primary" onClick={() => createNewProject()}/>
            <Button label="Cancel" variation="primary" onClick={() => setNewProjectModalIsOpen(false)}/>
        </div>
    </div>
)

const Dashboard = () => {

    const [newProjectModalIsOpen, setNewProjectModalIsOpen] = useState<boolean>(false);
    const [newProject, setNewProject] = useState<NewProject>({
        title: '',
        description: '',
        imagePath: ''
    });
    const [newProjectStatus, setNewProjectStatus] = useState<NewProjectStatus>("IDLE");
    const [alertOpen, setAlertOpen] = useState<boolean>(false);

   const getAlertType = (): AlertType => {
        if (newProjectStatus == "ERR") return "ERR";
        return "CONF";
    }

    async function getProjects() {
        console.log('Fetching projects...')
        const { data: projects, error } = await supabase.from('projects').select('*');
        if (projects) {
            setProjectList(projects);
        } else {
            console.log(error);
        }
    }

    async function createNewProject() {
        console.log('Creating project...')
        const { data: projects, error } = await supabase.from('projects').insert([
            { 
                title: newProject.title,
                description: newProject.description,
            },
        ]).select();
        setNewProjectStatus("CONF");
        setAlertOpen(true);
        console.log('Created Project', projects);
    }

    const [projectList, setProjectList] = useState<Project[]>([]);

    useEffect(() => {
        getProjects();
    }, [])

    useEffect(() => {
        if (newProjectStatus == "CONF") {
            setAlertOpen(true);
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
                createNewProject={createNewProject}
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

export default Dashboard;