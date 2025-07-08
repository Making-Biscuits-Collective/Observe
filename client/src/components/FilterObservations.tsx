import { ChangeEvent, useEffect } from 'react';
import { Coordinates, MapData, ObsState, ObservationData } from '../types/types';
import './FilterObservations.scss';

const ObservationListItem = ({data, selectedData, handleChange} : {
    data: ObservationData,
    selectedData: ObsState[],
    handleChange: (obsId: string, coords: MapData[]) => void,
}) => {

    function isChecked(value: string) {
        const found = selectedData.find(obs => obs.observationId == value);
        if (found) return true;
        else return false;
    }

    const mapData = data?.map_data ? JSON.parse(data?.map_data) as MapData[] : [];

    useEffect(() => {

    }, [selectedData]);

    return (
    <li className={`observation-item${data?.id && isChecked(data.id) ? ' checked' : ''}`}>
        <span className='obs-id'>
            <input 
                className='observation-check'
                type='checkbox' 
                id={data?.id}
                checked={data?.id ? isChecked(data.id) : false} 
                onChange={() => handleChange(data?.id ? data.id : '', mapData)}
            />
            {data?.id}
        </span>
        <span className='obs-date'>
            {data?.date}
        </span>
        <span className='obs-time'>
            {data?.time}
        </span>
        <span className='obs-weather'>
            {data?.weather}
        </span>
        <span className='obs-temp'>
            {data?.temperature ?? '-'}
        </span>
        <span className='obs-name'>
            {data?.observer_name}
        </span>
    </li>
)}

const FilterObservations = ({observations, selectedData, handleChange} : {
    observations: ObservationData[],
    selectedData: ObsState[],
    handleChange: (obsId: string, coords: MapData[]) => void,
}) => {
    return (
        <div className='filter-observations component'>
            <div className='filter-observations-headers'>
                <span className='obs-id header'>ID</span>
                <span className='obs-date header'>Date</span>
                <span className='obs-time header'>Time</span>
                <span className='obs-weather header'>Weather</span>
                <span className='obs-temp header'>Temperature (F)</span>
                <span className='obs-name header'>Observer Name</span>
            </div>
            {observations.length > 0 ? 
            <ul className='filter-observations-list'>
                {observations.map((observation) => 
                <ObservationListItem data={observation} selectedData={selectedData} handleChange={handleChange}/>)}
            </ul> : <p>There are currently no recorded observations for this event.</p>}
        </div>
    )
}

export default FilterObservations;