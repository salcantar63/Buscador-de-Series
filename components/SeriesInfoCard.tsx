import React from 'react';
import { SeriesInfo, GroundingChunk } from '../types';
import SourceList from './SourceList';

interface SeriesInfoCardProps {
  info: SeriesInfo;
  sources: GroundingChunk[];
  onActorClick: (actorName: string) => void;
  onSeriesSelect: (seriesName: string) => void;
}

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 w-6 h-6 text-gray-500 mt-1">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        <div className="text-md text-gray-800">{value}</div>
      </div>
    </div>
  );
};

const SeriesInfoCard: React.FC<SeriesInfoCardProps> = ({ info, sources, onActorClick, onSeriesSelect }) => {

  const placeholderImg = 'https://placehold.co/500x750/2d3748/e2e8f0?text=P%C3%B3ster%0ANo+Disponible';
  
  // Simplified logic: trust the URL and let onError handle failures.
  const posterUrl = info.poster_url || placeholderImg;

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full mx-auto my-8 transition-all duration-500 ease-in-out transform hover:scale-105">
      <div className="md:flex">
        <div className="md:w-64 md:flex-shrink-0 bg-gray-800/10 p-4">
          <img 
            className="rounded-lg shadow-lg w-full h-auto" 
            src={posterUrl} 
            alt={`Poster de ${info.title_es || info.title_en}`} 
            onError={(e) => { 
              console.error('Error al cargar el póster de la serie:', e.currentTarget.src);
              e.currentTarget.onerror = null; 
              e.currentTarget.src = placeholderImg; 
            }}
          />
        </div>
        <div className="p-8 flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{info.title_es || info.title_en}</h1>
          {info.title_es && info.title_en && info.title_es !== info.title_en && <h2 className="text-xl text-gray-600 font-medium mt-1">{info.title_en}</h2>}
          
          {info.description && <p className="mt-4 text-gray-700 text-base">{info.description}</p>}
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-3.355a.562.562 0 0 0-.652 0l-4.725 3.355a.562.562 0 0 1-.84-.61l1.285-5.385a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>}
              label="Calificación IMDB"
              value={info.imdb_rating}
            />
            <InfoItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>}
              label="Fecha de Estreno Original"
              value={info.original_air_date}
            />
             <InfoItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m-3.75-3.75v3.75m-3.75-3.75v3.75m9-15c-1.018 0-1.875.857-1.875 1.912v2.362c0 1.056.857 1.913 1.875 1.913h1.125c1.018 0 1.875-.857 1.875-1.913v-2.362c0-1.055-.857-1.912-1.875-1.912h-1.125ZM3 14.25v-2.625c0-1.055.857-1.912 1.875-1.912h1.125c1.018 0 1.875.857 1.875 1.912v2.625c0 1.056-.857 1.913-1.875 1.913H4.875c-1.018 0-1.875-.857-1.875-1.913Zm12 0v-2.625c0-1.055.857-1.912 1.875-1.912h1.125c1.018 0 1.875.857 1.875 1.912v2.625c0 1.056-.857 1.913-1.875 1.913h-1.125c-1.018 0-1.875-.857-1.875-1.913Z" /></svg>}
              label="Plataforma Original"
              value={info.original_platform}
            />
            <InfoItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" /></svg>}
              label="Disponible Actualmente En"
              value={
                <div className="flex items-center gap-2 flex-wrap">
                  <span>{info.current_platform}</span>
                  {info.is_airing && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      En Emisión
                    </span>
                  )}
                </div>
              }
            />
            {info.title_mx && (
              <InfoItem 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>}
                label="Título en México"
                value={info.title_mx}
              />
            )}
          </div>
          
          {info.seasons && info.seasons.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Temporadas y Episodios</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-4 font-semibold text-gray-500 px-3 py-1">
                  <span>Temporada</span>
                  <span className="text-center">Episodios</span>
                  <span className="text-right">Fecha de Estreno</span>
                </div>
                <div className="border-t border-gray-200"></div>
                {info.seasons.map((season) => (
                  <div key={season.season} className="grid grid-cols-3 gap-4 items-center bg-gray-100/50 p-3 rounded-lg hover:bg-gray-200/60 transition-colors">
                    <span className="font-semibold text-gray-800">Temporada {season.season}</span>
                    <span className="text-gray-700 text-center">{season.episodes}</span>
                    <span className="text-gray-700 text-right">{season.air_date || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {info.cast && info.cast.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Elenco Principal</h3>
              <div className="max-h-40 overflow-y-auto pr-2 space-y-2 text-sm">
                {info.cast.map((member, index) => (
                  <div key={index} className="flex items-center bg-gray-100/50 p-2 rounded-md">
                    <button onClick={() => onActorClick(member.name)} className="font-semibold text-blue-600 hover:underline text-left transition-colors">
                      {member.name}
                    </button>
                    <div className="text-gray-600 ml-auto pl-2 text-right">como {member.character}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {info.similar_series && info.similar_series.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Series Similares que Podrían Gustarte</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {info.similar_series.map((series, index) => (
                  <div key={index} className="bg-gray-100/50 p-4 rounded-lg">
                    <button 
                      onClick={() => onSeriesSelect(series.title)}
                      className="font-bold text-blue-600 hover:underline text-left transition-colors w-full"
                    >
                      {series.title}
                    </button>
                    <p className="text-sm text-gray-600 mt-1">{series.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SourceList sources={sources} />
        </div>
      </div>
    </div>
  );
};

export default SeriesInfoCard;