import {getPost} from "../api/post";
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import toast from "react-hot-toast";


export function getPostQueryOptions(postId) {
    return queryOptions({
        queryKey: ["post", postId],
        queryFn: () => getPost(postId),
        onError: (err) => {
            toast.error("Error fetching post data");
        }
    });
}
