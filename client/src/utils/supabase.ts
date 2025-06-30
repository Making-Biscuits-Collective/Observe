import { createClient } from "@supabase/supabase-js";

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