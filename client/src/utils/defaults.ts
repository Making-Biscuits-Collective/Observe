/**
 * Default Values for Frontend
 */

import { Event } from "../types/types"

/**
 * Event Types
 */
const StayingEventDefault: Event = {
    type: 'STAY',
    title: '',
    date: '',
    location: '',
    map_path: '',
    notes: '',
    label_mapping0: 'Sitting',
    label_mapping1: 'Standing',
    label_mapping2: 'Laying Down',
    label_mapping3: 'Idling',
    label_mapping4: 'Other',
}

const MovingEventDefault: Event = {
    type: 'MOVE',
    title: '',
    date: '',
    location: '',
    map_path: '',
    notes: '',
    label_mapping0: 'Walking',
    label_mapping1: 'Running',
    label_mapping2: 'Biking',
    label_mapping3: 'Vehicle',
    label_mapping4: 'Other',
}

const MovingEventLabelDefaults = {
    label_mapping0: 'Walking',
    label_mapping1: 'Running',
    label_mapping2: 'Biking',
    label_mapping3: 'Vehicle',
    label_mapping4: 'Other',
}

const StayingEventLabelDefaults = {
    label_mapping0: 'Sitting',
    label_mapping1: 'Standing',
    label_mapping2: 'Laying Down',
    label_mapping3: 'Idling',
    label_mapping4: 'Other',
}

export { StayingEventDefault, MovingEventDefault, MovingEventLabelDefaults, StayingEventLabelDefaults };