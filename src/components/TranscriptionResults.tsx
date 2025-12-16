interface TranscriptionResultsProps {
  result: {
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
  };
}

function TranscriptionResults({ result }: TranscriptionResultsProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimestamp = (seconds: number) => {
    return formatTime(seconds);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadAsText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Transcription Results
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => copyToClipboard(result.transcription)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all border-2 border-gray-200 text-sm font-semibold shadow-sm"
          >
            Copy Text
          </button>
          <button
            onClick={() =>
              downloadAsText(result.transcription, "transcription.txt")
            }
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-semibold shadow-lg"
          >
            Download
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-xl border-2 border-indigo-200 shadow-md">
        <div>
          <p className="text-xs text-gray-600 mb-1 font-medium">Duration</p>
          <p className="font-bold text-gray-900">
            {formatTime(result.metadata.duration)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1 font-medium">Language</p>
          <p className="font-bold text-gray-900">
            {result.metadata.language || "Auto-detected"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1 font-medium">Model</p>
          <p className="font-bold text-gray-900 capitalize">
            {result.metadata.model}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1 font-medium">Word Count</p>
          <p className="font-bold text-gray-900">
            {result.metadata.wordCount.toLocaleString()}
          </p>
        </div>
        {result.metadata.processingTime && (
          <div className="col-span-2 md:col-span-4">
            <p className="text-xs text-gray-600 mb-1 font-medium">
              Processing Time
            </p>
            <p className="font-bold text-gray-900">
              {formatTime(result.metadata.processingTime)}
            </p>
          </div>
        )}
      </div>

      {/* Summary (if available) */}
      {result.metadata.summary && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-900 mb-2">Summary</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {result.metadata.summary}
          </p>
        </div>
      )}

      {/* Chapters (if available) */}
      {result.metadata.chapters && result.metadata.chapters.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Chapters</h3>
          <div className="space-y-3">
            {result.metadata.chapters.map((chapter, index) => (
              <div
                key={index}
                className="p-4 border-2 border-indigo-200 bg-white rounded-xl hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-indigo-600">
                    {formatTimestamp(chapter.start)} -{" "}
                    {formatTimestamp(chapter.end)}
                  </span>
                  {chapter.title && (
                    <span className="text-sm font-bold text-gray-900">
                      {chapter.title}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {chapter.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamps (if available) */}
      {result.metadata.timestamps && result.metadata.timestamps.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-4">
            Transcription with Timestamps
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {result.metadata.timestamps.map((segment, index) => (
              <div
                key={index}
                className="p-3 border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg"
              >
                <span className="text-xs font-semibold text-indigo-600 mr-3">
                  {formatTimestamp(segment.start)} -{" "}
                  {formatTimestamp(segment.end)}
                </span>
                <span className="text-gray-700">{segment.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Transcription */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Full Transcription</h3>
        <div className="p-6 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl border-2 border-indigo-100 shadow-sm">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {result.transcription}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TranscriptionResults;
