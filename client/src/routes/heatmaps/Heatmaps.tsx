import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import LayoutWrapper from '../../partials/LayoutWrapper';
import { useEffect, useState } from 'react';
import { getEventById, getHeatmapsByEventId } from '../../utils/supabase';
import { FilteredEventInfo, HeatmapData, LoadingState } from '../../types/types';
import './Heatmaps.scss';
import Button from '../../components/Button';
import HeatmapCard from '../../components/HeatmapCard';

const Heatmaps = () => {

    const { eventId } = useParams();
    const navigate = useNavigate();

    const [eventName, setEventName] = useState<string>('');
    const [loadingState, setLoadingState] = useState<LoadingState>("LOADING");
    const [heatmaps, setHeatmaps] = useState<HeatmapData[]>([]);

    useEffect(() => {
        if (eventId) {
            getEventById(eventId).then(({ data, error }) => {
                if (data) {
                    const eventInfo: FilteredEventInfo | undefined = data?.[0];
                    setEventName(eventInfo?.title);
                    setLoadingState("LOADED");
                } else if (error) {
                    setLoadingState("ERROR");
                }
              });
            //   getObservationsByEventId(eventId).then(({ data, error }) => {
            //     if (data) {
            //         setObservations(data);
            //         setLoadingState("LOADED");
            //     } else if (error) {
            //         setLoadingState("ERROR");
            //     }
            //   })
            getHeatmapsByEventId(eventId).then(({ data: heatmapData, error }) => {
                if (heatmapData) {
                    setHeatmaps(heatmapData);
                } else if (error) {
                    console.error(error);
                    setLoadingState("ERROR");
                }
            })
        }
    }, [])

    return (
        <LayoutWrapper>
            <section className='observe-heatmaps-management-page'>
                <div className='container-max'>
                    <Breadcrumb 
                        label="Back to Event"
                        path={`/event/${eventId}`}
                        showIcon
                    />
                </div>
                <div className="container-max">
                            <div className="title">
                                <div className="page-title-box">
                                    <h1 className="page-title">{eventName}</h1>
                                </div>
                                <h2 className="sub-title">Heatmaps ({heatmaps.length})</h2>
                                <p>
                                    <Button 
                                        label='Add New Heatmap' 
                                        variation='primary'
                                        onClick={() => navigate(`/event/${eventId}/newHeatmap`)}
                                    />
                                </p>
                            </div>
                            <div className="heatmaps">
                                {heatmaps.length <= 0 && <p>There are currently no heatmaps for this event.</p>}
                                {heatmaps && heatmaps.map((heatmap) => 
                                <HeatmapCard heatmapData={heatmap}/>)}
                            </div>
                </div>
            </section>
        </LayoutWrapper>
    )
}

export default Heatmaps;