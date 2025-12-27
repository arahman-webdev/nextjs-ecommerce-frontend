"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X, Plus, CheckCircle, XCircle, Package, Tag, Palette, Ruler, Weight, Package2 } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/SharedComponent/MultipleImagesUploading";

// Category type
interface Category {
    id: string;
    name: string;
    createdAt: string;
}

// Product Schema based on backend requirements
export const productSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Product name must be at least 3 characters long" })
        .max(100, { message: "Product name must be less than 100 characters" }),

    description: z
        .string()
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(2000, { message: "Description must be less than 2000 characters" }),

    price: z
        .string()
        .nonempty({ message: "Price is required" })
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Price must be a valid number greater than or equal to 0",
        }),

    stock: z
        .string()
        .nonempty({ message: "Stock quantity is required" })
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Stock must be a valid number greater than or equal to 0",
        }),

    categoryId: z
        .string()
        .min(1, { message: "Please select a category" }),

    weight: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Number(val)), {
            message: "Weight must be a valid number",
        }),

    width: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Number(val)), {
            message: "Width must be a valid number",
        }),

    height: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Number(val)), {
            message: "Height must be a valid number",
        }),

    length: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Number(val)), {
            message: "Length must be a valid number",
        }),

    metaTitle: z
        .string()
        .max(60, { message: "Meta title must be less than 60 characters" })
        .optional(),

    metaDescription: z
        .string()
        .max(160, { message: "Meta description must be less than 160 characters" })
        .optional(),
});

// Component for array input fields (for variants, tags, etc.)
const ArrayInputField = ({
    title,
    description,
    icon: Icon,
    items,
    onItemsChange,
    placeholder,
    color,
}: {
    title: string;
    description: string;
    icon: any;
    items: string[];
    onItemsChange: (items: string[]) => void;
    placeholder: string;
    color: string;
}) => {
    const [input, setInput] = useState("");

    const addItem = () => {
        if (input.trim() && !items.includes(input.trim())) {
            onItemsChange([...items, input.trim()]);
            setInput("");
            toast.success(`${title} added successfully`);
        }
    };

    const removeItem = (index: number) => {
        onItemsChange(items.filter((_, i) => i !== index));
    };

    return (
        <div className={`p-4 rounded-xl border ${color} space-y-3`}>
            <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <h3 className="font-semibold text-lg">{title}</h3>
            </div>
            <p className="text-sm text-gray-600">{description}</p>

            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                    className="flex-1"
                />
                <Button
                    type="button"
                    onClick={addItem}
                    className="bg-primary hover:bg-primary/90"
                    style={{ backgroundColor: '#83B734' }}
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {/* Items List */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-white/80 p-2 rounded-lg border"
                    >
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {item}
                        </span>
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {items.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                        No items added yet. Click the + button to add.
                    </p>
                )}
            </div>
        </div>
    );
};

// Variant interface
interface Variant {
    color: string;
    size: string;
}

