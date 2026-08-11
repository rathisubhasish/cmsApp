import { HiOutlineCube } from 'react-icons/hi2'

export default function Logo({ className = 'text-white' }) {
  return (
    <div className={`flex items-center gap-2 font-semibold text-lg ${className}`}>
      <HiOutlineCube className="h-6 w-6" />
      <span>Client</span>
    </div>
  )
}
