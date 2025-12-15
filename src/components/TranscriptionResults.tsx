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
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Transcription Results
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => copyToClipboard(result.transcription)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Copy Text
          </button>
          <button
            onClick={() =>
              downloadAsText(result.transcription, "transcription.txt")
            }
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Download
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 mb-1">Duration</p>
          <p className="font-semibold text-gray-900">
            {formatTime(result.metadata.duration)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Language</p>
          <p className="font-semibold text-gray-900">
            {result.metadata.language || "Auto-detected"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Model</p>
          <p className="font-semibold text-gray-900 capitalize">
            {result.metadata.model}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Word Count</p>
          <p className="font-semibold text-gray-900">
            {result.metadata.wordCount.toLocaleString()}
          </p>
        </div>
        {result.metadata.processingTime && (
          <div className="col-span-2 md:col-span-4">
            <p className="text-xs text-gray-500 mb-1">Processing Time</p>
            <p className="font-semibold text-gray-900">
              {formatTime(result.metadata.processingTime)}
            </p>
          </div>
        )}
      </div>

      {/* Summary (if available) */}
      {result.metadata.summary && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {result.metadata.summary}
          </p>
        </div>
      )}

      {/* Chapters (if available) */}
      {result.metadata.chapters && result.metadata.chapters.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Chapters</h3>
          <div className="space-y-3">
            {result.metadata.chapters.map((chapter, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-indigo-600">
                    {formatTimestamp(chapter.start)} -{" "}
                    {formatTimestamp(chapter.end)}
                  </span>
                  {chapter.title && (
                    <span className="text-sm font-semibold text-gray-900">
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
          <h3 className="font-semibold text-gray-900 mb-4">
            Transcription with Timestamps
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {result.metadata.timestamps.map((segment, index) => (
              <div
                key={index}
                className="p-3 border-l-4 border-indigo-500 bg-gray-50 rounded"
              >
                <span className="text-xs font-medium text-indigo-600 mr-3">
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
        <h3 className="font-semibold text-gray-900 mb-4">Full Transcription</h3>
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {result.transcription}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TranscriptionResults;