export default function CreateProduct() {
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const router = useRouter();

    // State for array fields
    const [tags, setTags] = useState<string[]>([]);
    const [variants, setVariants] = useState<Variant[]>([{ color: "", size: "" }]);

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/product/all-category');
            const data = await response.json();

            if (data.success) {
                setCategories(data.data);
            } else {
                toast.error("Failed to fetch categories");
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error("Error loading categories");
        }
    };

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            stock: "0",
            price: "0",
        },
    });

    const addVariant = () => {
        setVariants([...variants, { color: "", size: "" }]);
    };

    const removeVariant = (index: number) => {
        if (variants.length > 1) {
            setVariants(variants.filter((_, i) => i !== index));
        }
    };

    const updateVariant = (index: number, field: keyof Variant, value: string) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };

    const onSubmit = async (values: z.infer<typeof productSchema>) => {
        try {
            setLoading(true);

            // Validate images
            if (images.length === 0) {
                toast.error("Please upload at least one product image");
                setLoading(false);
                return;
            }

            // Get token
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error("Please login to create a product");
                router.push('/login');
                return;
            }

            // Prepare variants payload
            const variantPayload = variants
                .filter(v => v.color.trim() || v.size.trim())
                .map(v => ({
                    color: v.color.trim() || null,
                    size: v.size.trim() || null
                }));

            // Build payload to match backend
            const payload = {
                ...values,
                price: Number(values.price),
                stock: Number(values.stock),
                isFeatured,
                isActive,
                weight: values.weight ? Number(values.weight) : null,
                width: values.width ? Number(values.width) : null,
                height: values.height ? Number(values.height) : null,
                length: values.length ? Number(values.length) : null,
                variants: variantPayload,
                tags,
                averageRating: 0,
                reviewCount: 0,
                totalOrders: 0,
            };

            // Create FormData
            const formData = new FormData();
            formData.append("data", JSON.stringify(payload));

            // Append images
            images.forEach((img) => formData.append("images", img));

            // Send request
            const response = await fetch('http://localhost:5000/api/product/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to create product');
            }

            if (result.success) {
                toast.success("Product created successfully!");
                // Reset form
                // form.reset();
                // setImages([]);
                // setVariants([{ color: "", size: "" }]);
                // setTags([]);
                // setIsFeatured(false);
                // setIsActive(true);

                // Redirect to products page or dashboard
                // router.push('/dashboard/products');
            } else {
                toast.error(result.message || "Failed to create product");
            }

        } catch (error: any) {
            console.error('Create Product Error:', error);
            toast.error(error.message || "Something went wrong while creating the product");
        } finally {
            setLoading(false);
        }
    };

    const { register, handleSubmit, formState: { errors }, setValue } = form;

    const primaryColor = '#83B734';
    const primaryColorLight = '#83B7341A';
    const primaryColorBorder = '#83B73433';

    return (
        <div className="bg-white shadow-xl rounded-2xl p-8 border" style={{ borderColor: primaryColorBorder }}>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
                    Create New Product
                </h1>
                <p className="text-gray-600">Add your product details to start selling</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Basic Information */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: `${primaryColor}0A`, borderColor: primaryColorBorder }}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                        <Package className="w-5 h-5" />
                        Basic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="mb-2 block">Product Name *</Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    placeholder="e.g., Premium Office Chair"
                                    className="focus:ring-primary"
                                    style={{ borderColor: primaryColorBorder }}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="price" className="mb-2 block">Price (USD) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    {...register("price")}
                                    placeholder="e.g., 99.99"
                                    className="focus:ring-primary"
                                    style={{ borderColor: primaryColorBorder }}
                                />
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="stock" className="mb-2 block">Stock Quantity *</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    {...register("stock")}
                                    placeholder="e.g., 100"
                                    className="focus:ring-primary"
                                    style={{ borderColor: primaryColorBorder }}
                                />
                                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="categoryId" className="mb-2 block">Category *</Label>
                                <Select
                                    onValueChange={(value) => {
                                        console.log("Selected value:", value); // Debug log
                                        setValue("categoryId", value, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                            shouldTouch: true
                                        });
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select category">
                                            {form.watch("categoryId")
                                                ? categories.find(c => c.id === form.watch("categoryId"))?.name
                                                : "Select category"
                                            }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isFeatured" className="mb-0">Featured Product</Label>
                                    <Switch
                                        id="isFeatured"
                                        checked={isFeatured}
                                        onCheckedChange={setIsFeatured}
                                        style={{ backgroundColor: isFeatured ? primaryColor : undefined }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isActive" className="mb-0">Active Product</Label>
                                    <Switch
                                        id="isActive"
                                        checked={isActive}
                                        onCheckedChange={setIsActive}
                                        style={{ backgroundColor: isActive ? primaryColor : undefined }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: `${primaryColor}0A`, borderColor: primaryColorBorder }}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                        <Tag className="w-5 h-5" />
                        Description
                    </h2>
                    <div>
                        <Label htmlFor="description" className="mb-2 block">Product Description *</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            rows={6}
                            placeholder="Describe your product in detail..."
                            className="focus:ring-primary"
                            style={{ borderColor: primaryColorBorder }}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>
                </div>

                {/* Product Variants */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: `${primaryColor}0A`, borderColor: primaryColorBorder }}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                        <Palette className="w-5 h-5" />
                        Product Variants
                    </h2>

                    <div className="space-y-4">
                        {variants.map((variant, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`color-${index}`} className="text-sm mb-1 block">Color</Label>
                                        <Input
                                            id={`color-${index}`}
                                            value={variant.color}
                                            onChange={(e) => updateVariant(index, 'color', e.target.value)}
                                            placeholder="e.g., Black, Red, Blue"
                                            className="text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`size-${index}`} className="text-sm mb-1 block">Size</Label>
                                        <Input
                                            id={`size-${index}`}
                                            value={variant.size}
                                            onChange={(e) => updateVariant(index, 'size', e.target.value)}
                                            placeholder="e.g., S, M, L, XL"
                                            className="text-sm"
                                        />
                                    </div>
                                </div>
                                {variants.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeVariant(index)}
                                        variant="destructive"
                                        size="sm"
                                        className="h-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}

                        <Button
                            type="button"
                            onClick={addVariant}
                            variant="outline"
                            className="w-full border-dashed"
                            style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Variant
                        </Button>
                    </div>
                </div>

                {/* Dimensions & Specifications */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: `${primaryColor}0A`, borderColor: primaryColorBorder }}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                        <Ruler className="w-5 h-5" />
                        Dimensions & Specifications
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="weight" className="mb-2 block">Weight (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                {...register("weight")}
                                placeholder="e.g., 2.5"
                                className="focus:ring-primary"
                                style={{ borderColor: primaryColorBorder }}
                            />
                            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="width" className="mb-2 block">Width (cm)</Label>
                            <Input
                                id="width"
                                type="number"
                                step="0.1"
                                {...register("width")}
                                placeholder="e.g., 45.5"
                                className="focus:ring-primary"
                                style={{ borderColor: primaryColorBorder }}
                            />
                            {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="height" className="mb-2 block">Height (cm)</Label>
                            <Input
                                id="height"
                                type="number"
                                step="0.1"
                                {...register("height")}
                                placeholder="e.g., 90.0"
                                className="focus:ring-primary"
                                style={{ borderColor: primaryColorBorder }}
                            />
                            {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="length" className="mb-2 block">Length (cm)</Label>
                            <Input
                                id="length"
                                type="number"
                                step="0.1"
                                {...register("length")}
                                placeholder="e.g., 60.0"
                                className="focus:ring-primary"
                                style={{ borderColor: primaryColorBorder }}
                            />
                            {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: `${primaryColor}0A`, borderColor: primaryColorBorder }}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                        <Tag className="w-5 h-5" />
                        Tags
                    </h2>
                    <ArrayInputField
                        title="Product Tags"
                        description="Add keywords to help customers find your product"
                        icon={Tag}
                        items={tags}
                        onItemsChange={setTags}
                        placeholder="e.g., premium, ergonomic, office chair"
                        color={`border-[${primaryColor}33] bg-[${primaryColor}0A]`}
                    />
                </div>

                {/* SEO Information */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: `${primaryColor}0A`, borderColor: primaryColorBorder }}>
                    <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
                        SEO Information (Optional)
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="metaTitle" className="mb-2 block">Meta Title</Label>
                            <Input
                                id="metaTitle"
                                {...register("metaTitle")}
                                placeholder="e.g., Premium Office Chair - Ergonomic Design"
                                className="focus:ring-primary"
                                style={{ borderColor: primaryColorBorder }}
                            />
                            {errors.metaTitle && <p className="text-red-500 text-sm mt-1">{errors.metaTitle.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="metaDescription" className="mb-2 block">Meta Description</Label>
                            <Textarea
                                id="metaDescription"
                                {...register("metaDescription")}
                                rows={3}
                                placeholder="Brief description for search engines..."
                                className="focus:ring-primary"
                                style={{ borderColor: primaryColorBorder }}
                            />
                            {errors.metaDescription && <p className="text-red-500 text-sm mt-1">{errors.metaDescription.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Images Upload */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: `${primaryColor}0A`, borderColor: primaryColorBorder }}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                        <Package2 className="w-5 h-5" />
                        Product Images
                    </h2>
                    <ImageUpload onFilesChange={setImages} />
                    <p className="text-sm text-gray-600 mt-2">
                        Upload high-quality images of your product (Recommended: 3-8 images)
                    </p>
                    {images.length === 0 && (
                        <p className="text-red-500 text-sm mt-2">⚠️ At least one image is required</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {loading ? (
                            <>
                                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Creating Product...
                            </>
                        ) : (
                            "Create Product"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}