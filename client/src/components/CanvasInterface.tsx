/**
 * Canvas Interface
 * 
 * Interface for activity mapping
 */

import './CanvasInterface.scss';
import { Dispatch, SetStateAction, useState, useEffect, MouseEvent, MouseEventHandler } from 'react';
import { ActivityMapping as ActivityMappingType, Coordinates, FilteredEventInfo, MapData } from '../types/types';
import Button from './Button';

const MARKER_SIZE = 32;

const Marker = ({activityType, coordinates} : {
    activityType: ActivityMappingType,
    coordinates: Coordinates
}) => (
    <div 
        className='marker'
        style={{
            left: `${coordinates?.x}px`,
            top: `${coordinates?.y}px`,
        }}
    >
        {activityType == 0 && <img src="/markers/activity-mapping/0.svg" width={MARKER_SIZE} />}
        {activityType == 1 && <img src="/markers/activity-mapping/1.svg" width={MARKER_SIZE} />}
        {activityType == 2 && <img src="/markers/activity-mapping/2.svg" width={MARKER_SIZE} />}
        {activityType == 3 && <img src="/markers/activity-mapping/3.svg" width={MARKER_SIZE} />}
        {activityType == 4 && <img src="/markers/activity-mapping/4.svg" width={MARKER_SIZE} />}
    </div>
)

const Selectors = ({activityType, setActivityType, filteredInfo} : {
    activityType: ActivityMappingType,
    setActivityType: Dispatch<SetStateAction<ActivityMappingType>>,
    filteredInfo: FilteredEventInfo | null
    // updateCanvasData: () => void
}) => (
    <div className="activity-selector">
        <div className="select-block">
            <input 
                type="radio" 
                id="activity-0" 
                value={0}
                checked={activityType == 0}
                onChange={(event) => {
                        // updateCanvasData();
                        setActivityType(
                            Number(event.target.value) as ActivityMappingType
                        );
                }}
            />
            <label htmlFor="activity-0" className="centered-selection">
                <img src="/markers/activity-mapping/0.svg" width={32} />
                <span className="activity-label">{filteredInfo?.label_mapping0 ?? 'Sitting'}</span>
            </label>
        </div>
        <div className="select-block">
            <input 
                type="radio" 
                id="activity-1" 
                value={1}
                checked={activityType == 1}
                onChange={(event) => {
                    setActivityType(
                        Number(event.target.value) as ActivityMappingType
                    )}
                }
            />
            <label htmlFor="activity-1" className="centered-selection">
                <img src="/markers/activity-mapping/1.svg" width={32} />
                <span className="activity-label">{filteredInfo?.label_mapping1 ?? 'Standing'}</span>
            </label>
        </div>
        <div className="select-block">
            <input 
                type="radio" 
                id="activity-2" 
                value={2}
                checked={activityType == 2}
                onChange={(event) => {
                    setActivityType(
                        Number(event.target.value) as ActivityMappingType
                    )
                }}
            />
            <label htmlFor="activity-2" className="centered-selection">
                <img src="/markers/activity-mapping/2.svg" width={32} />
                <span className="activity-label">{filteredInfo?.label_mapping2 ?? 'Lying'}</span>
            </label>
        </div>
        <div className="select-block">
            <input 
                type="radio" 
                id="activity-3" 
                value={3}
                checked={activityType == 3}
                onChange={(event) => {
                    // updateCanvasData();
                    setActivityType(
                        Number(event.target.value) as ActivityMappingType
                    )
                }}
            />
            <label htmlFor="activity-3" className="centered-selection">
                <img src="/markers/activity-mapping/3.svg" width={32} />
                <span className="activity-label">{filteredInfo?.label_mapping3 ?? 'Lying'}</span>
            </label>
        </div>
        <div className="select-block">
            <input 
                type="radio" 
                id="activity-4" 
                value={4}
                checked={activityType == 4}
                onChange={(event) => {
                    setActivityType(
                        Number(event.target.value) as ActivityMappingType
                    )
                }}
            />
            <label htmlFor="activity-4" className="centered-selection">
                <img src="/markers/activity-mapping/4.svg" width={32} />
                <span className="activity-label">{filteredInfo?.label_mapping4 ?? 'Lying'}</span>
            </label>
        </div>
    </div>
);

const InteractiveMap = ({mapPath, activityType, setActivityType, mapData, setMapData, filteredInfo} : {
    mapPath: string,
    activityType: ActivityMappingType,
    setActivityType: Dispatch<SetStateAction<ActivityMappingType>>,
    mapData: MapData[],
    setMapData: Dispatch<SetStateAction<MapData[]>>,
    filteredInfo: FilteredEventInfo | null
}) => {

    const [isPlotting, setIsPlotting] = useState<boolean>(false);
    const [currentXY, setCurrentXY] = useState<Coordinates | null>(null);
    const [currentActivityType, setCurrentActivityType] = useState<ActivityMappingType | null>(null);
    
    useEffect(() => {
        if (currentXY && currentActivityType) {
            setMapData(
                [
                    ...mapData, 
                    {
                        coordinates: currentXY,
                        type: currentActivityType
                    }
                ]
            );
            setCurrentXY(null);
        }
    }, [currentXY])

    const handleEnterPlot = (event: MouseEvent<HTMLDivElement>) => {
        setIsPlotting(true);
        let bounds = event.currentTarget.getBoundingClientRect();
        var x = event.clientX - bounds.left - (MARKER_SIZE/2);
        var y = event.clientY - bounds.top - (MARKER_SIZE/2);
        setCurrentXY({x, y});
        setCurrentActivityType(activityType);
    }

    const handleUndo = () => {
        if (mapData.length > 0) {
            setMapData([
                ...mapData.slice(0, -1)
            ]);
        }
    }

    return (
        // 900x500
        <>
        <Selectors 
            activityType={activityType}
            setActivityType={setActivityType}
            filteredInfo={filteredInfo}
        />
        <div className='controls'>
            <Button label='Undo' variation='outline' onClick={handleUndo}/>
            <Button label='Clear' variation='outline' onClick={() => {
                setMapData([]);
                setCurrentXY(null);
            }}/>
        </div>
            <div 
                className="interactive-map"
                onClick={handleEnterPlot}
            >
                <img 
                    className='map-image'
                    src={mapPath} 
                    width="100%"
                />
                <div className="markers">
                    {currentXY && <Marker activityType={activityType} coordinates={currentXY}/>}
                    {mapData && mapData.map(
                        marker => 
                        <Marker 
                            key={`${marker.coordinates.x}+${marker.coordinates.y}`}
                            activityType={marker.type} 
                            coordinates={marker.coordinates}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

const CanvasInterface = ({activityType, setActivityType, mapPath, mapData, setMapData, filteredInfo} : {
    activityType: ActivityMappingType,
    setActivityType: Dispatch<SetStateAction<ActivityMappingType>>,
    mapPath: string,
    mapData: MapData[],
    setMapData: Dispatch<SetStateAction<MapData[]>>,
    filteredInfo: FilteredEventInfo | null
}) => {
    return (
        <div className="observation-interface">
            <InteractiveMap 
                mapPath={mapPath} 
                activityType={activityType}
                setActivityType={setActivityType}
                mapData={mapData}
                setMapData={setMapData}
                filteredInfo={filteredInfo}
            />
        </div>
    )
}

export default CanvasInterface;