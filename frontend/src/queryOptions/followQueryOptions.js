import {getUserByUsername} from "../api/user";
import { queryOptions } from "@tanstack/react-query";
import toast from "react-hot-toast";


export function getFollowRequestsQueryOptions(senderId) {
    return queryOptions({
        queryKey: ["followRequests", senderId],
        queryFn: () => getFollowRequests(senderId),
        onError: (err) => {
            toast.error("Error fetching follow requests");
        }
    });
}
