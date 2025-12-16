import { useState } from "react";

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
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSetFile = (file: File) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndSetFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-800 mb-3">
        Video Input Method
      </label>

      {/* Method Selection Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setInputMethod("file")}
          className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all ${
            inputMethod === "file"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          Upload File
        </button>
        {/* <button
          type="button"
          onClick={() => setInputMethod("url")}
          className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all ${
            inputMethod === "url"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          Video URL
        </button> */}
      </div>

      {/* File Upload */}
      {inputMethod === "file" && (
        <div>
          <label className="block w-full">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                isDragging
                  ? "border-indigo-500 bg-gradient-to-br from-indigo-100 to-purple-100 scale-105 shadow-lg"
                  : "border-indigo-300 hover:border-indigo-500 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50"
              }`}
            >
              <input
                type="file"
                accept="video/*,.mp4,.mpeg,.mov,.avi,.webm,.mkv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-lg font-bold text-gray-800 mb-2">
                  <span className="text-indigo-600">Click to upload</span> or
                  drag and drop
                </p>
                <p className="text-sm text-gray-600">
                  MP4, MPEG, MOV, AVI, WebM, MKV (Max 500MB)
                </p>
              </div>
            </div>
          </label>
          {videoFile && (
            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl border-2 border-indigo-300 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-10 w-10 text-indigo-600"
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
                    <p className="font-semibold text-gray-900">
                      {videoFile.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(videoFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoFile(null)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-lg"
                >
                  <svg
                    className="h-6 w-6"
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
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Video URL
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://example.com/video.mp4"
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm"
          />
          <p className="mt-2 text-xs text-gray-600">
            Enter a direct link to a video file (HTTP/HTTPS)
          </p>
        </div>
      )}
    </div>
  );
}

export default VideoInput;
