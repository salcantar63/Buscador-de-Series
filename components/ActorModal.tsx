import React from 'react';
import { ActorInfo } from '../types';

interface ActorModalProps {
  actorName: string;
  actorInfo: ActorInfo | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onSeriesSelect: (seriesName: string) => void;
}

const ActorModal: React.FC<ActorModalProps> = ({ actorName, actorInfo, isLoading, error, onClose, onSeriesSelect }) => {
  const placeholderImg = 'https://placehold.co/256x256/4a5568/a0aec0?text=Foto%0ANo+Disponible';

  // Simplified logic: trust the URL and let onError handle failures.
  const photoUrl = actorInfo?.photo_url || placeholderImg;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto text-white overflow-hidden transform transition-all duration-300 ease-in-out scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold text-center mb-4">{actorName}</h2>
          
          {isLoading && (
             <div className="flex flex-col items-center justify-center p-8">
                <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-300">Buscando información...</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {actorInfo && (
            <div className="flex flex-col items-center">
              <img 
                src={photoUrl} 
                alt={`Foto de ${actorName}`} 
                className="w-48 h-48 object-cover rounded-full border-4 border-gray-700 shadow-lg mb-4"
                onError={(e) => { 
                  console.error('Error al cargar la foto del actor:', e.currentTarget.src);
                  e.currentTarget.onerror = null; 
                  e.currentTarget.src = placeholderImg; 
                }}
              />
              {actorInfo.other_series && actorInfo.other_series.length > 0 && (
                <div className="w-full mt-4">
                  <h3 className="font-semibold text-lg text-gray-300 mb-2 text-center">Otras series notables:</h3>
                  <ul className="list-inside bg-gray-900/50 p-4 rounded-lg max-h-48 overflow-y-auto space-y-2">
                    {actorInfo.other_series.map((series, index) => (
                       <li key={index}>
                        <button 
                          onClick={() => onSeriesSelect(series)}
                          className="w-full text-left text-blue-400 hover:text-blue-300 hover:underline transition-colors p-1 rounded"
                        >
                          {series}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActorModal;