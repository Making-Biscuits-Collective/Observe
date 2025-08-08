/**
 * Canvas Interface
 * 
 * Interface for activity mapping
 */

import './CanvasInterface.scss';
import { Dispatch, SetStateAction, useState, useEffect, MouseEvent, useRef, RefObject, Ref, ChangeEvent } from 'react';
import { ActivityMapping as ActivityMappingType, Coordinates, FilteredEventInfo, MapData } from '../types/types';
import Button from './Button';

const MARKER_SIZE = 32;
const MOVING_MARKER_SIZE = 16;

const Marker = ({ activityType, coordinates, observationType = 0 }: {
    activityType: ActivityMappingType,
    coordinates: Coordinates,
    observationType?: 0 | 1,
}) => (
    <div
        className='marker'
        style={{
            left: `${coordinates?.x}px`,
            top: `${coordinates?.y}px`,
        }}
    >
        {observationType === 0 && <>
            {activityType == 0 && <img src="/markers/activity-mapping/0.svg" width={MARKER_SIZE} />}
            {activityType == 1 && <img src="/markers/activity-mapping/1.svg" width={MARKER_SIZE} />}
            {activityType == 2 && <img src="/markers/activity-mapping/2.svg" width={MARKER_SIZE} />}
            {activityType == 3 && <img src="/markers/activity-mapping/3.svg" width={MARKER_SIZE} />}
            {activityType == 4 && <img src="/markers/activity-mapping/4.svg" width={MARKER_SIZE} />}
        </>}
        {observationType === 1 && <>
            <img src="/icon/point.svg" width={MOVING_MARKER_SIZE} style={{
                transform: 'translate(-50%, -50%)'
            }} />
        </>}

    </div>
)

const Selectors = ({ activityType, setActivityType, filteredInfo }: {
    activityType: ActivityMappingType,
    setActivityType: Dispatch<SetStateAction<ActivityMappingType>>,
    filteredInfo: FilteredEventInfo | null,
    // updateCanvasData: () => void
}) => {

    return (
        <div className="activity-selector">
            <div className="select-block">
                <input
                    type="radio"
                    id="activity-0"
                    value={0}
                    checked={activityType == 0}
                    onChange={(event) => {
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
                        )
                    }
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
    )
};

const MovingMap = ({
    mapPath,
    activityType,
    setActivityType,
    mapData,
    setMapData,
    filteredInfo
}: {
    mapPath: string,
    activityType: ActivityMappingType,
    setActivityType: Dispatch<SetStateAction<ActivityMappingType>>,
    mapData: MapData[][],
    setMapData: Dispatch<SetStateAction<MapData[][]>>,
    filteredInfo: FilteredEventInfo | null
}) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [currentPlotLine, setCurrentPlotLine] = useState<MapData[]>([]);

    const getStrokeColor = () => {
        switch (activityType) {
            case 0:
                return '#6D0125';
            case 1:
                return '#50AA57';
            case 2:
                return '#FFA800';
            case 3:
                return '#37B5FF';
            case 4:
                return '#8C52FF';
            default:
                return '#6D0125';
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                if (currentPlotLine.length === 0 && mapData.length === 0) {
                    context.clearRect(0, 0, 900, 500);
                }
                if (currentPlotLine.length > 1) { // create a line between previous point and current point
                    context.strokeStyle = getStrokeColor();
                    context.lineWidth = 2;
                    context.lineCap = 'round';
                    context.beginPath();
                    const x = currentPlotLine[0].coordinates?.x;
                    const y = currentPlotLine[0].coordinates?.y;
                    if (x && y) {
                        context.moveTo(x, y);
                        for (let i = 1; i < currentPlotLine.length; i++) {
                            const x = currentPlotLine[i].coordinates?.x;
                            const y = currentPlotLine[i].coordinates?.y;
                            if (x && y) {
                                context.lineTo(x, y);
                            }
                        }
                        context.stroke();
                    }
                }
            }
        } else {
            return;
        }
    }, [currentPlotLine, mapData])

    const handleEnterPlot = (event: MouseEvent<HTMLDivElement>) => {
        let bounds = event.currentTarget.getBoundingClientRect();
        var x = event.clientX - bounds.left - (MARKER_SIZE / 2);
        var y = event.clientY - bounds.top - (MARKER_SIZE / 2);

        console.log(x, y);

        if (currentPlotLine.length >= 1) { // active moving line
            setCurrentPlotLine((prev) => ([
                ...prev,
                {
                    coordinates: {
                        x,
                        y
                    },
                    type: activityType
                } as MapData
            ]))
        } else { // create new moving line
            setCurrentPlotLine([
                {
                    coordinates: {
                        x, y
                    },
                    type: activityType
                } as MapData
            ]);
        }
    }

    const savePlot = () => {
        if (currentPlotLine.length > 0) {
            console.log('Saving plot to map data...')
            setMapData((prev) => ([
                ...prev,
                currentPlotLine
            ]));
            setCurrentPlotLine([]);
        }
    }

    const handleUndo = () => {
        if (currentPlotLine.length > 0) { // in an active line, we will remove the last point
            setCurrentPlotLine([
                ...currentPlotLine.splice(0, -1)
            ])
        } else if (mapData.length > 0) { // undo an entire line
            setMapData([
                ...mapData.splice(0, -1)
            ])
        }
    }

    return (
        <>
            <Selectors
                activityType={activityType}
                setActivityType={setActivityType}
                filteredInfo={filteredInfo}
            />
            <div className='controls'>
                <Button label='Undo' variation='outline' onClick={handleUndo} />
                <Button label='Clear' variation='outline' onClick={() => {
                    setCurrentPlotLine([]);
                    setMapData([]);
                }} />
                {currentPlotLine.length > 0 && <Button label='Record Line' variation='outline' onClick={savePlot} />}
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
                    {mapData && mapData.map(
                        plotLine =>
                            plotLine.map((marker) =>
                                <Marker
                                    key={`${marker.coordinates?.x}+${marker.coordinates?.y}`}
                                    activityType={marker.type}
                                    coordinates={marker.coordinates}
                                    observationType={1}
                                />)
                    )}
                    {
                        currentPlotLine && currentPlotLine.map(
                            marker =>
                                <Marker
                                    key={`${marker.coordinates?.x}+${marker.coordinates?.y}`}
                                    activityType={marker.type}
                                    coordinates={marker.coordinates}
                                    observationType={1}
                                />
                        )
                    }
                </div>
                <canvas className="markers" ref={canvasRef} width={900} height={500} />
            </div>
        </>
    )
}

