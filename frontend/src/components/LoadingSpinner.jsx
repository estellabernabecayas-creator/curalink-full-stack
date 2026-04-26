export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
      <div className="relative">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-gray-200 dark:border-slate-700"></div>
        <div className="absolute top-0 left-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-transparent border-t-blue-500 border-r-green-500 animate-spin"></div>
      </div>
    </div>
  );
}
