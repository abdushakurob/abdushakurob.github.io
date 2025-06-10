export default function Loading() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="text-lg text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
