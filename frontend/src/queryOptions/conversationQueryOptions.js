import {getConversations} from "../api/conversation";
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import toast from "react-hot-toast";


export function getConversationsQueryOptions() {
    return queryOptions({
        queryKey: ["conversations"],
        queryFn: () => getConversations(),
        onError: (err) => {
            toast.error("Error fetching conversations");
        }
    });
}
