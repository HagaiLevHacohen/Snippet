import { useState } from 'react'
import ProfileHeader from './ProfileHeader';
import NewSnippetButton from './NewSnippetButton';
import Tabs from './Tabs';
import FeedList from './FeedList';

function Profile() {
  const [count, setCount] = useState(0)

  return (
    <div className='h-full w-full flex flex-col items-center justify-start gap-4 px-32 py-4'>
        <ProfileHeader />
        <div className="border-t border-gray-800">
          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <FeedList activeTab={activeTab} />
        </div>
        <NewSnippetButton />
    </div>
  )
}

export default Profile