const InteractiveMap = ({ mapPath, activityType, setActivityType, mapData, setMapData, filteredInfo }: {
    mapPath: string,
    activityType: ActivityMappingType,
    setActivityType: Dispatch<SetStateAction<ActivityMappingType>>,
    mapData: MapData[],
    setMapData: Dispatch<SetStateAction<MapData[]>>,
    filteredInfo: FilteredEventInfo | null
}) => {

    const handleEnterPlot = (event: MouseEvent<HTMLDivElement>) => {
        let bounds = event.currentTarget.getBoundingClientRect();
        var x = event.clientX - bounds.left - (MARKER_SIZE / 2);
        var y = event.clientY - bounds.top - (MARKER_SIZE / 2);
        if (x && y) {
            setMapData([
                ...mapData,
                {
                    coordinates: {
                        x, y
                    },
                    type: activityType ?? 0
                }
            ]);
        }
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
                <Button label='Undo' variation='outline' onClick={handleUndo} />
                <Button label='Clear' variation='outline' onClick={() => {
                    setMapData([]);
                }} />
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
                    {mapData && mapData.map(
                        marker =>
                            <Marker
                                key={`${marker.coordinates?.x}+${marker.coordinates?.y}`}
                                activityType={marker.type}
                                coordinates={marker.coordinates}
                            />
                    )}
                </div>
            </div>
        </>
    )
}

const CanvasInterface = ({ activityType, setActivityType, mapPath, mapData, setMapData, filteredInfo, observationType = 0 }: {
    activityType: ActivityMappingType,
    setActivityType: Dispatch<SetStateAction<ActivityMappingType>>,
    mapPath: string,
    mapData: MapData[] | MapData[][],
    setMapData: Dispatch<SetStateAction<MapData[]>> | Dispatch<SetStateAction<MapData[][]>>,
    filteredInfo: FilteredEventInfo | null,
    observationType?: number
}) => {
    return (
        <div className="observation-interface">
            {
                observationType === 0 &&
                <InteractiveMap
                    mapPath={mapPath}
                    activityType={activityType}
                    setActivityType={setActivityType}
                    mapData={mapData as MapData[]}
                    setMapData={setMapData as Dispatch<SetStateAction<MapData[]>>}
                    filteredInfo={filteredInfo}
                />
            }
            {
                observationType === 1 &&
                <MovingMap
                    mapPath={mapPath}
                    activityType={activityType}
                    setActivityType={setActivityType}
                    mapData={mapData as MapData[][]}
                    setMapData={setMapData as Dispatch<SetStateAction<MapData[][]>>}
                    filteredInfo={filteredInfo}
                />
            }
        </div>
    )
}

export default CanvasInterface;