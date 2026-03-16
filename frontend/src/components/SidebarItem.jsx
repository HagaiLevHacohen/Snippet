import {Link} from 'react-router-dom';


function SidebarItem({ title, icon, to, selected = false, onClick}) {

  return (
    <Link to={to} className={`flex items-center gap-3 p-3 rounded-lg transition ${selected ? 'bg-indigo-600 border-l-6 border-blue-400' : 'hover:bg-gray-600 hover:-translate-x-4'}`} onClick={onClick}>
      <img src={icon} alt={title} className='w-5 h-5' />
      <span>{title}</span>
    </Link>
  )
}

export default SidebarItem