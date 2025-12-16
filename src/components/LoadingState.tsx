function LoadingState() {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-indigo-100">
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-600 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Processing Video
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Your video is being transcribed. This may take a few minutes depending
          on the video length and model selected.
        </p>
        <div className="w-full max-w-md">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
        <p className="mt-6 text-sm text-gray-500 flex items-center gap-2">
          <svg
            className="w-4 h-4 animate-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          Please don't close this page...
        </p>
      </div>
    </div>
  );
}

export default LoadingState;
