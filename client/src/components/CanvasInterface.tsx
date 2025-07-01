/**
 * Canvas Interface
 * 
 * Interface for activity mapping
 */

import './CanvasInterface.scss';
import { Dispatch, SetStateAction, useState, useEffect, MouseEvent, MouseEventHandler } from 'react';
import { ActivityMapping as ActivityMappingType } from '../types/types';
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
        {activityType == 'SITTING' && <img src="/markers/activity-mapping/sitting.svg" width={MARKER_SIZE} />}
        {activityType == 'STANDING' && <img src="/markers/activity-mapping/standing.svg" width={MARKER_SIZE} />}
        {activityType == 'OTHER' && <img src="/markers/activity-mapping/other.svg" width={MARKER_SIZE} />}
    </div>
)

const Selectors = ({activityType, setActivityType, updateCanvasData} : {
    activityType: ActivityMappingType,
    setActivityType: Dispatch<SetStateAction<ActivityMappingType>>,
    updateCanvasData: () => void
}) => (
    <div className="activity-selector">
        <div className="select-block">
            <input 
                type="radio" 
                id="activity-sitting" 
                value="SITTING"
                checked={activityType == "SITTING"}
                onChange={(event) => {
                        updateCanvasData();
                        setActivityType(
                            event.target.value as ActivityMappingType
                        );
                }}
            />
            <label htmlFor="activity-sitting" className="centered-selection">
                <img src="/markers/activity-mapping/sitting.svg" width={32} />
                <span className="activity-label">Sitting</span>
            </label>
        </div>
        <div className="select-block">
            <input 
                type="radio" 
                id="activity-standing" 
                value="STANDING"
                checked={activityType == "STANDING"}
                onChange={(event) => {
                    updateCanvasData();
                    setActivityType(
                        event.target.value as ActivityMappingType
                    )}
                }
            />
            <label htmlFor="activity-standing" className="centered-selection">
                <img src="/markers/activity-mapping/standing.svg" width={32} />
                <span className="activity-label">Standing</span>
            </label>
        </div>
        <div className="select-block">
            <input 
                type="radio" 
                id="activity-other" 
                value="OTHER"
                checked={activityType == "OTHER"}
                onChange={(event) => {
                    updateCanvasData();
                    setActivityType(
                        event.target.value as ActivityMappingType
                    )
                }}
            />
            <label htmlFor="activity-other" className="centered-selection">
                <img src="/markers/activity-mapping/other.svg" width={32} />
                <span className="activity-label">Other</span>
            </label>
        </div>
    </div>
);

type Coordinates = {
    x: number;
    y: number;
}

type MapData = {
    coordinates: Coordinates;
    type: ActivityMappingType;
}

const InteractiveMap = ({mapPath, activityType, setActivityType} : {
    mapPath: string,
    activityType: ActivityMappingType,
    setActivityType: Dispatch<SetStateAction<ActivityMappingType>>
}) => {

    const [isPlotting, setIsPlotting] = useState<boolean>(false);
    const [currentXY, setCurrentXY] = useState<Coordinates | null>(null);
    const [currentActivityType, setCurrentActivityType] = useState<ActivityMappingType | null>(null);
    const [mapData, setMapData] = useState<MapData[]>([]);
    
    useEffect(() => {

    }, [isPlotting])

    const updateCanvasData = () => {
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
    }

    const handleEnterPlot = (event: MouseEvent<HTMLDivElement>) => {
        setIsPlotting(true);
        updateCanvasData();
        let bounds = event.currentTarget.getBoundingClientRect();
        var x = event.clientX - bounds.left - (MARKER_SIZE/2);
        var y = event.clientY - bounds.top - (MARKER_SIZE/2);
        setCurrentXY({x, y});
        setCurrentActivityType(activityType);
    }

    const handleResetXY = () => {
        setCurrentXY(null);
    }

    return (
        // 900x500
        <>
        <Selectors 
            activityType={activityType}
            setActivityType={setActivityType}
            updateCanvasData={updateCanvasData}
        />
        <div className='controls'>
            <Button label='Save' variation='primary' onClick={() => {
            }}/>
            <Button label='Undo' variation='outline' onClick={handleResetXY}/>
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

const CanvasInterface = ({activityType, setActivityType, mapPath} : {
    activityType: ActivityMappingType,
    setActivityType: Dispatch<SetStateAction<ActivityMappingType>>,
    mapPath: string,
}) => {
    return (
        <div className="observation-interface">
            <InteractiveMap 
                mapPath={mapPath} 
                activityType={activityType}
                setActivityType={setActivityType}
            />
        </div>
    )
}

export default CanvasInterface;