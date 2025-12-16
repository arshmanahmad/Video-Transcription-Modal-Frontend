import { useState } from "react";
import VideoInput from "./VideoInput";
import ConversionSettings from "./ConversionSettings";
import TranscriptionResults from "./TranscriptionResults";
import LoadingState from "./LoadingState";
import ErrorDisplay from "./ErrorDisplay";

interface TranscriptionData {
  transcription: string;
  conversionType: string;
  metadata: {
    duration: number;
    language: string;
    model: string;
    wordCount: number;
    processingTime: number;
    timestamps?: Array<{ start: number; end: number; text: string }>;
    chapters?: Array<{
      start: number;
      end: number;
      title: string;
      text: string;
    }>;
    summary?: string;
  };
}

const API_BASE_URL = `${
  import.meta.env.VITE_BASE_URL ?? "http://localhost:3000"
}/api/video-to-text`;

function VideoTranscription() {
  const [inputMethod, setInputMethod] = useState<"file" | "url">("file");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [conversionType, setConversionType] = useState("full");
  const [language, setLanguage] = useState("");
  const [model, setModel] = useState("base");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranscriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validation
    if (inputMethod === "file" && !videoFile) {
      setError("Please select a video file");
      return;
    }
    if (inputMethod === "url" && !videoUrl.trim()) {
      setError("Please enter a video URL");
      return;
    }

    setIsLoading(true);

    try {
      let response: Response;

      if (inputMethod === "file") {
        const formData = new FormData();
        formData.append("video", videoFile!);
        formData.append("conversionType", conversionType);
        if (language) formData.append("language", language);
        formData.append("model", model);

        response = await fetch(API_BASE_URL, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoUrl: videoUrl.trim(),
            conversionType,
            language: language || undefined,
            model,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "An error occurred");
      }

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process video");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    setVideoUrl("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with icon */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mb-6 shadow-2xl">
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
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Video to Text Transcription
          </h1>
          <p className="text-xl font-semibold text-gray-800 max-w-2xl mx-auto">
            Transform your videos into accurate text transcriptions powered by
            AI
          </p>
        </div>

        {/* Main form card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 mb-8 border-2 border-indigo-100 animate-slide-up">
          <form onSubmit={handleSubmit}>
            <VideoInput
              inputMethod={inputMethod}
              setInputMethod={setInputMethod}
              videoFile={videoFile}
              setVideoFile={setVideoFile}
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
            />

            <ConversionSettings
              conversionType={conversionType}
              setConversionType={setConversionType}
              language={language}
              setLanguage={setLanguage}
              model={model}
              setModel={setModel}
            />

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Transcribe Video
                    </>
                  )}
                </span>
              </button>
              {(result || error) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 border-2 border-gray-200 shadow-sm"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {isLoading && <LoadingState />}

        {error && <ErrorDisplay error={error} />}

        {result && <TranscriptionResults result={result} />}
      </div>
    </div>
  );
}

export default VideoTranscription;
