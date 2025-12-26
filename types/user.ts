export interface IUser {
  id: string
  name: string
  email: string
  role: "ADMIN" | "SELLER" | "CUSTOMER"
  profilePhoto?: string
}