import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

interface Assistant {
    id: string;
    name: string;
}

export const gptApiSlice = createApi({
    reducerPath: 'apiGpt',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_HOST}/api/v1/sophi/`,
        prepareHeaders(headers) {
            headers.set('Accept', 'application/json');
        }
    }),
    endpoints(builder) {
        return {
            fetchGpts: builder.query<Assistant[], boolean>({
                query() {
                    return `/assistant/`;
                }
            })
        }
    
    }
});