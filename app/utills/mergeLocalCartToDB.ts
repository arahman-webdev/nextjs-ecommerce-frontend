import { CartItem } from "@/types/productType";

const CART_STORAGE_KEY = "ecommerce-cart-items";

export const mergeLocalCartToDB = async () => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return;

    let localCart: CartItem[] = [];

    try {
        localCart = JSON.parse(stored);
    } catch {
        return;
    }

    if (!Array.isArray(localCart) || localCart.length === 0) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;
    console.log("Local cart before merge:", localStorage.getItem("ecommerce-cart-items"));

    console.log("checking token", token)


    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/merge`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                items: localCart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                  
                })),
            }),
        });

        // ✅ clear ONLY cart
        localStorage.removeItem(CART_STORAGE_KEY);

        console.log("✅ Local cart merged to DB");
        console.log("Local cart after merge:", localStorage.getItem("ecommerce-cart-items"));
        // console.log("Local cart after merge:", localCart);
    } catch (error) {
        console.error("❌ Failed to merge local cart", error);
    }
};
