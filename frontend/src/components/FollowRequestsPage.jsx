import { useState, useMemo } from "react";
import { useAuth } from "./context/AuthContext";
import Request from "./Request";
import RequestTabs from "./RequestTabs";
import EmptyState from "./EmptyState";
import { useQuery } from "@tanstack/react-query";
import {
  getFollowRequestsQueryOptions,
  getFollowingQueryOptions,
} from "../queryOptions/userQueryOptions";
import Spinner from "./Spinner";

function FollowRequestsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");

  const {
    data: requests,
    isLoading: isLoadingRequests,
    isError: isErrorRequests,
  } = useQuery(getFollowRequestsQueryOptions());

  const {
    data: following,
    isLoading: isLoadingFollowing,
    isError: isErrorFollowing,
  } = useQuery(getFollowingQueryOptions(user.id));

  // Combine and normalize
  const combined = useMemo(() => {
    return [
      ...(requests?.data || []),
      ...(following?.data || []).map((u) => ({
        ...u,
        status: "ACCEPTED",
      })),
    ];
  }, [requests, following]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      pending: combined.filter((u) => u.status === "PENDING").length,
      accepted: combined.filter((u) => u.status === "ACCEPTED").length,
      rejected: combined.filter((u) => u.status === "REJECTED").length,
    };
  }, [combined]);

  // Filter by tab
  const filtered = useMemo(() => {
    if (activeTab === "pending") {
      return combined.filter((u) => u.status === "PENDING");
    }
    if (activeTab === "accepted") {
      return combined.filter((u) => u.status === "ACCEPTED");
    }
    if (activeTab === "rejected") {
      return combined.filter((u) => u.status === "REJECTED");
    }
    return combined;
  }, [combined, activeTab]);

  if (isLoadingRequests || isLoadingFollowing) return <Spinner />;

  if (isErrorRequests || isErrorFollowing) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Something went wrong
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center px-6 pt-6 bg-gray-900 text-white overflow-auto">
      <h1 className="text-3xl font-bold mb-4">Follow Requests</h1>

      <div className="w-full max-w-2xl bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
        <RequestTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />

        <div className="flex flex-col divide-y divide-gray-700">
          {filtered.length === 0 ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            filtered.map((user) => (
              <Request
                key={`${user.id}-${user.status}`}
                sender={user}
                page={activeTab}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowRequestsPage;