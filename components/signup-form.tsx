"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
  FormControl,
  Form,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { toast } from "sonner"
import {
  User,
  Mail,
  Lock,
  Store,
  MapPin,
  Shield,
  ArrowRight,
  CheckCircle,
  Users,
  ShoppingBag,
  EyeOff,
  Eye,
  Briefcase,
  UserCircle
} from "lucide-react"

const formSchema = z.object({
  name: z.string()
    .min(4, { message: "Name must be at least 4 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["SELLER", "CUSTOMER"]),
})

type FormValues = z.infer<typeof formSchema>

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"SELLER" | "CUSTOMER">("CUSTOMER")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    },
    mode: "onChange",
  })

  // Update form when role changes
  const handleRoleChange = (role: "SELLER" | "CUSTOMER") => {
    setSelectedRole(role)
    form.setValue("role", role)
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)

      console.log("Registration attempt with data:", data)

      const API_URL = process.env.NEXT_PUBLIC_API_URL

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      console.log("Registration response:", result)

      if (res.ok) {
        toast.success("Account created successfully!")

        // Clear any existing tokens
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userRole")

        // Wait 1 second then redirect to login
        setTimeout(() => {
          router.push(`/login?email=${encodeURIComponent(data.email)}&registered=true`)
        }, 1000)

      } else {
        // Show error message
        const errorMsg = result.message || result.error || "Registration failed"
        toast.error(errorMsg)
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast.error("Failed to connect to server. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const RoleCard = ({
    role,
    title,
    description,
    icon: Icon,
  }: {
    role: "SELLER" | "CUSTOMER"
    title: string
    description: string
    icon: React.ComponentType<any>
  }) => {
    const isSelected = selectedRole === role

    return (
      <button
        type="button"
        onClick={() => handleRoleChange(role)}
        className={cn(
          "relative w-full text-left p-5 rounded-xl border-2 transition-all duration-300",
          isSelected
            ? "border-primary bg-primary/5"
            : "border-gray-200 bg-white hover:border-primary/50"
        )}
      >
        {isSelected && (
          <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full">
            <CheckCircle className="h-5 w-5" />
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className={cn(
            "p-3 rounded-lg",
            isSelected ? "bg-primary/10" : "bg-gray-100"
          )}>
            <Icon className={cn(
              "h-6 w-6",
              isSelected ? "text-primary" : "text-gray-600"
            )} />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className={cn("w-full max-w-lg mx-auto", className)} {...props}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl shadow-lg shadow-primary/30 mb-4">
          <Store className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">
          Join our e-commerce platform to shop or sell amazing products
        </p>
      </div>

      <Card className="border shadow-lg">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  I want to join as a...
                </FormLabel>

                <div className="grid grid-cols-2 gap-3">
                  <RoleCard
                    role="CUSTOMER"
                    title="Customer"
                    description="Shop products & explore collections"
                    icon={ShoppingBag}
                  />

                  <RoleCard
                    role="SELLER"
                    title="Seller"
                    description="Sell products & grow your business"
                    icon={Briefcase}
                  />
                </div>

                <input
                  type="hidden"
                  {...form.register("role")}
                  value={selectedRole}
                />
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <User className="h-5 w-5" />
                          </div>
                          <Input
                            className="pl-10 py-6 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 group-hover:border-primary/50"
                            placeholder="John Doe"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <Mail className="h-5 w-5" />
                          </div>
                          <Input
                            className="pl-10 py-6 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 group-hover:border-primary/50"
                            placeholder="hello@example.com"
                            type="email"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <Shield className="h-5 w-5" />
                          </div>
                          <Input
                            className="pl-12 pr-12 py-6 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 group-hover:border-primary/50"
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Terms and Conditions */}
              <div className="text-xs text-gray-500">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground font-semibold rounded-xl py-6 text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Security Note */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
          <Shield className="h-4 w-4 text-primary" />
          <p className="text-xs text-gray-600 font-medium">
            Secure registration with 256-bit SSL encryption
          </p>
          <Shield className="h-4 w-4 text-secondary" />
        </div>
      </div>
    </div>
  )
}