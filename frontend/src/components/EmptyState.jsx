function EmptyState({ activeTab }) {
  return (
    <div className="p-6 text-center text-gray-400">
      <p className="text-lg mb-1">
        No {activeTab} users
      </p>
      <p className="text-sm text-gray-500">
        {activeTab === "pending" && "You're all caught up 🎉"}
        {activeTab === "accepted" && "No accepted connections yet"}
        {activeTab === "rejected" && "Nothing rejected"}
      </p>
    </div>
  );
}

export default EmptyState;