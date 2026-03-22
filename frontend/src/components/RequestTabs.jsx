

function RequestTabs({ activeTab, setActiveTab, counts }) {
  const tabs = [
    { key: "pending", label: "Pending", color: "text-yellow-400" },
    { key: "accepted", label: "Accepted", color: "text-green-400" },
    { key: "rejected", label: "Rejected", color: "text-red-400" },
  ];

  return (
    <div className="flex border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex-1 py-3 text-sm font-medium transition-all
            ${
              activeTab === tab.key
                ? `${tab.color} border-b-2 border-current bg-gray-800`
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
        >
          {tab.label} ({counts[tab.key]})
        </button>
      ))}
    </div>
  );
}

export default RequestTabs;