import { createClient } from '@/lib/supabase/server';
import { Suspense } from 'react';

async function OrderData() {
  const supabase = await createClient();
  const { data: orders } = await supabase.from('orders').select();

  return <pre>{JSON.stringify(orders, null, 2)}</pre>;
}

export default function Orders() {
  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <OrderData />
    </Suspense>
  );
}
