import Breadcrumb from '../../components/Breadcrumb';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MovingLines.scss';
import { getEventById, getImageURLFromBucket, createObservation, getObservationDataById } from '../../utils/supabase';
import { Data, FilteredEventInfo, LoadingState, MapData, ObservationData } from '../../types/types';
import LayoutWrapper from '../../partials/LayoutWrapper';
import CanvasInterface from '../../components/CanvasInterface';
import { ActivityMapping as ActivityMappingType } from '../../types/types';
import Button from '../../components/Button';

const MovingLinesEdit = () => {

    const { eventId, observationId } = useParams();

    const [observationData, setObservationData] = useState<ObservationData>({
        observer_name: '',
        date: '',
        time: '',
        weather: 'sunny',
        type: 'MOVE'
    });

    const [isLoading, setIsLoading] = useState<LoadingState>("IDLE");
    const [isValidObservation, setIsValidObservation] = useState<boolean>(false);
    const [instanceCreated, setInstanceCreated] = useState<boolean>(false);
    const [eventInfo, setEventInfo] = useState<FilteredEventInfo | null>(null);
    const [mapPath, setMapPath] = useState<string>('');
    const [mapData, setMapData] = useState<MapData[][]>([]);
    const [activityType, setActivityType] = useState<ActivityMappingType>(0);

    // Initialize observation data
    // useEffect(() => {
    //     setObservationData(
    //         (prevState) => ({
    //             ...prevState,
    //             event: eventId
    //         })
    //     )
    //     getEventById(eventId, 'title, map_path, label_mapping0, label_mapping1, label_mapping2, label_mapping3, label_mapping4').then(({ data, error }) =>
    //         getEventInfo({ data, error }))
    // }, [])

    useEffect(() => {
        if (eventId && observationId) {
            getEventById(eventId, 'title, map_path,  label_mapping0, label_mapping1, label_mapping2, label_mapping3, label_mapping4').then(({ data, error }) =>
                getEventInfo({ data, error }))
            getObservationDataById(observationId).then(({ data, error }) =>
                getObservationData({ data, error }))
        }
    }, [])

    // Update loading & validity states for observation data
    useEffect(() => {
        if (observationData?.observer_name && observationData?.date && observationData?.time) {
            setIsValidObservation(true);
        } else {
            setIsValidObservation(false);
        }
    }, [observationData])

    // Update observation data when map data is updated
    useEffect(() => {
        setObservationData(
            (prevState) => ({
                ...prevState,
                map_data: JSON.stringify(mapData)
            })
        )
    }, [mapData])

    const getEventInfo = ({ data, error }: Data<FilteredEventInfo[]>) => {

        if (error) {
            console.error(error);
        } else {
            const eventInfoData: FilteredEventInfo | undefined = data?.[0];
            if (eventInfoData) {
                setEventInfo(eventInfoData);
                getImageURLFromBucket({
                    imagePath: eventInfoData?.map_path,
                    bucket: 'event-maps'
                }).then((imageURL) => { setMapPath(imageURL) })
            }
        }
    }

    const handleCreate = () => {
        setIsLoading("LOADING");
        console.log(observationData);
        createObservation(observationData).then(({ data, error }) => {
            console.log("Observation Data: ", observationData);
            console.log("Error: ", error);
            if (data) {
                setInstanceCreated(true);
                setIsLoading("LOADED");
            } else if (error) {
                setIsLoading("ERROR");
            }
        })
    }

    const getObservationData = ({ data, error }: Data<ObservationData[]>) => {
        if (error) {
            console.error(error);
        } else {
            console.log(data);
            const observationData: ObservationData | undefined = data?.[0];
            if (observationData) {
                const timeString = observationData.time?.slice(0, 5);
                setObservationData({ ...observationData, time: timeString });
                if (observationData?.map_data) {
                    console.log('Map data found! Parsing...');
                    if (Array.isArray(JSON.parse(observationData.map_data))) {
                        console.log(JSON.parse(observationData.map_data));
                        setMapData(JSON.parse(observationData.map_data))
                    } else {
                        console.error('There was a problem loading map data.')
                    }
                }
            }
        }
    }

    return (
        <LayoutWrapper>
            <section className='moving-lines-activity page'>
                <div className='container-max breadcrumb'>
                    <Breadcrumb
                        label="Back to Observations"
                        path={`/event/${eventId}/observations`}
                        showIcon
                    />
                </div>
                <div className="container content">
                    <h1 className="page-title">Edit Observation</h1>
                    <h2>Activity Mapping Observation</h2>
                    <h3>{eventInfo?.title}</h3>
                    <CanvasInterface
                        activityType={activityType}
                        setActivityType={setActivityType}
                        mapPath={mapPath}
                        setMapData={setMapData}
                        mapData={mapData}
                        filteredInfo={eventInfo}
                        observationType={1}
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
                                        value={observationData?.time}
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
                                        value={observationData?.temperature}
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

export default MovingLinesEdit;