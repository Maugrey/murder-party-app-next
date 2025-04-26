'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../../stores/globalStore';
import { getDataLoader, DataResource } from '../../utils/dataLoader';
import { useDataLoaderMode } from '../../utils/dataLoaderContext';
import Select from '../../components/Select';
import Button from '../../components/Button';

// Adapter la structure Clue au format specs.md
interface Clue {
  id: number;
  location: string;
  npc: string;
  level: number;
  clue: string;
  start_phase: number;
  end_phase: number;
  condition: string;
}

export default function InterrogatePage() {
  const { t } = useTranslation();
  const isGameStarted = useGlobalStore((s) => s.isGameStarted);
  const currentPhase = useGlobalStore((s) => s.currentPhase);
  const conditions = useGlobalStore((s) => s.conditions);
  const cluesViewed = useGlobalStore((s) => s.cluesViewed);
  const setCluesViewed = useGlobalStore((s) => s.setCluesViewed);
  const router = useRouter();
  const [clues, setClues] = useState<Clue[]>([]);

  const dataLoaderMode = useDataLoaderMode();
  const cluesDataLoader = useMemo(() => getDataLoader<Clue[]>(dataLoaderMode), [dataLoaderMode]);

  useEffect(() => {
    if (!isGameStarted) router.push('/');
  }, [isGameStarted, router]);

  useEffect(() => {
    cluesDataLoader.load(DataResource.INTERROGATION).then(setClues);
  }, [cluesDataLoader]);

  // Liste des lieux disponibles pour la phase courante
  const locations = Array.from(new Set(
    clues.filter(c =>
      (!c.start_phase || c.start_phase <= currentPhase) &&
      (!c.end_phase || c.end_phase >= currentPhase)
    ).map(c => c.location)
  ));
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedNpc, setSelectedNpc] = useState<string>('');
  const [showClue, setShowClue] = useState(false);
  const [clueText, setClueText] = useState('');
  const [alreadySeen, setAlreadySeen] = useState(false);

  // Liste des PNJ disponibles pour le lieu et la phase/condition
  const npcs = Array.from(new Set(
    clues.filter((c) =>
      c.location === selectedLocation &&
      (!c.start_phase || c.start_phase <= currentPhase) &&
      (!c.end_phase || c.end_phase >= currentPhase) &&
      (!c.condition || (() => {
        const [condKey, condVal] = c.condition.split('=');
        if (!condKey) return true;
        return conditions[condKey] === (condVal === '1');
      })())
    ).map((c) => c.npc)
  ));

  // Calcul du niveau max pour ce couple lieu/PNJ
  const maxLevel = Math.max(
    ...clues.filter((c) => c.location === selectedLocation && c.npc === selectedNpc).map((c) => c.level),
    1
  );

  useEffect(() => {
  setShowClue(false);
  setClueText('');
  setAlreadySeen(false);
  if (selectedLocation && selectedNpc) {
    // Check if all levels have been seen
    let allSeen = true;
    for (let lvl = 1; lvl <= maxLevel; lvl++) {
      const key = `${selectedLocation}|${selectedNpc}|${lvl}`;
      if (!cluesViewed[key]) allSeen = false;
    }
    setAlreadySeen(allSeen);
  }
}, [selectedLocation, selectedNpc, maxLevel]);

  // Affichage de l'indice selon le prochain niveau non vu
  const handleInterrogate = () => {
    // Find next unseen level
    let levelToShow = 1;
    for (let lvl = 1; lvl <= maxLevel; lvl++) {
      const key = `${selectedLocation}|${selectedNpc}|${lvl}`;
      if (!cluesViewed[key]) {
        levelToShow = lvl;
        break;
      }
      if (lvl === maxLevel) levelToShow = maxLevel;
    }
    
    const clue = clues.find(
      (c) => c.location === selectedLocation && c.npc === selectedNpc && c.level === levelToShow
    );
    
    if (!clue) {
      setClueText(t('Interrogate.noClue'));
    } else {
      setClueText(clue.clue);
    }
    
    setShowClue(true);
    // Marquer comme vu
    const key = `${selectedLocation}|${selectedNpc}|${levelToShow}`;
    setCluesViewed({ ...cluesViewed, [key]: true });
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">{t('Interrogate.title')}</h2>
      <div className="flex flex-col gap-4 mb-6">
        <Select
          options={locations.map(loc => ({ value: loc, label: loc }))}
          placeholder={t('Interrogate.selectLocation')}
          value={selectedLocation}
          onChange={e => { setSelectedLocation(e.target.value); setSelectedNpc(''); }}
          title={t('Interrogate.selectLocation')}
        />
        <Select
          options={npcs.map(npc => ({ value: npc, label: npc }))}
          placeholder={t('Interrogate.selectNpc')}
          value={selectedNpc}
          onChange={e => setSelectedNpc(e.target.value)}
          disabled={!selectedLocation}
          title={t('Interrogate.selectNpc')}
        />
        <Button
          disabled={!selectedLocation || !selectedNpc}
          onClick={handleInterrogate}
        >
          {t('Interrogate.interrogateButton')}
        </Button>
        {alreadySeen && (
          <div className="text-yellow-600 text-sm">{t('Interrogate.alreadySeen')}</div>
        )}
      </div>
      
      {showClue && (
        <div className="bg-gray-100 rounded p-4 shadow text-center text-lg mt-4">
          {clueText}
        </div>
      )}
    </div>
  );
}