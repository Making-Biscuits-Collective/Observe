import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import LayoutWrapper from '../../partials/LayoutWrapper';
import './ActivityMappingEdit.scss';
import CanvasInterface from '../../components/CanvasInterface';
import { 
    ActivityMapping as ActivityMappingType, 
    FilteredEventInfo, 
    ObservationData, 
    Data,
    LoadingState,
    MapData
} from '../../types/types';
import { getImageURLFromBucket, getEventById, createObservation, getObservationDataById } from '../../utils/supabase';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Breadcrumb from '../../components/Breadcrumb';

const ActivityMappingEdit = () => {
    const { eventId, observationId } = useParams();

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

    const getObservationData = ({ data, error } : Data<ObservationData[]>) => {
        if (error) {
            console.error(error);
        } else {
            console.log(data);
            const observationData: ObservationData | undefined = data?.[0];
            if (observationData) {
                setObservationData(observationData);
                if (observationData?.map_data) {
                    if (Array.isArray(JSON.parse(observationData.map_data))) {
                        setMapData(JSON.parse(observationData.map_data))
                    } else {
                        console.error('There was a problem loading map data.')
                    }
                }
            }
        }
    }



    useEffect(() => {
        if (eventId && observationId) {
            getEventById(eventId, 'title, map_path').then(({data, error}) => 
            getEventInfo({data, error}))
            getObservationDataById(observationId).then(({data, error}) =>
            getObservationData({data, error}))
        }
        console.log(observationData);
    }, [])



    return (
        <LayoutWrapper>
            <Alert 
                message='Your observation was updated successfully!' 
                variation='CONF' 
                isOpen={isLoading == 'LOADED' && instanceCreated} 
                setIsOpen={setInstanceCreated}
            />
            <Alert 
                message='There was a problem updating your observation, please try again.' 
                variation='ERR' 
                isOpen={isLoading == 'ERROR' && instanceCreated} 
                setIsOpen={setInstanceCreated}
                customCallback={() => setIsLoading('IDLE')}
            />
            <section className="observe-activity-mapping edit">
                <div className='container-max breadcrumb'>
                    <Breadcrumb 
                        label="Back to Observations"
                        path={`/event/${eventId}/observations`}
                        showIcon
                    />
                    <h1 className="page-title">Edit Observation</h1>
                    <h2>Editing Activity Mapping Observation {observationData?.id && <span>ID: {observationData?.id}</span>}</h2>
                    <h3>{eventInfo?.title}</h3>
                </div>
                <div className="container-max">
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
                                        label={isLoading == 'LOADING' ? 'Updating...' : 'Update'} 
                                        variation='primary' 
                                        size='large' 
                                        // onClick={handleCreate}
                                        // disabled={(isValidObservation || isLoading == 'LOADING') ? false : true}
                                    />
                                </div>
                            </div>
                    </div>
                </div>
            </section>
        </LayoutWrapper>
    )
}

export default ActivityMappingEdit;