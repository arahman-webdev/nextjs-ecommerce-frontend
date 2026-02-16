import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/types/productType";

import Image from "next/image";


interface IProps {
  children: React.ReactNode
  onConfirm: () => Promise<void>;
  item: CartItem
}

export function ConfirmationAlert({ onConfirm, children, item }: IProps) {
  const handleConfirm = () => {
    onConfirm()
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="hover:bg-red-100 cursor-pointer">
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this item from cart?</AlertDialogTitle>
          <div className="flex gap-4">
            <Image src={item?.productImages?.[0]?.imageUrl} width={60} height={60} alt="product image" />
            <div>
              <h3>{item.name.slice(0, 20)}...</h3>
              <span>${item.price}</span>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}