import React from 'react';
import type { VideoOutput } from '../types';
import { SummaryIcon, TopicsIcon, TranscriptIcon } from './icons/ContentIcons';

interface StructuredVideoOutputProps {
  data: VideoOutput;
  t: Record<string, string>;
  outputRef: React.RefObject<HTMLDivElement>;
}

export const StructuredVideoOutput: React.FC<StructuredVideoOutputProps> = ({ data, t, outputRef }) => {

  const { summary, topics, transcript } = data;

  return (
    <div ref={outputRef} className="w-full h-full space-y-4 text-sm font-sans text-white/90">
      {/* Summary Section */}
      {summary && (
        <div className="bg-black/10 p-3 rounded-lg">
          <h4 className="font-bold text-base mb-2 flex items-center gap-2 text-white">
            <SummaryIcon />
            {t.output_summary}
          </h4>
          <p className="whitespace-pre-wrap text-white/90">{summary}</p>
        </div>
      )}

      {/* Topics Section */}
      {topics && topics.length > 0 && (
        <div className="bg-black/10 p-3 rounded-lg">
          <h4 className="font-bold text-base mb-2 flex items-center gap-2 text-white">
            <TopicsIcon />
            {t.output_topics}
          </h4>
          <ul className="list-disc list-inside space-y-1 rtl:list-outside rtl:mr-4 text-white/90">
            {topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Transcript Section */}
      {transcript && (
        <details className="bg-black/10 p-3 rounded-lg">
          <summary className="font-bold text-base cursor-pointer flex items-center gap-2 text-white">
            <TranscriptIcon />
            {t.output_transcript}
          </summary>
          <pre className="whitespace-pre-wrap mt-2 text-xs text-white/70">{transcript}</pre>
        </details>
      )}
    </div>
  );
};
