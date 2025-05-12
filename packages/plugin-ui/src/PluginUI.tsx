import { useState } from "react";
import copy from "copy-to-clipboard";
import Preview from "./components/Preview";
import GradientsPanel from "./components/GradientsPanel";
import ColorsPanel from "./components/ColorsPanel";
import CodePanel from "./components/CodePanel";
import WarningIcon from "./components/WarningIcon";
import {
  Framework,
  HTMLPreview,
  LinearGradientConversion,
  PluginSettings,
  SolidColorConversion,
  Warning,
} from "types";
import {
  preferenceOptions,
  selectPreferenceOptions,
} from "./codegenPreferenceOptions";

type PluginUIProps = {
  code: string;
  htmlPreview: HTMLPreview;
  warnings: Warning[];
  selectedFramework: Framework;
  setSelectedFramework: (framework: Framework) => void;
  settings: PluginSettings | null;
  onPreferenceChanged: (key: string, value: boolean | string) => void;
  colors: SolidColorConversion[];
  gradients: LinearGradientConversion[];
};

const frameworks: Framework[] = ["Tailwind"];

export const PluginUI = (props: PluginUIProps) => {
  const isEmpty = props.code === "";

  const warnings = props.warnings ?? [];

  return (
    <div className="flex flex-col h-full dark:text-white">
      {/* <div className="p-2 grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 gap-1">
        {frameworks.map((tab) => (
          <button
            key={`tab ${tab}`}
            className={`w-full p-1 text-sm ${
              props.selectedFramework === tab
                ? "bg-orange-500 dark:bg-orange-600 text-white rounded-md font-semibold shadow-sm"
                : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border focus:border-0 border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-orange-600 dark:hover:bg-orange-800 dark:hover:border-orange-800 hover:text-white dark:hover:text-white font-semibold shadow-sm"
            }`}
            onClick={() => {
              props.setSelectedFramework(tab as Framework);
            }}
          >
            {tab}
          </button>
        ))}
      </div> */}
      <div
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.12)",
        }}
      ></div>
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="flex flex-row items-start gap-4 dark:bg-transparent">
          
          
          <div className="flex flex-col w-1/2 h-screen">
            <CodePanel
              code={props.code}
              selectedFramework={props.selectedFramework}
              preferenceOptions={preferenceOptions}
              selectPreferenceOptions={selectPreferenceOptions}
              settings={props.settings}
              onPreferenceChanged={props.onPreferenceChanged}
            />
            <button 
            onClick={() => window.open('https://not.fiddle.is', '_blank')} 
            className='bg-white/10 inline-block p-2 text-white tex-sm'>
              Open in Code Editor
              </button>
          </div>

          {isEmpty === false && props.htmlPreview && (
            <div className="flex flex-col w-1/2 justify-between h-full">
              <Preview htmlPreview={props.htmlPreview} />
              {/* {warnings.length > 0 && (
                <div className="flex flex-col bg-yellow-400 text-black  dark:bg-yellow-500 dark:text-black p-3 w-full rounded-md pt-2">
                  <div className="flex flex-row gap-1">
                    <div style={{ transform: "translate(2px, 0px) scale(80%)" }}>
                      <WarningIcon />
                    </div>
                    <h3 className="text-base font-bold">Warnings:</h3>
                  </div>
                  <ul className="list-disc pl-6">
                    {warnings.map((message: string) => (
                      <li className="list-item">
                        <em className="italic text-sm">{message}</em>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
              
            </div>
          )}
          {/* {props.colors.length > 0 && (
            <ColorsPanel
              colors={props.colors}
              onColorClick={(value) => {
                copy(value);
              }}
            />
          )}

          {props.gradients.length > 0 && (
            <GradientsPanel
              gradients={props.gradients}
              onColorClick={(value) => {
                copy(value);
              }}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};
