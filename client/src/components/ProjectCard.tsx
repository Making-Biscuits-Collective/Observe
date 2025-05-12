import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Project } from '../types/types';
import { getImageURLFromBucket } from '../utils/supabase';
import './ProjectCard.scss';

const ProjectCard = ({projectData} : {projectData: Project}) => {

    const { 
        title, 
        image_path: imagePath,
        id: projectId,
        start_date: startDate
    } = projectData;

    const [imageURL, setImageURL] = useState<string | undefined>('');

    useEffect(() => {
        getImageURLFromBucket({
            imagePath,
            bucket: 'project-photos'
        }).then((imageURL) => setImageURL(imageURL))
    }, [])

    return (
        <Link to={`/project/${projectId}`}>
            <div className="project-card">
                <div 
                    className="project-image"
                    style={{
                        backgroundImage: `url(${imageURL})`,
                    }}
                >
                </div>
                <div className="project-info">
                    <h3 className="project-title">{title}</h3>
                    <h4 className="start-end-date">{startDate} to Present</h4>
                    <h4 className="event-count">
                        <span className="event-count-total">0</span> events</h4>
                </div>
            </div>
        </Link>
    )
}

export default ProjectCard;