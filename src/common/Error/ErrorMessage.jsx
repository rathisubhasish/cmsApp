export default function ErrorMessage({ message, variant = 'text' }) {
  if (!message) return null

  if (variant === 'background') {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
        {message}
      </div>
    )
  }

  return <p className="text-sm text-red-600">{message}</p>
}
