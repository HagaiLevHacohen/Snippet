import {getPost} from "../api/post";
import { queryOptions, mutationOptions } from "@tanstack/react-query";


export function getPostQueryOptions(postId) {
    return queryOptions({
        queryKey: ["post", postId],
        queryFn: () => getPost(postId)
    });
}
