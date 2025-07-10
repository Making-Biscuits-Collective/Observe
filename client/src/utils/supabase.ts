import { createClient } from "@supabase/supabase-js";
import { Project, Data, FilteredEventInfo, Event, ObservationData, HeatmapData, JoinHeatmapInstance } from "../types/types";
import { generateEventCode, generateUUID } from '../utils/util';



const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://bbfbqkwysuphjuptffpu.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZmJxa3d5c3VwaGp1cHRmZnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDI3ODgsImV4cCI6MjA1OTAxODc4OH0.JUTuq9X_zxsUcnTiFLHyiHFk33drcZ0NaLxB97GGSh0';

export const supabase = createClient(supabaseUrl, supabaseKey);  

export async function getImageURLFromBucket({
    imagePath,
    bucket
} : {
    imagePath: string | undefined;
    bucket: string;
}) {

    const pathToUse = imagePath ? (
        imagePath.length > 0 ? imagePath : 'default.png'
    ) : 'default.png';

    const { data } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(pathToUse);

    return data?.publicUrl;
}

export async function createNewProject(newProject: Project) {
    return await supabase
    .from('projects')
    .insert([
        { 
            title: newProject.title,
            description: newProject.description,
        },
    ]).select();
}

// export async function createNewEvent(newEvent: Event) {
//     return await supabase
//     .from('events')
//     .insert([
//         newEvent
//     ])
//     .select();
// }

export async function createNewEvent(newEvent: Event) {
    const { data, error } = await supabase
    .from('events')
    .insert([
        newEvent
    ])
    .select('id');

    if (data) {
        const eventId = data[0]?.id;
        const eventCode = generateEventCode();
        //todo: add try/catch to check unique event code
        return await supabase
        .from('EventCodes')
        .insert([{
            eventId,
            eventCode
        }])
        .select()
    } else {
        return { data: null, error };
    }
}

export async function getEventCode(eventId: string) {
    return await supabase
    .from('EventCodes')
    .select('eventCode')
    .eq('eventId', eventId) as Data<{ eventCode: string; }[]>
}

export async function getProjects() {
    return await supabase
    .from('projects')
    .select('*') as Data<Project[]>;
}

export async function getProjectById(projectId: string | undefined, selectParams?: string) {
    return await supabase 
    .from('projects')
    .select(selectParams || '*')
    .eq('id', projectId)
    .limit(1) as Data<Project[]>;
}


export async function getEventsByProjectId(projectId: string | number | undefined) {
    return await supabase
    .from('events')
    .select('*')
    .eq('project', projectId) as Data<Event[]>;
}

export async function getEventById(eventId: string | undefined, selectParams?: string) {
    return await supabase
        .from('events')
        .select(selectParams || '*')
        .eq('id', eventId)
        .limit(1) as Data<FilteredEventInfo[] | Event[]>;
}

export async function updateProject(projectInfo: Project) {
    return await supabase
        .from('projects')
        .update({
            title: projectInfo.title
        }) 
        .eq('id', projectInfo.id)
        .select();
}

export async function deleteProject(projectId: string | undefined) {
    return await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);
}

export async function deleteEvent(eventId: string | undefined) {
    return await supabase
    .from('events')
    .delete()
    .eq('id', eventId);
}

export async function uploadEventMap(mapFile: File) {
    return await supabase
    .storage
    .from('event-maps')
    .upload(generateUUID(), mapFile)
}

export async function createObservation(observation: ObservationData) {
    return await supabase
    .from('instances')
    .insert([
        observation
    ])
    .select();
}

// Change to Add Params
export async function getObservationsByEventId(eventId: string) {
    return await supabase
    .from('instances')
    .select('*')
    .eq('event', eventId) as Data<ObservationData[]>;
}

export async function getObservationDataById(observationId: string) {
    return await supabase
    .from('instances')
    .select('*')
    .eq('id', observationId) as Data<ObservationData[]>;
}

export async function createNewHeatmap(heatmapData: HeatmapData, instances: JoinHeatmapInstance[]) {
    const { data, error } = await supabase
    .from('heatmaps')
    .insert([
        heatmapData
    ])
    .select('id');

    if (data) {
        const heatmapId = data[0]?.id;
        return await supabase
        .from('HeatmapInstances')
        .insert(instances.map(obs => ({
            ...obs,
            heatmapId
        })))
        .select()
    } else {
        return { data: null, error };
    }
}

export async function updateHeatmap(heatmapData: HeatmapData, instances: JoinHeatmapInstance[]) {
    return await supabase
    .from('heatmaps')
    .update([{title: heatmapData.title }]) 
    .eq('id', heatmapData.id)
    .select();
}

export async function getHeatmapsByEventId(eventId: string) {
    return await supabase
    .from('heatmaps')
    .select('*')
    .eq('eventId', eventId) as Data<HeatmapData[]>;
}

export async function getHeatmapDataById(heatmapId: string) {
    return await supabase
    .from('heatmaps')
    .select('*')
    .eq('id', heatmapId) as Data<HeatmapData[]>;
}

export async function getHeatmapObservationIds(heatmapId: string) {
    return await supabase 
    .from('HeatmapInstances')
    .select('instanceId')
    .eq('heatmapId', heatmapId) as Data<JoinHeatmapInstance[]>;
}

