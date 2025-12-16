interface ConversionSettingsProps {
  conversionType: string;
  setConversionType: (type: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  model: string;
  setModel: (model: string) => void;
}

const CONVERSION_TYPES = [
  {
    value: "full",
    label: "Full Transcription",
    description: "Complete word-for-word transcription",
  },
  {
    value: "summary",
    label: "Summary",
    description: "Condensed version of transcription",
  },
  {
    value: "chapters",
    label: "Chapters",
    description: "Organized into 5-minute chapters",
  },
  {
    value: "timestamps",
    label: "Timestamps",
    description: "Transcription with timestamp markers",
  },
];

const LANGUAGES = [
  { value: "", label: "Auto-detect" },
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "nl", label: "Dutch" },
  { value: "pl", label: "Polish" },
];

const MODELS = [
  {
    value: "tiny",
    label: "Tiny",
    description: "Fastest, Basic accuracy (39MB)",
  },
  {
    value: "base",
    label: "Base",
    description: "Fast, Good accuracy (74MB) - Default",
  },
  {
    value: "small",
    label: "Small",
    description: "Medium speed, Better accuracy (244MB)",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Slow, High accuracy (769MB)",
  },
  {
    value: "large",
    label: "Large",
    description: "Slowest, Best accuracy (1550MB)",
  },
];

function ConversionSettings({
  conversionType,
  setConversionType,
  language,
  setLanguage,
  model,
  setModel,
}: ConversionSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Conversion Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Conversion Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CONVERSION_TYPES.map((type) => (
            <label
              key={type.value}
              className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                conversionType === type.value
                  ? "border-indigo-500 bg-gradient-to-br from-indigo-100 to-purple-100 shadow-lg"
                  : "border-gray-200 bg-white hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50"
              }`}
            >
              <input
                type="radio"
                name="conversionType"
                value={type.value}
                checked={conversionType === type.value}
                onChange={(e) => setConversionType(e.target.value)}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="ml-3 flex-1">
                <div className="font-semibold text-gray-900">{type.label}</div>
                <div className="text-sm text-gray-600">{type.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Language and Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm hover:border-indigo-300"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-600">
            Leave as "Auto-detect" for automatic language detection
          </p>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Whisper Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm hover:border-indigo-300"
          >
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label} - {m.description}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-600">
            Larger models = better accuracy but slower processing
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConversionSettings;
