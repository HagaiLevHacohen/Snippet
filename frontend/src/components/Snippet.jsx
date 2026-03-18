import { useState } from 'react'

function Snippet({item}) {
  const [count, setCount] = useState(0)

  return (
        <div>
            <p>{item.content}</p>
        </div>  
  )
}

export default Snippet