import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LayoutWrapper from '../partials/LayoutWrapper';
import { Event as EventType, Data } from '../types/types';
import { getEventById, getProjectById} from '../utils/supabase';
import './Event.scss';

const Event = () => {

    const { eventId } = useParams();
    const [eventData, setEventData] = useState<EventType>({
        title: '',
        start_date: '',
        location: '',
        map_path: ''
    });
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');

    const getEventInfo = ({data, error}: Data<EventType[]>) => {


        if (error) {
            console.error('Oops, we had trouble fetching the event data!', error);
        } else {
            if (data) {
                const eventInfo: EventType | undefined = data?.[0];

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
                    
                    
                }
            }
        }

    }

    useEffect(() => {
        getEventById(eventId).then(({data, error}) => getEventInfo({data, error}))
        console.log(eventData);
    }, [])

    return (
        <LayoutWrapper>
            <section className="observe-event-page">
                <div className="container-max">
                    <h1 className="page-title">{eventData.title}</h1>
                    <h2 className="project-title">{projectName}</h2>
                    <label htmlFor="event-code">Event Code</label>
                    <input type="text" value={eventData.id} className="event-code"/>
                </div>
                <div className="container-max grid">
                    <div className="event-information">
                        <span className="event-date">
                            <img src="/icon/calendar.svg" width={20} className="icon"/> {eventData.start_date}
                        </span>
                        <span className="event-location">
                            <img src="/icon/location.svg" width={20} className="icon"/> {eventData.location}
                        </span>
                    </div>
                    <div className="">
                        {projectDesc}
                    </div>
                </div>
            </section>
        </LayoutWrapper>
    )
}

export default Event;