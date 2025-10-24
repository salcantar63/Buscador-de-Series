import React, { useState } from 'react';
import SearchInput from './components/SearchInput';
import SeriesInfoCard from './components/SeriesInfoCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import fetchSeriesInfo, { fetchActorInfo } from './services/geminiService';
import { SeriesInfo, GroundingChunk, ActorInfo } from './types';
import ActorModal from './components/ActorModal';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [seriesInfo, setSeriesInfo] = useState<SeriesInfo | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedActor, setSelectedActor] = useState<string | null>(null);
  const [actorInfo, setActorInfo] = useState<ActorInfo | null>(null);
  const [isActorLoading, setIsActorLoading] = useState<boolean>(false);
  const [actorError, setActorError] = useState<string | null>(null);


  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setError(null);
    setSeriesInfo(null);
    setSources([]);

    try {
      const { seriesInfo: info, sources: fetchedSources } = await fetchSeriesInfo(searchTerm);
      setSeriesInfo(info);
      setSources(fetchedSources);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActorClick = async (actorName: string) => {
    setSelectedActor(actorName);
    setIsActorLoading(true);
    setActorError(null);
    setActorInfo(null);
    try {
      const info = await fetchActorInfo(actorName);
      setActorInfo(info);
    } catch (err: any) {
      setActorError(err.message || 'No se pudo obtener la información del actor.');
    } finally {
      setIsActorLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedActor(null);
    setActorInfo(null);
    setActorError(null);
  };

  const handleSeriesSelect = (seriesName: string) => {
    handleCloseModal();
    setQuery(seriesName);
    handleSearch(seriesName);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Buscador de Series
            </h1>
          </div>
          <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
            Obtén información instantánea y actualizada de tus series favoritas, con el poder de Gemini.
          </p>
        </header>
        
        <div className="mb-8">
          <SearchInput 
            query={query} 
            setQuery={setQuery} 
            onSearch={() => handleSearch(query)} 
            isLoading={isLoading} 
          />
        </div>

        <div className="mt-8">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {seriesInfo && <SeriesInfoCard info={seriesInfo} sources={sources} onActorClick={handleActorClick} onSeriesSelect={handleSeriesSelect} />}
          {!isLoading && !error && !seriesInfo && (
            <div className="text-center text-gray-500">
              <p>¿Listo para encontrar tu próxima maratón?</p>
              <p>Ingresa el nombre de una serie arriba para comenzar.</p>
            </div>
          )}
        </div>

        {selectedActor && (
          <ActorModal
            actorName={selectedActor}
            actorInfo={actorInfo}
            isLoading={isActorLoading}
            error={actorError}
            onClose={handleCloseModal}
            onSeriesSelect={handleSeriesSelect}
          />
        )}
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Creado con React, Tailwind CSS y la API de Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;