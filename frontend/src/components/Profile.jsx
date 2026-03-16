import { useState } from 'react'
import ProfileHeader from './ProfileHeader';
import NewSnippetButton from './NewSnippetButton';

function Profile() {
  const [count, setCount] = useState(0)

  return (
    <div className='h-full w-full flex flex-col items-center justify-start gap-4 px-32 py-4'>
        <ProfileHeader />
        <NewSnippetButton />
    </div>
  )
}

export default Profile