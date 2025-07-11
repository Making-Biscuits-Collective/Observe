import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import LayoutWrapper from '../../partials/LayoutWrapper';
import './ActivityMapping.scss';
import CanvasInterface from '../../components/CanvasInterface';
import { 
    ActivityMapping as ActivityMappingType, 
    FilteredEventInfo, 
    ObservationData, 
    Data,
    LoadingState,
    MapData
} from '../../types/types';
import { getImageURLFromBucket, getEventById, createObservation } from '../../utils/supabase';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Breadcrumb from '../../components/Breadcrumb';

const ActivityMapping = () => {
    const { eventId } = useParams();

    const [observationData, setObservationData] = useState<ObservationData>({
        observer_name: '',
        date: '',
        time: '',
        weather: 'sunny',
    });
    
    const [eventInfo, setEventInfo] = useState<FilteredEventInfo | null>(null);
    const [mapData, setMapData] = useState<MapData[]>([]);
    const [mapPath, setMapPath] = useState<string>('');
    const [activityType, setActivityType] = useState<ActivityMappingType>(0);
    const [isValidObservation, setIsValidObservation] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<LoadingState>("IDLE");
    const [instanceCreated, setInstanceCreated] = useState<boolean>(false);

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

    const handleCreate = () => {
        setIsLoading("LOADING");
        console.log(observationData);
        createObservation(observationData).then(({data, error}) => {
            if (data) {
                setInstanceCreated(true);
                setIsLoading("LOADED");
            } else if (error) {
                setIsLoading("ERROR");
            }
        })
    }

    useEffect(() => {
        setObservationData(
            (prevState) => ({
                ...prevState,
                event: eventId
            })
        )
        getEventById(eventId, 'title, map_path, label_mapping0, label_mapping1, label_mapping2, label_mapping3, label_mapping4').then(({data, error}) => 
            getEventInfo({data, error}))
    }, [])

    useEffect(() => {
        if (observationData?.observer_name && observationData?.date && observationData?.time) {
            setIsValidObservation(true);
        } else {
            setIsValidObservation(false);
        }
    }, [observationData])

    useEffect(() => {
        setObservationData(
            (prevState) => ({
                ...prevState,
                map_data: JSON.stringify(mapData)
            })
        )
    }, [mapData])

    return (
        <LayoutWrapper>
            <Alert 
                message='Your observation was recorded successfully!' 
                variation='CONF' 
                isOpen={isLoading == 'LOADED' && instanceCreated} 
                setIsOpen={setInstanceCreated}
            />
            <Alert 
                message='There was a problem creating your observation, please try again.' 
                variation='ERR' 
                isOpen={isLoading == 'ERROR' && instanceCreated} 
                setIsOpen={setInstanceCreated}
                customCallback={() => setIsLoading('IDLE')}
            />
            <section className="observe-activity-mapping">
                <div className='container-max breadcrumb'>
                    <Breadcrumb 
                        label="Back to Observations"
                        path={`/event/${eventId}/observations`}
                        showIcon
                    />
                </div>
                <div className="container-max">
                    <h1 className="page-title">New Observation</h1>
                    <h2>Activity Mapping Observation</h2>
                    <h3>{eventInfo?.title}</h3>
                    <CanvasInterface 
                        activityType={activityType}
                        setActivityType={setActivityType}
                        mapPath={mapPath}
                        setMapData={setMapData}
                        mapData={mapData}
                        filteredInfo={eventInfo}
                    />
                </div>
                <div className="activity-grid">
                    <div className="container">
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
                                        value={observationData.observer_name}
                                        onChange={(event) => setObservationData(
                                            (prevState) => ({
                                                ...prevState,
                                                observer_name: event.target.value
                                            })
                                        )}
                                    />
                                </div>
                                <div className="form-grid">
                                    <div className="input-block">
                                        <label htmlFor="observation-date" className="required">Date</label>
                                        <input 
                                            id="observation-date" 
                                            type="date"
                                            value={observationData.date}
                                            onChange={(event) => setObservationData(
                                                (prevState) => ({
                                                    ...prevState,
                                                    date: event.target.value
                                                })
                                            )}
                                        />
                                    </div>
                                    <div className="input-block">
                                        <label htmlFor="observation-time" className="required">Time</label>
                                        <input 
                                            id="observation-time" 
                                            type="time"
                                            value={observationData.time}
                                            onChange={(event) => setObservationData(
                                                (prevState) => ({
                                                    ...prevState,
                                                    time: event.target.value
                                                })
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="input-block">
                                        <label htmlFor="observation-temp">Temperature</label>
                                        <input 
                                            id="observation-temp" 
                                            type="number"
                                            onChange={(event) => setObservationData(
                                                (prevState) => ({
                                                    ...prevState,
                                                    temperature: Number(event.target.value)
                                                })
                                            )}
                                        />
                                    </div>
                                    <div className="input-block">
                                        <label htmlFor="observation-weather">Weather</label>
                                        <select 
                                            name="observation-weather" 
                                            id="observation-weather"
                                            value={observationData.weather}
                                            onChange={(event) => setObservationData(
                                                (prevState) => ({
                                                    ...prevState,
                                                    weather: event.target.value
                                                })
                                            )}
                                        >
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
                                        onChange={(event) => setObservationData(
                                            (prevState) => ({
                                                ...prevState,
                                                notes: event.target.value
                                            })
                                        )}
                                        value={observationData.notes}
                                    />
                                </div>
                                <div className='button-container'>
                                    <Button 
                                        label={isLoading == 'LOADING' ? 'Saving...' : 'Save'} 
                                        variation='primary' 
                                        size='large' 
                                        onClick={handleCreate}
                                        disabled={(isValidObservation || isLoading == 'LOADING') ? false : true}
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