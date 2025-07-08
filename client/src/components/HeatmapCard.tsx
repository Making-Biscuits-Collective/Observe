import { useNavigate, useParams } from 'react-router-dom';
import { HeatmapData } from '../types/types';
import Button from './Button';
import './HeatmapCard.scss';

const HeatmapCard = ({
    heatmapData
} : {
    heatmapData: HeatmapData
}) => {

    const navigate = useNavigate();
    const { eventId } = useParams();

    return (
        <div className='heatmap-card'>
            <div className='input-block'>
                <label 
                    htmlFor='heatmap-id'
                    className='observation-label'
                >
                    ID
                </label>
                <span id='observer-id' className='observer-data'>{heatmapData.id}</span>
            </div>
            <div className='input-block'>
                <label 
                    htmlFor='heatmap-created'
                    className='observation-label'
                >
                    Created
                </label>
                <span id='observer-name' className='observer-data'>{heatmapData.created_at}</span>
            </div>
            
            <div className='input-block'>
                <Button 
                    label='View >'
                    variation='cta'
                    onClick={() => navigate(`/event/${eventId}/heatmaps/edit/${heatmapData.id}`)}
                />
            </div>
        </div>
    )
}

export default HeatmapCard;