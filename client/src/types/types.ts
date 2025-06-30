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

export type Event = {
    title: string;
    date: string;
    location: string;
    map_path: string;
    start_date?: string;
    notes?: string;
    id?: string;
    project?: string;
}

export type ActivityMapping = "SITTING" | "STANDING" | "OTHER"

export type ObservationData = {
    name: string;
    date: string;
    time: string;
    temperature?: string;
    weather?: string;
    notes?: string;
    data_points?: Array<string>;
}

export type FilteredEventInfo = {
    title: string;
    map_path: string;
}


export type Data<T> = {
    data: T | null;
    error: any;
};