import { useState } from 'react'
import { useAuth } from "./context/AuthContext";
import NewSnippetButton from './NewSnippetButton';
import Tabs from './Tabs';
import FeedList from './FeedList';

function Feed() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("recent");

  return (
    <div className='h-screen w-full flex flex-col items-center justify-start py-8 px-2 gap-4 md:px-32 md:pt-4 overflow-auto'>
        <div className="xl:w-7/10 xl:min-w-75 bg-gray-800 border border-gray-700 rounded-t-md flex flex-col">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <FeedList user={user} activeTab={activeTab} page="feed" />
        </div>
        <NewSnippetButton />
    </div>
  )
}

export default Feed