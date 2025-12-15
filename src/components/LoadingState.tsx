function LoadingState() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-gray-900">
          Processing Video
        </h3>
        <p className="mt-2 text-gray-600 text-center max-w-md">
          Your video is being transcribed. This may take a few minutes depending
          on the video length and model selected.
        </p>
        <div className="mt-6 w-full max-w-md">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Please don't close this page...
        </p>
      </div>
    </div>
  );
}

export default LoadingState;

