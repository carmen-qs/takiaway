# API Contracts

## Endpoints

### 1. List Artists
`GET /api/v1/artists`

**Query Parameters**
- `genre` (optional): Filter artists by musical genre.

**Response (200 OK)**
```json
[
  {
    "id": "uuid",
    "nombre_artistico": "string",
    "origen": "string",
    "genero_musical": "string"
  }
]
```

### 2. Get Artist Detail
`GET /api/v1/artists/{id}`

**Response (200 OK)**
```json
{
  "id": "uuid",
  "nombre_artistico": "string",
  "nombre_real": "string|null",
  "origen": "string",
  "genero_musical": "string",
  "biografia": "string",
  "hito_relevante": "string",
  "videos": [
    {
      "youtube_video_id": "string",
      "titulo": "string"
    }
  ]
}
```
