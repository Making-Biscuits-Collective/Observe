import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutWrapper from '../partials/LayoutWrapper';
import { Event as EventType } from '../types/types';
import { getImageURLFromBucket, supabase } from '../utils/supabase';
import './Event.scss';
import Button from '../components/Button';

const Event = () => {

    const navigate = useNavigate();

    const { eventId } = useParams();
    const [eventData, setEventData] = useState<EventType>({
        title: '',
        date: '',
        location: '',
        map_path: ''
    });
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [loadedMapURL, setLoadedMapURL] = useState('');

    async function getEventById() {
        const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .limit(1) as { data: EventType[] | null, error: any }; 

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

                    const { data, error } = await supabase 
                    .from('projects')
                    .select('title, description')
                    .eq('id', eventInfo.project)
                    
                    if (error) {
                        console.log('Error fetching project data');
                    }

                    const dataProjectName: string | undefined = data?.[0].title;
                    const dataProjectDesc: string | undefined = data?.[0].description;
                    setProjectName(dataProjectName || '');
                    setProjectDesc(dataProjectDesc || '');
                }
            }
        }
    }

    useEffect(() => {
        getEventById();
        console.log(eventData);
    }, [])

    return (
        <LayoutWrapper>
            <section className="observe-event-page">
                <div className="container-max">
                    <div className="title">
                        <h1 className="page-title">{eventData.title}</h1>
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
    )
}

export default Event;