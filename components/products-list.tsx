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

type Props = {
  products: Tables<'products'>[];
};

export default function ProductsList({ products }: Props) {
  const [editingProduct, setEditingProduct] =
    useState<Tables<'products'> | null>(null);

  return (
    <div>
      <Dialog
        open={editingProduct !== null}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null);
        }}
      >
        <form>
          <DialogContent>
            <ProductForm key={editingProduct?.id} product={editingProduct} />
          </DialogContent>
        </form>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Piece-Rate</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((item) => (
            <TableRow key={item.id}>
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
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='text-destructive'>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
