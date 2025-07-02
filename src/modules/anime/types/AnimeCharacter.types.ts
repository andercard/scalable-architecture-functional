export interface AnimeCharacter {
  mal_id: number
  url: string
  images: {
    jpg: { image_url: string }
    webp?: { image_url: string }
  }
  name: string
  role: string
  voice_actors: {
    person: {
      mal_id: number
      name: string
      url: string
      images: {
        jpg: { image_url: string }
      }
    }
    language: string
  }[]
}

export interface AnimeCharactersResponse {
  data: AnimeCharacter[]
} 