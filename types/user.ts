export interface IUser {
  id: string
  name: string
  email: string
  userRole: "ADMIN" | "SELLER" | "CUSTOMER"
  profilePhoto?: string
}

export interface IUserProps {
  id: string
  name: string
  email: string
  role: "ADMIN" | "SELLER" | "CUSTOMER"
  profilePhoto?: string
}