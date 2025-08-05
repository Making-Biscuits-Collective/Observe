import './Observations.scss';
import LayoutWrapper from '../../partials/LayoutWrapper';
import ObservationCard from '../../components/ObservationCard';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Data, Event as EventType, FilteredEventInfo, LoadingState, ObservationData } from '../../types/types';
import { getEventById, getObservationsByEventId } from '../../utils/supabase';
import Button from '../../components/Button';
import Breadcrumb from '../../components/Breadcrumb';
import ActivityTag from '../../components/ActivityTag';

const Observations = () => {

    const { eventId } = useParams();
    const navigate = useNavigate();

    const [eventName, setEventName] = useState<string>('');
    const [eventType, setEventType] = useState<string>("STAY");
    const [loadingState, setLoadingState] = useState<LoadingState>("LOADING");
    const [observations, setObservations] = useState<ObservationData[]>([]);

    useEffect(() => {
        if (eventId) {
            getEventById(eventId).then(({ data, error }) => {
                if (data) {
                    const eventInfo: FilteredEventInfo | EventType | undefined = data?.[0];
                    setEventName(eventInfo?.title);
                    eventInfo?.type && setEventType(eventInfo?.type);
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

    function getNavigationType(): string {
        if (eventType == "STAY") {
            return `/event/${eventId}/activityMapping`;
        } else if (eventType == "MOVE") {
            return `/event/${eventId}/movingLines`;
        }
        return '';
    }

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
                        <ActivityTag eventType={eventType} />
                        <p>
                            <Button
                                label='Add New Observation'
                                variation='primary'
                                onClick={() => navigate(getNavigationType())}
                            />
                        </p>
                    </div>
                    <div className="observations">
                        {observations.length <= 0 && <p>There are currently no observations for this event.</p>}
                        {observations && observations.map((obsData) =>
                            <ObservationCard observationData={obsData} eventId={eventId} />)}
                    </div>
                </div>
            </section>
        </LayoutWrapper>
    )
}

export default Observations;