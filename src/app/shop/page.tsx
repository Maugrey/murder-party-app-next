'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../../stores/globalStore';

export default function ShopPage() {
  const { t } = useTranslation();
  const isGameStarted = useGlobalStore((s) => s.isGameStarted);
  const router = useRouter();

  useEffect(() => {
    if (!isGameStarted) router.push('/');
  }, [isGameStarted, router]);

  if (!isGameStarted) {
    return <div className="text-center py-12 text-lg text-gray-500">{t('Common.notStarted')}</div>;
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">{t('Shop.title')}</h2>
      <div className="text-gray-400">{t('Common.todo')}</div>
    </div>
  );
}