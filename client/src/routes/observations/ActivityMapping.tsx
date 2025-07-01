import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import LayoutWrapper from '../../partials/LayoutWrapper';
import './ActivityMapping.scss';
import CanvasInterface from '../../components/CanvasInterface';
import { ActivityMapping as ActivityMappingType, FilteredEventInfo, ObservationData, Data } from '../../types/types';
import { getImageURLFromBucket, getEventById } from '../../utils/supabase';




const ActivityMapping = () => {

    const [observationData, setObservationData] = useState<ObservationData>({
        name: '',
        date: '',
        time: '',
    });
    const { eventId } = useParams();
    const [eventInfo, setEventInfo] = useState({});
    const [mapPath, setMapPath] = useState<string>('');
    const [activityType, setActivityType] = useState<ActivityMappingType>("SITTING");
    const imageRef = useRef(null);

    // const handleMarkMap = (event) => {
    //     if (imageRef.current) {
    //         const imageRect = imageRef.current.getBoundingClientRect();
    //     }
    // }

    const getEventInfo = ({ data, error } : Data<FilteredEventInfo[]>) => {
        
        if (error) {
            console.error(error);
        } else {
            const eventInfoData: FilteredEventInfo | undefined = data?.[0];
            if (eventInfoData) {
                setEventInfo(eventInfoData);
                getImageURLFromBucket({
                    imagePath: eventInfoData?.map_path,
                    bucket: 'event-maps'
                }).then((imageURL) => setMapPath(imageURL))
            }
        }
    }

    useEffect(() => {
        getEventById(eventId, 'title, map_path').then(({data, error}) => 
            getEventInfo({data, error}))
    }, [])

    return (
        <LayoutWrapper>
            <section className="observe-activity-mapping">
                <div className="container-max">
                    <h1 className="page-title">New Observation</h1>
                    <h2>Activity Mapping Observation</h2>
                    <CanvasInterface 
                        activityType={activityType}
                        setActivityType={setActivityType}
                        mapPath={mapPath}
                    />
                </div>
                <div className="activity-grid">
                    <div className="container-max">
                        <div className="observation-details">
                                <div className="input-block full-width">
                                    <label htmlFor="observer-name" className="required">
                                        Observer Name
                                    </label>
                                    <input 
                                        className="full-width"
                                        type="text" 
                                        id="observer-name" 
                                        placeholder="Observer name"
                                        value={observationData.name}
                                        onChange={(event) => setObservationData}
                                    />
                                </div>
                                <div className="form-grid">
                                    <div className="input-block">
                                        <label htmlFor="observation-date" className="required">Date</label>
                                        <input id="observation-date" type="date"/>
                                    </div>
                                    <div className="input-block">
                                        <label htmlFor="observation-time" className="required">Time</label>
                                        <input id="observation-time" type="time"/>
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="input-block">
                                        <label htmlFor="observation-temp">Temperature</label>
                                        <input id="observation-temp" type="number"/>
                                    </div>
                                    <div className="input-block">
                                        <label htmlFor="observation-weather">Weather</label>
                                        <select name="observation-weather" id="event-type">
                                            <option value="sunny">Sunny</option>
                                            <option value="cloudy">Cloudy</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="input-block">
                                    <label htmlFor="observation-notes">Notes</label>
                                    <textarea 
                                        className="observation-notes" 
                                        id="observation-notes"
                                    />
                                </div>
                            </div>
                    </div>
                </div>
            </section>
        </LayoutWrapper>
    )
}

export default ActivityMapping;