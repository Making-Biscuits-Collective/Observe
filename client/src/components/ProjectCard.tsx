import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Project } from '../types/types';
import { getImageURLFromBucket, supabase } from '../utils/supabase';
import './ProjectCard.scss';

const ProjectCard = ({projectData} : {projectData: Project}) => {

    const { 
        title, 
        image_path: imagePath,
        id: projectId,
        start_date: startDate
    } = projectData;

    const [imageURL, setImageURL] = useState<string | undefined>('');
    const [totalEvents, setTotalEvents] = useState<number>(0);

    useEffect(() => {
        getImageURLFromBucket({
            imagePath,
            bucket: 'project-photos'
        }).then((imageURL) => setImageURL(imageURL));
        getTotalEvents();
    }, [])

    async function getTotalEvents() {
        const { data, error } = await supabase
        .from('events')
        .select('*') 
        .eq('project', projectId);
        if (error) {
            console.error('Something went wrong when trying to grab the number of events.')
        }
        setTotalEvents(data?.length ?? 0);
    }

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
                        <span className="event-count-total">{totalEvents}</span>{totalEvents == 1 ? ' event' : ' events'}</h4>
                </div>
            </div>
        </Link>
    )
}

export default ProjectCard;