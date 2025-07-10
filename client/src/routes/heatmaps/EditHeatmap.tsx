import { 
    createRef,
    useCallback, 
    useEffect, 
    useRef, 
    useState 
} from 'react';
import LayoutWrapper from '../../partials/LayoutWrapper';
import { 
    getImageURLFromBucket, 
    getEventById, 
    getHeatmapDataById, 
    getHeatmapObservationIds, 
    updateHeatmap 
} from '../../utils/supabase';
import { useScreenshot, createFileName } from 'use-react-screenshot';
import { useParams } from 'react-router-dom';
import { LoadingState, Event as EventType, FilteredEventInfo, HeatmapData } from '../../types/types';
import Alert from '../../components/Alert';
import h337 from 'heatmap.js';
import Button from '../../components/Button';
import Breadcrumb from '../../components/Breadcrumb';
import Loading from '../../components/Loading';
import './EditHeatmap.scss';


const imageUrlToBase64 = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Failed to convert image URL to Base64:", error);
        return ''; // Return empty string or handle error as appropriate
    }
};


const EditHeatmap = () => {

    const { eventId, heatmapId } = useParams();
    const [heatmapDetails, setHeatmapDetails] = useState<HeatmapData>({
        title: '',
        map_data: '',
        eventId
    });
    const [rawMap, setRawMap] = useState<string>('');
    const [loadedMapURL, setLoadedMapURL] = useState<HTMLImageElement>();
    const [base64Map, setBase64Map] = useState<string>('');
    const [loadingState, setLoadingState] = useState<LoadingState>("IDLE");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [heatmapLoaded, setHeatmapLoaded] = useState<boolean>(false);

    const [totalObservations, setTotalObservations] = useState<string>('0');
    const [downloadMapUrl, setDownloadMapUrl] = useState<string>('');

    const [image, takeScreenshot] = useScreenshot({
        type: "image/jpeg",
        quality: 1.0,
        useCORS: true,
        allowTaint: false,
        logging: true,
    });

    const heatmapImageRef = createRef<HTMLDivElement>();
    const heatmapContainerRef = useRef<HTMLDivElement>(null); // Ref for the div heatmap.js will draw into
    const heatmapInstanceRef = useRef<h337.Heatmap<any, any, any> | null>(null); // Ref to store the heatmap.js instance

    

    useEffect(() => {
        // Network Calls to Fetch Data
        if (eventId) {
            getEventById(eventId).then(({ data, error }) => {
                if (data) {
                    const eventInfo: EventType | FilteredEventInfo | undefined = data?.[0];
                    if (eventInfo) {
                        getImageURLFromBucket({
                            imagePath: eventInfo.map_path,
                            bucket: 'event-maps'
                        }).then(async imageURL => { // Added async here to use await
                            // Convert to base64 image string
                            const base64String = await imageUrlToBase64(imageURL);
                            if (base64String) {
                                setBase64Map(base64String);
                                console.log("Background image converted to Base64 successfully.");
                            } else {
                                console.warn("Could not convert background image to Base64. It might not be captured.");
                            }
                        });;
                    }
                } else {
                    console.error(error);
                }
            })
            if (heatmapId) {
                getHeatmapDataById(heatmapId).then(({data, error}) => {
                    if (data) {
                        const heatmapInfo = data[0] as HeatmapData;
                        if (heatmapInfo) {
                            setHeatmapDetails(heatmapInfo);
                            setRawMap(heatmapInfo.map_data);
                            // if (heatmapInstanceRef?.current) {
                            //     heatmapInstanceRef.current.repaint();
                            // }
                            if (heatmapContainerRef.current && !heatmapInstanceRef.current) {
                                heatmapInstanceRef.current = h337.create({
                                    container: heatmapContainerRef.current,
                                    radius: 100,     // The radius of the heatmap points
                                    maxOpacity: 0.8, // Max opacity for the hottest points
                                    minOpacity: 0, // Min opacity for the coolest points (fading out)
                                    blur: 0.75,     // Blur factor, higher means smoother transitions
                                });
                            }
                        }
                        getHeatmapObservationIds(heatmapId).then(({data: obsIds , error: obsErr}) => {
                            if (obsIds) {
                                setTotalObservations(obsIds.length.toString());
                            } else if (obsErr) {
                                console.error(error);
                            }
                        })
                    } else if (error) {
                        console.error(error);
                    }
                })
            }
        }
    }, [])

    useEffect(() => {
        if (heatmapInstanceRef.current) { 
            try {
                heatmapInstanceRef.current.setData({
                    data: JSON.parse(rawMap) ?? [],
                    max: 1,
                    min: 0
                });
            } catch (error) {
                console.error(error);
            }
            // setHeatmapLoaded(true);
          }
          setHeatmapLoaded(true);
    }, [rawMap, heatmapContainerRef])
    
    const heatmapContainerRefCallback = useCallback((node: HTMLDivElement | null) => {
        if (node) {
          heatmapInstanceRef.current = h337.create({
            container: node,
            radius: 100,
            maxOpacity: 0.8,
            minOpacity: 0,
            blur: 0.75,
          });
      
          if (rawMap) {
            try {
              heatmapInstanceRef.current.setData({
                data: JSON.parse(rawMap),
                max: 1,
                min: 0,
              });
              setHeatmapLoaded(true);
              setDownloadMapUrl(heatmapInstanceRef.current.getDataURL());
            } catch (err) {
              console.error("Error parsing heatmap data:", err);
            }
          }
        }
      }, [rawMap]);

    const saveHeatmap = () => {
        setLoadingState("LOADING");
        if (heatmapDetails.title) {
            updateHeatmap(heatmapDetails, []).then(({data, error}) => {
                if (data) {
                    setLoadingState("LOADED");
                } else if (error) {
                    setLoadingState("ERROR");
                }
            });
        }
    }

    const downloadJPEG = (image: any) => {
        const a = document.createElement('a');
        a.href = image;
        a.download = createFileName('jpeg', heatmapDetails?.title ?? 'My Heatmap');
        a.click();
    }

    return (
        <LayoutWrapper>
            <Alert 
                message={loadingState == 'LOADED' ? 'Your heatmap has been updated successfully!' : 'There was a problem updating this heatmap, please try again!'}
                variation={loadingState == 'LOADED' ? 'CONF' : 'ERR'}
                isOpen={showAlert}
                setIsOpen={setShowAlert}
            />
            <section className='observe-edit-heatmap-page edit-map'>
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
                            <h1 className="page-title">Update Heatmap ({totalObservations} observations)</h1>
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
                        <div className='update-button'>
                            <Button 
                                variation='primary' 
                                label={loadingState == 'LOADING' ? 'Updating...' : 'Update Heatmap'}
                                size='large'
                                disabled={(heatmapDetails.title.length <= 0) || loadingState == 'LOADING'}
                                onClick={saveHeatmap}
                            />
                        </div>
                    </div>
                    <div className="heatmap-details">
                        <h2>Heatmap Details</h2>
                        <div>
                            <label htmlFor="created">Created At</label>
                            <span id="detail-value">{heatmapDetails.created_at}</span>
                        </div>
                        <div>
                            <label htmlFor="created">Last Modified</label>
                            <span id="detail-value">{heatmapDetails.modified_at ?? '-'}</span>
                        </div>
                        {/* <div>
                            <label htmlFor="created">Heatmap Data</label>
                            <span id="detail-value">{heatmapDetails.map_data ?? '-'}</span>
                        </div> */}
                        <div className='actions'>
                            <Button 
                                label='Download JPEG' 
                                variation='primary'
                                onClick={() => takeScreenshot(heatmapImageRef.current).then(downloadJPEG)}
                            />
                            <Button label='Download PDF' variation='primary' disabled/>
                        </div>
                    </div>
                </div>
                <div className='container-max observations-container' ref={heatmapImageRef}>
                    {heatmapLoaded ? <div 
                        className='heatmap-preview'
                        style={{
                            background: `url('${base64Map}') no-repeat center`
                        }}
                    >
                        {/* <img src={loadedMapURL?.src} crossOrigin="anonymous"/> */}
                        <div className='heatmap-overlay-container'>
                            <div 
                                className='heatmap-overlay' 
                                ref={heatmapContainerRefCallback}
                                style={{
                                    height: '500px'
                                }}
                            >
                            </div>
                        </div>
                    </div> : <Loading />}
                </div>
                {/* <div className='container'>
                    <h2>Screenshot Preview</h2>
                    <Button label='Take Screenshot' variation='primary' onClick={() => takeScreenshot(heatmapImageRef.current)}/>
                    {image && (
                        <div style={{ marginTop: '20px' }}>
                            <img src={image} alt="Generated Screenshot" style={{ maxWidth: '100%', border: '1px solid #ccc', borderRadius: '8px' }} />
                        </div>
                    )}
                </div> */}
            </section>
        </LayoutWrapper>
    )
}

export default EditHeatmap;

