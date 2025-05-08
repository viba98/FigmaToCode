import {
  Framework,
  LocalCodegenPreferenceOptions,
  PluginSettings,
  SelectPreferenceOptions,
} from "types";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import copy from "copy-to-clipboard";
import SelectableToggle from "./SelectableToggle";
import { Copy, Check } from "@phosphor-icons/react";

interface CodePanelProps {
  code: string;
  selectedFramework: Framework;
  settings: PluginSettings | null;
  preferenceOptions: LocalCodegenPreferenceOptions[];
  selectPreferenceOptions: SelectPreferenceOptions[];
  onPreferenceChanged: (key: string, value: boolean | string) => void;
}

const CodePanel = (props: CodePanelProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [syntaxHovered, setSyntaxHovered] = useState(false);
  const {
    code,
    preferenceOptions,
    selectPreferenceOptions,
    selectedFramework,
    settings,
    onPreferenceChanged,
  } = props;
  const isEmpty = code === "";

  // Add your clipboard function here or any other actions
  const handleButtonClick = () => {
    setIsPressed(true);
    setIsCopied(true);
    copy(code);
    
    // Reset pressed state
    setTimeout(() => setIsPressed(false), 250);
    // Reset copied state after 3 seconds
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleButtonHover = () => setSyntaxHovered(true);
  const handleButtonLeave = () => setSyntaxHovered(false);

  const selectableSettingsFiltered = selectPreferenceOptions.filter(
    (preference) =>
      preference.includedLanguages?.includes(props.selectedFramework),
  );

  return (
    <div className="w-full flex flex-col gap-2">
      <div 
        className="relative"
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}
      >
        {isEmpty ? (
          <h3>No layer is selected. Please select a layer.</h3>
        ) : (
          <>
            {/* Copy button overlay */}
            <div className={`absolute top-2 right-2 z-10 transition-opacity duration-200 ${
              syntaxHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                className={`px-3 py-1.5 text-sm font-semibold bg-neutral-800/80 backdrop-blur-sm text-white shadow-sm hover:bg-neutral-700/80 transition-all duration-300 inline-flex items-center gap-2 ${
                  isPressed ? "ring-2 ring-orange-500 ring-opacity-50" : ""
                }`}
                onClick={handleButtonClick}
              >
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Syntax highlighter */}
            <div className={`ring-orange-600 transition-all duration-300 ${
              syntaxHovered ? "ring-2" : "ring-0"
            }`}>
              <SyntaxHighlighter
                language="dart"
                style={theme}
                customStyle={{
                  fontSize: 12,
                  marginTop: 0,
                  marginBottom: 0,
                  backgroundColor: syntaxHovered ? "#1E2B1A" : "#1B1B1B",
                  transitionProperty: "all",
                  transitionTimingFunction: "ease",
                  transitionDuration: "0.2s",
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default CodePanel;
