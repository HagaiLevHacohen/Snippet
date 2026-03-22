import { useState } from 'react'
import ProfileHeader from './ProfileHeader';
import NewSnippetButton from './NewSnippetButton';
import { useQuery } from "@tanstack/react-query";
import { getUserQueryOptions } from '../queryOptions/userQueryOptions';
import Tabs from './Tabs';
import FeedList from './FeedList';
import { useParams } from 'react-router-dom';
import Spinner from './Spinner';

function Profile() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("posts");
  const { data, isLoading, error } = useQuery(getUserQueryOptions(username));

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading profile</div>;

  return (
    <div className='h-screen w-full flex flex-col items-center justify-start gap-4 px-32 pt-4 overflow-auto'>
        <ProfileHeader user={data.data} />
        <div className="w-7/10 min-w-75 bg-gray-800 border border-gray-700 rounded-t-md flex flex-col">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} page="profile" />
          <FeedList user={data.data} activeTab={activeTab} />
        </div>
        <NewSnippetButton />
    </div>
  )
}

export default Profile