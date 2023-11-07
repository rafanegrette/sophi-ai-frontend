import { EmptyObject } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
    name: string;
    email: string;
}

export const userApiSlice = createApi({
    reducerPath: 'apiUser',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_HOST}/api`,
        prepareHeaders(headers) {
            headers.set('Accept', 'application/json');
        },
        credentials: 'include'
    }),
    endpoints(builder) {
        return {
            fetchUser: builder.query<User, void> ({
                query() {
                    return `/user`;
                }
            })
        }
    }
});

export const { useFetchUserQuery } = userApiSlice;