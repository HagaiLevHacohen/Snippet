import {getUserByUsername} from "../api/user";
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { getFollowRequests, getFollowing, getFollowers } from "../api/user";
import toast from "react-hot-toast";


export function getUserQueryOptions(username) {
    return queryOptions({
        queryKey: ["user", username],
        queryFn: () => getUserByUsername({ username }),
        onError: (err) => {
            toast.error("Error fetching user data");
        }
    });
}


export function getFollowRequestsQueryOptions() {
    return queryOptions({
        queryKey: ["followRequests"],
        queryFn: () => getFollowRequests(),
        onError: (err) => {
            toast.error("Error fetching follow requests");
        },
    });
}


export function getFollowingQueryOptions(userId) {
    return queryOptions({
        queryKey: ["following", userId],
        queryFn: () => getFollowing(userId),
        onError: (err) => {
            toast.error("Error fetching following data");
        },
    });
}

export function getFollowersQueryOptions(userId) {
    return queryOptions({
        queryKey: ["followers", userId],
        queryFn: () => getFollowers(userId),
        onError: (err) => {
            toast.error("Error fetching followers data");
        },
    });
}
