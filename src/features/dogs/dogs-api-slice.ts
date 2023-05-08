import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const DOGS_API_KEY = "SDFDSF";

interface Breed {
    id: string;
    name: string;
    image: {
        url: string
    }
}

export const apiSlice = createApi({
    reducerPath: 'apit',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://api.thedogapi.com/v1'/*,
        prepareHeaders(headers) {
            headers.set('x-api-key', DOGS_API_KEY);

            return headers;
        }*/
    }),
    endpoints(builder) {
        return {
            fetchBreeds: builder.query<Breed[], number|void>({
                query(limit = 10) {
                    return `/breeds?limit=${limit}`;
                }
            })
        }
    }
})

export const { useFetchBreedsQuery} = apiSlice;