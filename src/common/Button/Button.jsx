export default function Button({ children, className = '', loading = false, disabled, ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={`w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
