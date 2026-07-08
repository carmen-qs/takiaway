import os
import requests
from dotenv import load_dotenv

# Load environment variables from backend/.env or parent if exists
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()

API_KEY = os.getenv("YOUTUBE_API_KEY")

if not API_KEY:
    print("Error: YOUTUBE_API_KEY not found in environment variables. Please check your backend/.env file.")
    exit(1)

# List of search queries for the artists (expanded to individual songs/videos)
SEARCH_QUERIES = [
    "Renata Flores video oficial",
    "Renata Flores Cholo Soy oficial",
    "Renata Flores La Cumbia del Olvido oficial",
    "Kayfex video oficial",
    "Kayfex Los Apus del Peru Vengo Solterito oficial",
    "Wariwillka video oficial",
    "Wariwillka Fiestapaq oficial",
    "Söfy Ámame video oficial",
    "Söfy Fantasía video oficial",
    "Söfy Promesas video oficial",
    "Söfy Nuna video oficial",
    "Qorianka video oficial",
    "Qorianka dance performance",
    "Atuq Sisa video oficial",
    "Atuq Sisa Sunqullay Andino oficial"
]

def fetch_youtube_videos(query):
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": 3,
        "key": API_KEY
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return data.get("items", [])
    except requests.exceptions.RequestException as e:
        print(f"Error fetching results for '{query}': {e}")
        return []

def main():
    print("--- YouTube Video Search for TakiAway Artists ---")
    
    for i, query in enumerate(SEARCH_QUERIES, 1):
        print(f"{i}. Query: {query}")
        results = fetch_youtube_videos(query)
        
        if not results:
            print("   No results found.")
        else:
            for j, item in enumerate(results, 1):
                snippet = item["snippet"]
                video_id = item["id"]["videoId"]
                title = snippet["title"]
                channel = snippet["channelTitle"]
                print(f"   {j}) Title: {title}")
                print(f"      Channel: {channel}")
                print(f"      Video ID: {video_id}")
                print("-" * 20)
        print()

if __name__ == "__main__":
    main()
