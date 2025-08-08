import { ObservationData } from '../types/types';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './ObservationCard.scss';

const ObservationCard = ({
    observationData,
    eventId
}: {
    observationData: ObservationData,
    eventId?: string;
}) => {

    const navigate = useNavigate();
    const { type } = observationData;

    const getEditRoute = () => {
        return type == "MOVE" ? `/event/${eventId}/observations/editm/${observationData?.id}` :
            `/event/${eventId}/observations/edit/${observationData?.id}`
    }

    return (
        <div className='observation-card'>
            <div className='input-block'>
                <label
                    htmlFor='observer-id'
                    className='observation-label'
                >
                    ID
                </label>
                <span id='observer-id' className='heatmap-data'>{observationData.id}</span>
            </div>
            <div className='input-block'>
                <label
                    htmlFor='observer-name'
                    className='observation-label'
                >
                    Observer Name
                </label>
                <span id='observer-name' className='heatmap-data'>{observationData.observer_name}</span>
            </div>
            <div className='input-block'>
                <label
                    htmlFor='observer-date'
                    className='observation-label'
                >
                    Date
                </label>
                <span id='observer-date' className='heatmap-data'>{observationData.date}</span>
            </div>
            <div className='input-block'>
                <label
                    htmlFor='observer-time'
                    className='observation-label'
                >
                    Time
                </label>
                <span id='observer-date' className='heatmap-data'>{observationData.time}</span>
            </div>
            <div className='input-block'>
                <label
                    htmlFor='observer-weather'
                    className='observation-label'
                >
                    Weather
                </label>
                <span id='observer-weather' className='heatmap-data'>
                    {observationData.weather == 'sunny' && <>☀️</>}
                    {observationData.weather == 'cloudy' && <>☁</>}
                </span>
            </div>
            <div className='input-block'>
                <label
                    htmlFor='observer-temperature'
                    className='observation-label'
                >
                    Temperature (°F)
                </label>
                <span id='observer-temperature' className='heatmap-data'>
                    {observationData.temperature ?
                        observationData.temperature : '-'
                    } °F
                </span>
            </div>
            <div className='input-block'>
                <Button
                    label='View >'
                    variation='cta'
                    onClick={() => navigate(`/event/${eventId}/observations/edit/${observationData?.id}`)}
                />
            </div>
        </div>
    )
}

export default ObservationCard;