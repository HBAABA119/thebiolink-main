export interface User {
  id: string
  created_at: string
  email: string
  username: string
  name: string
  avatar: string | null
  bio: string | null
  background: string | null
  is_email_verified: boolean
  password_hash: string
}

export interface Link {
  id: string
  created_at: string
  user_id: string
  url: string
  title: string
  icon: string | null
  position: number
}