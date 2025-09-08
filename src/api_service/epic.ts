// api/epic.ts
import { EPICResponse } from "../types/epic";
import axios from "axios";

// const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";

export const getEPIC = async (date?: string): Promise<EPICResponse> => {
    try {

        const formattedDate = date.split(' ')[0].replace(/-/g, '');

        const url = `https://epic.gsfc.nasa.gov/api/natural/date/${formattedDate}`;
        const response = await axios.get<EPICResponse>(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching EPIC metadata:", error);
        throw error;
    }
};

export default getEPIC;
