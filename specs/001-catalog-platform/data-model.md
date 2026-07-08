# Data Model: Catalog Platform

## Entities

### Artist
Represents a musician in the catalog.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary key |
| `nombre_artistico` | String | Artist's stage name |
| `nombre_real` | String | Artist's real name (optional) |
| `origen` | String | District/Province of origin |
| `genero_musical` | String | Genre/type of music |
| `biografia` | Text | Artist biography |
| `hito_relevante` | Text | Notable career milestone |
| `fuente_url` | String | URL of the source for data verification (Mandatory per Constitution) |

### Video
Represents an official YouTube music video associated with an artist.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary key |
| `artist_id` | UUID | Foreign key referencing Artist |
| `youtube_video_id` | String | The YouTube video ID for embedding |
| `titulo` | String | Video title |

## Relationships

- `Artist` 1-to-many `Video`
