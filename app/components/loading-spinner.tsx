export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
    </div>
  )
}
