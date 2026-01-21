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

    console.log("Local cart before merge:", localCart);

    try {
        // First, check if user already has items in DB cart
        const existingCartRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const existingCartData = await existingCartRes.json();
        const hasExistingItems = existingCartData?.data?.items?.length > 0;

        // if (hasExistingItems) {
        //     console.log("User already has items in DB cart, skipping merge");
        //     // Clear local cart but don't merge to avoid duplication
        //     localStorage.removeItem(CART_STORAGE_KEY);
        //     return;
        // }

        // Only merge if DB cart is empty
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

        // Clear local cart
        localStorage.removeItem(CART_STORAGE_KEY);

        console.log("✅ Local cart merged to DB", localCart);
    } catch (error) {
        console.error("❌ Failed to merge local cart", error);
    }
};
