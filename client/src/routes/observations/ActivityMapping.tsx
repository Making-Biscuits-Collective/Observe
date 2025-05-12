import { useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import { useParams } from 'react-router-dom';
import LayoutWrapper from '../../partials/LayoutWrapper';
import './ActivityMapping.scss';
import { ActivityMapping as ActivityMappingType } from '../../types/types';
import { supabase, getImageURLFromBucket } from '../../utils/supabase';

export type ObservationData = {
    name: string;
    date: string;
    time: string;
    temperature?: string;
    weather?: string;
    notes?: string;
    data_points?: Array<string>;
}

type FilteredEventInfo = {
    title: string;
    map_path: string;
}

const Selectors = ({activityType, setActivityType} : {
    activityType: ActivityMappingType,
    setActivityType: Dispatch<SetStateAction<ActivityMappingType>>
}) => (
    <div className="activity-selector">
        <div className="select-block">
            <input 
                type="radio" 
                id="activity-sitting" 
                value="SITTING"
                checked={activityType == "SITTING"}
                onChange={(event) => setActivityType(
                    event.target.value as ActivityMappingType
                )}
            />
            <label htmlFor="activity-sitting" className="centered-selection">
                <img src="/markers/activity-mapping/sitting.svg" width={32} />
                <span className="activity-label">Sitting</span>
            </label>
        </div>
        <div className="select-block">
            <input 
                type="radio" 
                id="activity-standing" 
                value="STANDING"
                checked={activityType == "STANDING"}
                onChange={(event) => setActivityType(
                    event.target.value as ActivityMappingType
                )}
            />
            <label htmlFor="activity-standing" className="centered-selection">
                <img src="/markers/activity-mapping/standing.svg" width={32} />
                <span className="activity-label">Standing</span>
            </label>
        </div>
        <div className="select-block">
            <input 
                type="radio" 
                id="activity-other" 
                value="OTHER"
                checked={activityType == "OTHER"}
                onChange={(event) => setActivityType(
                    event.target.value as ActivityMappingType
                )}
            />
            <label htmlFor="activity-other" className="centered-selection">
                <img src="/markers/activity-mapping/other.svg" width={32} />
                <span className="activity-label">Other</span>
            </label>
        </div>
    </div>
)

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

    async function getEventById() {
        const { data, error } = await supabase
        .from('events')
        .select('title, map_path')
        .eq('id', eventId)
        .limit(1) as { data: [{
            title: string;
            map_path: string;
        }] | null, error: any }; 

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
        getEventById();
    }, [])

    return (
        <LayoutWrapper>
            <section className="observe-activity-mapping">
                <div className="container-max">
                    <h1 className="page-title">New Observation</h1>
                    <h2>Activity Mapping Observation</h2>
                </div>
                <div className="activity-grid">
                    <div className="container-max">
                        <div className="observation-interface">
                            <Selectors 
                                activityType={activityType}
                                setActivityType={setActivityType}
                            />
                            <div className="interactive-map">
                                <img 
                                    src={mapPath} 
                                    width="100%"
                                />
                            </div>
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
                </div>
            </section>
        </LayoutWrapper>
    )
}

export default ActivityMapping;