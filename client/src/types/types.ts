export type Project = {
    title: string;
    short_description?: string;
    description?: string;
    id?: number;
    status?: string; //TODO: enum
    start_date?: string;
    end_date?: string;
    image_path?: string
}

export type ProjectLoadingState = "LOADING" | "LOADED" | "ERROR"
export type LoadingState = "IDLE" | "LOADING" | "LOADED" | "ERROR"

export type Event = {
    title: string;
    date: string;
    location: string;
    map_path: string;
    start_date?: string;
    notes?: string;
    id?: string;
    project?: string;
    label_mapping0?: string;
    label_mapping1?: string;
    label_mapping2?: string;
    label_mapping3?: string;
    label_mapping4?: string;
}

export type ActivityMapping = 0 | 1 | 2 | 3 | 4;

export type FilteredEventInfo = {
    title: string;
    map_path: string;
    label_mapping0?: string;
    label_mapping1?: string;
    label_mapping2?: string;
    label_mapping3?: string;
    label_mapping4?: string;
}

export type Data<T> = {
    data: T | null;
    error: any;
};

export type Coordinates = {
    x: number;
    y: number;
}

export type MapData = {
    coordinates: Coordinates;
    type: ActivityMapping;
}

export type ObservationData = {
    observer_name: string;
    date: string;
    time: string;
    temperature?: number;
    weather?: string;
    notes?: string;
    map_data?: string;
    event?: string;
    id?: string;
}

export type HeatmapData = {
    id?: string;
    title: string;
    created_at?: string;
    modified_at?: string;
    filter?: JSON;
    map_data: string;
    eventId?: string;
}

export type HeatmapInstance = {
    id?: string;
    heatmapId: string;
    instanceId: string;
}

export type ObsState = {
    observationId: string;
    coordinatesList: MapData[];
} 

export type JoinHeatmapInstance = {
    instanceId: string;
}

export type EventCode = {
    id?: string;
    eventId: string;
    eventCode: string;
}