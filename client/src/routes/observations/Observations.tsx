import './Observations.scss';
import LayoutWrapper from '../../partials/LayoutWrapper';
import ObservationCard from '../../components/ObservationCard';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Data, Event as EventType, FilteredEventInfo, LoadingState, ObservationData } from '../../types/types';
import { getEventById, getObservationsByEventId } from '../../utils/supabase';
import Button from '../../components/Button';
import Breadcrumb from '../../components/Breadcrumb';

const Observations = () => {

    const { eventId } = useParams();
    const navigate = useNavigate();

    const [eventName, setEventName] = useState<string>('');
    const [loadingState, setLoadingState] = useState<LoadingState>("LOADING");
    const [observations, setObservations] = useState<ObservationData[]>([]);

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
              getObservationsByEventId(eventId).then(({ data, error }) => {
                if (data) {
                    setObservations(data);
                    setLoadingState("LOADED");
                } else if (error) {
                    setLoadingState("ERROR");
                }
              })
        }
    }, [])

    return (
        <LayoutWrapper>
            <section className='observe-event-observations-page'>
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
                                <h2 className="sub-title">Recorded Observations ({observations.length})</h2>
                                <p>
                                    <Button 
                                        label='Add New Observation' 
                                        variation='primary'
                                        onClick={() => navigate(`/event/${eventId}/activityMapping`)}
                                    />
                                </p>
                            </div>
                            <div className="observations">
                                {observations.length <= 0 && <p>There are currently no observations for this event.</p>}
                                {observations && observations.map((obsData) => 
                                <ObservationCard observationData={obsData} eventId={eventId}/>)}
                            </div>
                </div>
            </section>
        </LayoutWrapper>
    )
}

export default Observations;