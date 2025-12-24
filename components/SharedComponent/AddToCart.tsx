"use client"

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"


import { Link } from "@tanstack/react-router"
import { CartContextType } from "@/types/productType"
import { CartContext } from "@/app/context/CartContext"
import { Spinner } from "./Spinner"

export function AddToCart({
  onclick,
  isSpinner,
}: {
  onclick: () => Promise<void> | void
  isSpinner: boolean
}) {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext) as CartContextType
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  
  const handleClick = async () => {
    await onclick()
    setIsOpen(true) 
  }

  const handleQuantityChange = async (id: number, delta: number) => {
    setIsUpdating(id)
    await new Promise((resolve)=> setTimeout(resolve, 700))
    updateQuantity(id, delta)
    setIsUpdating(null)
  }

  const handleRemove = async(id: number) => {
    setIsUpdating(id)
    await new Promise((resolve)=> setTimeout(resolve, 700))
    removeFromCart(id)
    setIsUpdating(null)
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  console.log("From add to cart", cartItems)

  return (
    <>
      {/* 🛒 Add to Cart Button */}
      <Button onClick={handleClick} disabled={isSpinner}>
        {isSpinner ? <Spinner className="h-4 w-4" /> : "Add to Cart"}
      </Button>

      {/* 🧾 Cart Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold leading-16">
              Shopping Cart
            </SheetTitle>
          </SheetHeader>

          <div className="grid flex-1 gap-6 px-4 overflow-auto">
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">
                  Your cart is empty
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center bg-white p-4 rounded-lg shadow-sm"
                  >
                    <img
                      src={item?.productImages[0].imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-contain rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <h2 className="font-semibold text-lg">{item.name}</h2>
                      <p className="text-gray-500">৳ {item.price}</p>

                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="px-2 py-1 border rounded disabled:opacity-50"
                        disabled={isUpdating === item.id}
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="px-2 py-1 border rounded disabled:opacity-50"
                          disabled={isUpdating === item.id}
                        >
                          +
                        </button>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="ml-4 text-red-500 hover:underline"
                          disabled={isUpdating === item.id}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <SheetFooter className="bg-[#FAFAFA]">
            <div className="flex justify-between items-center w-full mb-4">
              <p className="font-medium">Sub Total:</p>
              <span className="font-semibold">৳ {totalPrice}</span>
            </div>
            <Link
              className="w-full flex items-center justify-center bg-gray-900"
              to="/"
            >
              <Button className="w-full">View Cart</Button>
            </Link>
            <Button variant="outline" className="border-none">
              Checkout
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}