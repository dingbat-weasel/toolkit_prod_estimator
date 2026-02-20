import type { Tables } from '@/database.types';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

// if product is provided: pre-fill form with values .update()
// if not then it is adding new product .insert()

type Props = {
  product: Tables<'products'>;
};

// handle possible null prop in prod-list
export default function ProductForm({ product }: Props) {
  const [pieceName, setPieceName] = useState(product?.piece_name ?? '');
  // look to handleLogin in LoginForm to see how to do the data calls
  // use state to handle form inputs, fill if product is passed
  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Product Rate</DialogTitle>
        <DialogDescription>
          Add or update the product piece rates, save when your finished.
        </DialogDescription>
      </DialogHeader>
      <FieldGroup>
        <Field>
          <Label>Product</Label>
          <Input id='product-1' name='product' />
        </Field>
        <Field>
          <Label>Piece-Rate</Label>
          <Input id='piece-rate-1' name='piece-rate' />
        </Field>
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button type='reset'>Cancel</Button>
        </DialogClose>
        <Button type='submit'>Save</Button>
      </DialogFooter>
    </>
  );
}
