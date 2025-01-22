import prismadb from '@/lib/prismadb';
import React from 'react'

interface DashboardPageProps{
  params: {storeId: string}
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
  params
}) => {
  const paramsAwaited = await params
  const store = await prismadb.store.findFirst({
    where: {
      id: paramsAwaited.storeId
    }
  });

  return (
    <div>
      Active Store: {store?.name};
    </div>
  )
}

export default DashboardPage;