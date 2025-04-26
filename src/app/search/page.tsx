'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../../stores/globalStore';
import { getDataLoader, DataResource } from '../../utils/dataLoader';
import { useDataLoaderMode } from '../../utils/dataLoaderContext';
import Select from '../../components/Select';
import Button from '../../components/Button';

// Interface pour les données d'indices de recherche selon les specs
interface SearchClue {
  id: number;
  location: string;
  place: string;
  clue: string;
  type: 'object' | 'observation';
  start_phase: number;
  end_phase: number;
  condition: string;
}

export default function SearchPage() {
  const { t } = useTranslation();
  const isGameStarted = useGlobalStore((s) => s.isGameStarted);
  const currentPhase = useGlobalStore((s) => s.currentPhase);
  const conditions = useGlobalStore((s) => s.conditions);
  const itemsTaken = useGlobalStore((s) => s.itemsTaken);
  const setItemsTaken = useGlobalStore((s) => s.setItemsTaken);
  const router = useRouter();

  useEffect(() => {
    if (!isGameStarted) router.push('/');
  }, [isGameStarted, router]);

  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<string>('');
  const [showClue, setShowClue] = useState(false);
  const [clueText, setClueText] = useState('');
  const [clueType, setClueType] = useState<'object' | 'observation' | ''>('');
  const [itemTaken, setItemTaken] = useState(false);
  const [clues, setClues] = useState<SearchClue[]>([]);

  const dataLoaderMode = useDataLoaderMode();
  const searchCluesDataLoader = useMemo(() => getDataLoader<SearchClue[]>(dataLoaderMode), [dataLoaderMode]);

  useEffect(() => {
    searchCluesDataLoader.load(DataResource.SEARCH).then(setClues);
  }, [searchCluesDataLoader]);

  const locations = Array.from(new Set(
    clues.filter(c => 
      (!c.start_phase || c.start_phase <= currentPhase) &&
      (!c.end_phase || c.end_phase >= currentPhase) &&
      (!c.condition || (() => {
        const [condKey, condVal] = c.condition.split('=');
        if (!condKey) return true;
        return conditions[condKey] === (condVal === '1');
      })())
    ).map(c => c.location)
  ));

  const places = Array.from(new Set(
    clues.filter(c => 
      c.location === selectedLocation &&
      (!c.start_phase || c.start_phase <= currentPhase) &&
      (!c.end_phase || c.end_phase >= currentPhase) &&
      (!c.condition || (() => {
        const [condKey, condVal] = c.condition.split('=');
        if (!condKey) return true;
        return conditions[condKey] === (condVal === '1');
      })())
    ).map(c => c.place)
  ));

  useEffect(() => {
    setShowClue(false);
    setClueText('');
    setClueType('');
    setItemTaken(false);
    if (selectedLocation && selectedPlace) {
      const key = `${selectedLocation}|${selectedPlace}`;
      if (itemsTaken[key]) {
        setItemTaken(true);
      }
    }
  }, [selectedLocation, selectedPlace, itemsTaken]);

  const handleSearch = () => {
    if (itemTaken) {
      setClueText(t('Search.itemAlreadyTaken'));
      setShowClue(true);
      return;
    }
    const clue = clues.find(
      c => c.location === selectedLocation && c.place === selectedPlace
    );
    if (!clue) {
      setClueText(t('Search.noClue'));
      setClueType('');
    } else {
      setClueText(clue.clue);
      setClueType(clue.type);
    }
    setShowClue(true);
  };

  const handleKeepItem = () => {
    const key = `${selectedLocation}|${selectedPlace}`;
    setItemsTaken({ ...itemsTaken, [key]: true });
    setItemTaken(true);
    setClueText(t('Search.itemKept'));
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">{t('Search.title')}</h2>
      <div className="flex flex-col gap-4 mb-6">
        <Select
          options={locations.map(loc => ({ value: loc, label: loc }))}
          placeholder={t('Search.selectLocation')}
          value={selectedLocation}
          onChange={e => {
            setSelectedLocation(e.target.value);
            setSelectedPlace('');
          }}
          title={t('Search.selectLocation')}
        />
        <Select
          options={places.map(place => ({ value: place, label: place }))}
          placeholder={t('Search.selectPlace')}
          value={selectedPlace}
          onChange={e => setSelectedPlace(e.target.value)}
          disabled={!selectedLocation}
          title={t('Search.selectPlace')}
        />
        <Button
          disabled={!selectedLocation || !selectedPlace}
          onClick={handleSearch}
        >
          {t('Search.searchButton')}
        </Button>
      </div>
      {showClue && (
        <div className="bg-gray-100 rounded p-4 shadow text-center text-lg mt-4">
          <p>{clueText}</p>
          {clueType === 'object' && !itemTaken && (
            <Button
              variant="success"
              className="mt-4"
              onClick={handleKeepItem}
            >
              {t('Search.keepItemButton')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}