import { useState } from "react";
import SearchBar from "./SearchBar";
import ToggleSwitch from "./ToggleSwitch";
import FeedList from "./FeedList";

function Search() {
  const [search, setSearch] = useState("");
  const [toggle, setToggle] = useState(false); // false = Users, true = Posts

  return (
    <div className="h-screen w-full flex flex-col items-center justify-start gap-4 px-32 pt-4 overflow-auto">
      <div className="w-full max-w-2xl flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-lg p-2">
        <SearchBar value={search} onChange={setSearch} />
        <ToggleSwitch value={toggle} onChange={setToggle} options={["Users", "Posts"]} />
      </div>
      <div className="w-7/10 min-w-75 bg-gray-800 border border-gray-700 rounded-t-md">
        <FeedList activeTab={toggle ? "searchPosts" : "searchUsers"} search={search}/>
      </div>
    </div>
  );
}

export default Search;