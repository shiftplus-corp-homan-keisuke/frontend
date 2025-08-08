'use client';

import React from 'react';
import { Portfolio } from '@/components/artifacts/Portfolio';

interface PublicPortfolioPageProps {
  params: {
    userId: string;
  };
}

export default function PublicPortfolioPage({ params }: PublicPortfolioPageProps) {
  return (
    <Portfolio 
      userId={params.userId}
      isPublic={true}
      showHeader={true}
      theme="light"
    />
  );
}