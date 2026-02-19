import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import ProductsList from '@/components/products-list';

async function ProductData() {
  const supabase = await createClient();
  const { data: products, error } = await supabase.from('products').select();

  if (error) {
    return <div>Failed to load products: {error.message}</div>;
  }

  return <ProductsList products={products} />;
}

export default async function page() {
  return (
    <Suspense>
      <ProductData />
    </Suspense>
  );
}
