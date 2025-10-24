
import React from 'react';
import { GroundingChunk } from '../types';

interface SourceListProps {
  sources: GroundingChunk[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <h3 className="text-md font-semibold text-gray-700 mb-2">Fuentes:</h3>
      <ul className="list-disc list-inside space-y-1">
        {sources.map((source, index) => (
          source.web && (
            <li key={index}>
              <a
                href={source.web.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm truncate"
                title={source.web.title}
              >
                {source.web.title || new URL(source.web.uri).hostname}
              </a>
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default SourceList;
