'use client';
import type { Tables } from '@/database.types';
import { Button } from './ui/button';
import { MoreHorizontalIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import ProductForm from './product-form';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Props = {
  products: Tables<'products'>[];
};

export default function ProductsList({ products }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Tables<'products'> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (item: Tables<'products'>) => {
    const supabase = createClient();
    setDeletingId(item.id);
    setError(null);

    try {
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();
      if (getUserError) throw getUserError;
      if (!user?.id) throw new Error('Not Authenticated');

      const userId = user?.id;

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', item.id)
        .eq('user_id', userId);

      if (error) throw error;
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
            setEditingProduct(null);
          }
        }}
      >
        <DialogContent showCloseButton={false}>
          <ProductForm
            key={editingProduct?.id}
            product={editingProduct}
            onSuccess={handleDialogClose}
          />
        </DialogContent>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className='text-center'>Piece-Rate</TableHead>
              <TableHead className='text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((item) => (
              <TableRow
                key={item.id}
                className={`${deletingId === item.id ? 'opacity-25 pointer-events-none' : ''} `}
              >
                <TableCell>{item.piece_name}</TableCell>
                <TableCell className='text-center'>{item.piece_rate}</TableCell>
                <TableCell className='text-center'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='size-8'>
                        <MoreHorizontalIcon />
                        <span className='sr-only'>Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingProduct(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className='text-destructive'
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='py-4'>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className='bg-accent-foreground w-full'
          >
            Add New Piece Rate
          </Button>
          {error && <p className='text-sm text-destructive'>{error}</p>}
        </div>
      </Dialog>
    </div>
  );
}
