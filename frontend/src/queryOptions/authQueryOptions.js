import {getCurrentUser} from "../api/auth";
import { queryOptions, mutationOptions } from "@tanstack/react-query";


export function getCurrentUserQueryOptions(token) {
    return queryOptions({
        queryKey: ["auth", token],
        queryFn: () => getCurrentUser(),
        enabled: !!token, // only fetch if token exists
        retry: false,
    });
}
