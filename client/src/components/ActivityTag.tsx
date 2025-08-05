import './ActivityTag.scss';
import { useMemo } from 'react';

const ActivityTag = ({
    eventType
}: {
    eventType: string;
}) => {

    const activityClass = useMemo(() => {
        if (eventType == 'STAY') {
            return 'staying';
        } else if (eventType == 'MOVE') {
            return 'moving';
        } else {
            return '';
        }
    }, [eventType]);

    return (
        <>
            <div className={`event-activity-tag ${activityClass}`}>
                {activityClass} Activity
            </div>
        </>
    )
}

export default ActivityTag;