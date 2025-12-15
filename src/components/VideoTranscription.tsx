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

const API_BASE_URL = "http://localhost:5000/api/video-to-text";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Video to Text Transcription
          </h1>
          <p className="text-gray-600">
            Convert your video audio to text with AI-powered transcription
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
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

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Processing..." : "Transcribe Video"}
              </button>
              {(result || error) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
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

