export interface Url {
  id: string
  url: string
  added_at: string
  created_at: string
}

export interface UrlInsert {
  url: string
  added_at?: string
}
