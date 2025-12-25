// // components/CartDebug.tsx
// "use client"

// import { useContext, useEffect } from "react"
// import { CartContext } from "@/app/context/CartContext"

// export function CartDebug() {
//   const cart = useContext(CartContext)
  
//   useEffect(() => {
//     console.log("🛒 CART DEBUG 🛒")
//     console.log("Context exists:", !!cart)
//     console.log("Context value:", cart)
//     console.log("Cart items:", cart?.cartItems || [])
//     console.log("Is client:", typeof window !== 'undefined')
//     console.log("LocalStorage:", localStorage.getItem("ecommerce-cart-items"))
//     console.log("🛒 END DEBUG 🛒")
//   }, [cart])
  
//   return null
// }