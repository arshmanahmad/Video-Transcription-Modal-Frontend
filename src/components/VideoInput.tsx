interface VideoInputProps {
  inputMethod: "file" | "url";
  setInputMethod: (method: "file" | "url") => void;
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
}

const SUPPORTED_FORMATS = [".mp4", ".mpeg", ".mov", ".avi", ".webm", ".mkv"];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

function VideoInput({
  inputMethod,
  setInputMethod,
  videoFile,
  setVideoFile,
  videoUrl,
  setVideoUrl,
}: VideoInputProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert(
        `File size exceeds 500MB limit. Your file is ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      return;
    }

    // Check file extension
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!SUPPORTED_FORMATS.includes(extension)) {
      alert(
        `Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(
          ", "
        )}`
      );
      return;
    }

    setVideoFile(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Video Input Method
      </label>

      {/* Method Selection Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setInputMethod("file")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            inputMethod === "file"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setInputMethod("url")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            inputMethod === "url"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Video URL
        </button>
      </div>

      {/* File Upload */}
      {inputMethod === "file" && (
        <div>
          <label className="block w-full">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept="video/*,.mp4,.mpeg,.mov,.avi,.webm,.mkv"
                onChange={handleFileChange}
                className="hidden"
              />
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-3"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold text-indigo-600">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                MP4, MPEG, MOV, AVI, WebM, MKV (Max 500MB)
              </p>
            </div>
          </label>
          {videoFile && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-8 w-8 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">
                      {videoFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(videoFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoFile(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL Input */}
      {inputMethod === "url" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://example.com/video.mp4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
          <p className="mt-2 text-xs text-gray-500">
            Enter a direct link to a video file (HTTP/HTTPS)
          </p>
        </div>
      )}
    </div>
  );
}

export default VideoInput;

