import { useEffect, useRef, useState } from 'react';
import LayoutWrapper from '../../partials/LayoutWrapper';
import { getObservationsByEventId, getImageURLFromBucket, getEventById, createNewHeatmap } from '../../utils/supabase';
import { useParams } from 'react-router-dom';
import { LoadingState, ObservationData, Event as EventType, FilteredEventInfo, Coordinates, ObsState, MapData, HeatmapData } from '../../types/types';
import HeatmapCard from '../../components/HeatmapCard';
import Alert from '../../components/Alert';
import FilterObservations from '../../components/FilterObservations';
import h337 from 'heatmap.js';
import './CreateHeatmap.scss';
import Button from '../../components/Button';
import Breadcrumb from '../../components/Breadcrumb';

const CreateHeatmap = () => {

    const { eventId } = useParams();
    const [heatmapDetails, setHeatmapDetails] = useState<HeatmapData>({
        title: '',
        map_data: '',
        eventId
    });
    const [observations, setObservations] = useState<ObservationData[]>([]);
    const [selectedObservations, setSelectedObservations] = useState<ObsState[]>([]);
    const [loadedMapURL, setLoadedMapURL] = useState<string>('');
    const [loadingState, setLoadingState] = useState<LoadingState>("IDLE");
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const heatmapContainerRef = useRef<HTMLDivElement>(null); // Ref for the div heatmap.js will draw into
    const heatmapInstanceRef = useRef<h337.Heatmap<any, any, any> | null>(null); // Ref to store the heatmap.js instance
  
    useEffect(() => {
        // network calls
        if (eventId) {
            getEventById(eventId).then(({ data, error }) => {
                if (data) {
                    const eventInfo: EventType | FilteredEventInfo | undefined = data?.[0];
                    if (eventInfo) {
                        getImageURLFromBucket({
                            imagePath: eventInfo.map_path,
                            bucket: 'event-maps'
                        }).then(imageURL => {
                            setLoadedMapURL(imageURL);
                        });
                    }
                } else {
                    console.error(error);
                }
            })
            getObservationsByEventId(eventId).then(({ data, error }) => {
                if (data) {
                    setObservations(data);
                    setLoadingState("LOADED");
                } else if (error) {
                    setLoadingState("ERROR");
                }
              })
        }
        // heatmap init
        if (heatmapContainerRef.current && !heatmapInstanceRef.current) {
            heatmapInstanceRef.current = h337.create({
              container: heatmapContainerRef.current,
              radius: 100,     // The radius of the heatmap points
              maxOpacity: 0.8, // Max opacity for the hottest points
              minOpacity: 0, // Min opacity for the coolest points (fading out)
              blur: 0.75,     // Blur factor, higher means smoother transitions
            });
          }

    }, [])

    useEffect(() => {
        console.log('Selected Observations: ', selectedObservations)
        const allCoordinates = selectedObservations.flatMap(obs =>
            obs.coordinatesList.map(coord => ({
              x: Number(coord.coordinates.x), // Convert string 'x' to number
              y: Number(coord.coordinates.y), // Convert string 'y' to number
            }))
        );
        // const allCoordinates = selectedObservations.map((obs) => obs.coordinatesList)
        
        if (heatmapInstanceRef.current) {
            const dataPoints = allCoordinates.map(coord => ({
              x: Math.round(coord.x), // Ensure integer values for heatmap.js
              y: Math.round(coord.y), // Ensure integer values for heatmap.js
              value: 1, // Assign a constant value for density calculation
            }));

            setHeatmapDetails(prevState => ({
                ...prevState,
                map_data: JSON.stringify(dataPoints)
            }))
      
            heatmapInstanceRef.current.setData({
                data: dataPoints,
                max: 1,
                min: 0
            });
          }

    }, [selectedObservations])

    const handleUpdateSelectedObservations = (obsId: string, coords: MapData[]) => {
        if (selectedObservations.find((obs) => obs.observationId == obsId)) {
            setSelectedObservations((prevState) => [
                ...prevState.filter(obs => obs.observationId != obsId)
            ])
        } else {
            setSelectedObservations((prevState) => [
                ...prevState,
                {
                    observationId: obsId,
                    coordinatesList: coords
                }
            ])
        }
    }

    // Add the heatmap to the heatmaps table, THEN the join HeatmapInstances table
    // to tie to the event ID.
    const createHeatmap = () => {
        setLoadingState("LOADING");
        if (heatmapDetails.title && selectedObservations.length >= 0) {
            createNewHeatmap(heatmapDetails, selectedObservations.map(
                obs => { 
                    return { instanceId: obs.observationId } 
                }))
            .then(({ data, error }) => {
                // do stuff
                if (data) {
                    setLoadingState("LOADED")
                    setShowAlert(true);
                } else {
                    setLoadingState("ERROR");
                    console.error(error);
                }
            })
        }
    }

    return (
        <LayoutWrapper>
            <Alert 
                message={loadingState == 'LOADED' ? 'Your heatmap has been created successfully!' : 'There was a problem creating this heatmap, please try again!'}
                variation={loadingState == 'LOADED' ? 'CONF' : 'ERR'}
                isOpen={showAlert}
                setIsOpen={setShowAlert}
            />
            <section className='observe-create-heatmap-page'>
                <div className='container-max'>
                    <Breadcrumb 
                            label="Back to Heatmaps"
                            path={`/event/${eventId}/heatmaps`}
                            showIcon
                        />
                </div>
                <div className='container-max top'>
                    <div className="title">
                        <div className="page-title-box">
                            <h1 className="page-title">Create New Heatmap</h1>
                            <h2 className="sub-title">Event ID: {eventId}</h2>
                        </div>
                        <label htmlFor="heatmap-name" className='required'>Heatmap Name</label>
                        <input 
                            type="text" 
                            className="large-edit-input" 
                            id="heatmap-name" 
                            placeholder="My New HeatMap"
                            value={heatmapDetails.title}
                            onChange={(event) => setHeatmapDetails(prevState => ({
                                ...prevState,
                                title: event.target.value
                            }))}
                        />
                    </div>
                    <div className="heatmap-details">
                        {/* <HeatmapCard heatmapData={{
                            title: heatmapDetails?.title,
                            map_data: heatmapDetails?.map_data,
                        }}/> */}
                    </div>
                </div>
                <div className='container-max observations-container'>
                    <div 
                        className='heatmap-preview'
                        style={{
                            background: `url('${loadedMapURL}') no-repeat center`
                        }}
                    >
                        <div 
                            className='heatmap-overlay' 
                            ref={heatmapContainerRef}
                            style={{
                                width: '900px',
                                height: '500px'
                            }}
                        >
                        </div>
                    </div>
                    <div className='observations-list'>
                        <FilterObservations 
                            observations={observations}
                            selectedData={selectedObservations}
                            handleChange={handleUpdateSelectedObservations}
                        />
                    </div>
                    <Button 
                        variation='primary' 
                        label={loadingState == 'LOADING' ? 'Creating...' : 'Create Heatmap'}
                        size='large'
                        disabled={(heatmapDetails.title.length <= 0 && selectedObservations.length <= 0) || loadingState == 'LOADING'}
                        onClick={createHeatmap}
                    />
                </div>
            </section>
        </LayoutWrapper>
    )
}

export default CreateHeatmap;

