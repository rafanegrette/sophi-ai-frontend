import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export interface Assistant {
    id: string;
    title: string;
    description: string;
}

export const assistantApiSlice = createApi({
    reducerPath: 'apiAssistant',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_HOST}/api/v1/sophi/`,
        prepareHeaders(headers) {
            headers.set('Content-Type', 'application/json');
        }
    }),
    endpoints(builder) {
        return {
            fetchAssistant: builder.query<Assistant[], void>({
                query() {
                    return `/assistant/`;
                }
            })
        }
    
    }
});

export const { useFetchAssistantQuery } = assistantApiSlice;