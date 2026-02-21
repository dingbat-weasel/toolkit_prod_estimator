import type { Tables } from '@/database.types';

import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Props = {
  product: Tables<'products'> | null;
  onSuccess: () => void;
};

export default function ProductForm({ product, onSuccess }: Props) {
  const [pieceName, setPieceName] = useState(product?.piece_name ?? '');
  const [pieceRate, setPieceRate] = useState(String(product?.piece_rate ?? ''));

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();
      if (getUserError) throw getUserError;
      if (!user?.id) throw new Error('Not Authenticated');

      const userId = user?.id;

      const parsedPieceRate = parseFloat(pieceRate);
      if (isNaN(parsedPieceRate)) {
        throw new Error('Piece-rate must be a valid number.');
      }

      if (product) {
        const { error: updateProductError } = await supabase
          .from('products')
          .update({
            piece_name: pieceName,
            piece_rate: parsedPieceRate,
          })
          .eq('id', product.id)
          .match({ user_id: userId });

        if (updateProductError) throw updateProductError;
      } else {
        const { error: insertProductError } = await supabase
          .from('products')
          .insert({
            piece_name: pieceName,
            piece_rate: parsedPieceRate,
            user_id: userId,
          });
        if (insertProductError) throw insertProductError;
      }
      router.refresh();
      onSuccess();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader className='pb-4'>
        <DialogTitle>{product ? 'Edit' : 'Add'} Piece Rate</DialogTitle>
        <DialogDescription>
          {product
            ? 'Editing these fields will update the piece rate record'
            : 'Adding a piece rate will make it available as an option when submitting a new order.'}
        </DialogDescription>
      </DialogHeader>
      <FieldGroup>
        <Field>
          <Label>Product</Label>
          <Input
            id='product-1'
            name='product'
            value={pieceName}
            onChange={(e) => setPieceName(e.target.value)}
            maxLength={50}
            required
          />
        </Field>
        <Field>
          <Label>Piece-Rate</Label>
          <Input
            id='piece-rate-1'
            name='piece-rate'
            value={pieceRate}
            type='number'
            step={'0.01'}
            onChange={(e) => setPieceRate(e.target.value)}
            required
          />
        </Field>
      </FieldGroup>
      <DialogFooter className='py-4'>
        <DialogClose asChild>
          <Button type='reset'>Cancel</Button>
        </DialogClose>
        {error && <p className='text-destructive text-sm'>{error}</p>}
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Saving' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
}
