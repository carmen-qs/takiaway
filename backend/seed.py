import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from src.models import Artist, Video, Base
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

async def seed():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        artists_data = [
            {
                "nombre_artistico": "Renata Flores Rivera",
                "nombre_real": "Renata Flores",
                "origen": "Huamanga, Ayacucho",
                "genero_musical": "Trap y pop andino en quechua",
                "biografia": "Cantautora y rapera peruana que fusiona música andina con hip-hop, trap y pop, cantando en quechua ayacuchano con el objetivo de revitalizar el idioma.",
                "hito_relevante": "Su cover en quechua de 'The Way You Make Me Feel' de Michael Jackson superó las 2 millones de reproducciones y fue cubierto por medios internacionales como BBC y CNN.",
                "fuente_url": "https://es.wikipedia.org/wiki/Renata_Flores_(cantante)",
                "videos": [
                    {"titulo": "Tijeras (ft. Kayfex)", "youtube_video_id": "VQUrV_v7OK8"},
                    {"titulo": "Mirando la misma Luna", "youtube_video_id": "QIjwC-6pf88"},
                    {"titulo": "Pachamama", "youtube_video_id": "KQ_AOEGTks0"},
                    {"titulo": "Francisca Pizarro /Invasión/", "youtube_video_id": "nv1R6NaYE18"}
                ]
            },
            {
                "nombre_artistico": "Kayfex",
                "nombre_real": None,
                "origen": "Ayacucho",
                "genero_musical": "Producción electrónica y sonidos andinos",
                "biografia": "Productor y DJ ayacuchano que fusiona sonidos andinos, como la danza de tijeras, con trap y música electrónica.",
                "hito_relevante": "Nominado al Grammy Latino; coautor de 'Tijeras' junto a Renata Flores.",
                "fuente_url": "https://elcomercio.pe/somos/historias/lenguas-originarias-wariwillka-renata-flores-pop-en-quechua-la-revolucion-del-pop-y-la-musica-urbana-en-lenguas-originarias-noticia/",
                "videos": [
                    {"titulo": "Tijeras (ft. Renata Flores)", "youtube_video_id": "VQUrV_v7OK8"},
                    {"titulo": "Nublado (ft. Raíces D'Jauja)", "youtube_video_id": "5v8urDqgDfo"},
                    {"titulo": "Mejor Sin Ti (ft. Lita Pezo, Los Wembler's)", "youtube_video_id": "IIOazl5Xdes"},
                    {"titulo": "Vengo Solterito (ft. Los Apus del Perú)", "youtube_video_id": "z6xnIt73v34"}
                ]
            },
            {
                "nombre_artistico": "Wariwillka",
                "nombre_real": "Luis Loayza",
                "origen": "Quinua, Ayacucho",
                "genero_musical": "Rap y hip-hop en quechua",
                "biografia": "Rapea en quechua fusionando el hip-hop con música andina, buscando revalorar la lengua entre los jóvenes de Ayacucho.",
                "hito_relevante": "Su canción 'Tusuriy' fue un encargo oficial para la celebración del Día del Quechua.",
                "fuente_url": "https://jornada.com.pe/wariwillka-el-artista-ayacuchano-que-promueve-el-quechua-a-traves-de-la-musica-fusion/",
                "videos": [
                    {"titulo": "TIGRES", "youtube_video_id": "f6Gsje4Wxbc"},
                    {"titulo": "Fiestapaq (Trap Quechua, prod. Kayfex)", "youtube_video_id": "NwmmMz5qjLk"}
                ]
            },
            {
                "nombre_artistico": "Söfy",
                "nombre_real": "Sofía Quinto Navarro",
                "origen": "Huamanga, Ayacucho",
                "genero_musical": "Pop en quechua y español",
                "biografia": "Cantante que fusiona el pop con la herencia cultural de Ayacucho, incorporando frases en quechua en sus canciones.",
                "hito_relevante": "Prepara su álbum debut 'Corazón Imperial', producido por Kayfex.",
                "fuente_url": "https://tercerparlante.com/lonuevo/sofy-reafirma-su-propuesta-de-pop-en-quechua-con-el-sencillo-killachkinmi/",
                "videos": [
                    {"titulo": "Killachkinmi", "youtube_video_id": "qzx5mQftjFk"},
                    {"titulo": "Ámame", "youtube_video_id": "i8_1Vbc8zg0"},
                    {"titulo": "Fantasía", "youtube_video_id": "M27BFg_eKVk"},
                    {"titulo": "Promesas", "youtube_video_id": "_O1xfv9a_zI"},
                    {"titulo": "Nuna", "youtube_video_id": "-WnIlrymhsM"}
                ]
            },
            {
                "nombre_artistico": "Qorianka",
                "nombre_real": "Gardenia Reynoso",
                "origen": "Lima (raíces ayacuchanas)",
                "genero_musical": "Fusión andina y K-pop",
                "biografia": "Fusiona el folclore andino peruano con el K-pop, cantando en quechua, español, coreano e inglés.",
                "hito_relevante": "Debutó oficialmente en 2024 abriendo el concierto '360' de Los Kjarkas en Lima.",
                "fuente_url": "https://elcomercio.pe/somos/historias/qorianka-la-princesa-quechua-del-k-pop-noticia/",
                "videos": [
                    {"titulo": "Upallay", "youtube_video_id": "cqIGfSiJ3R4"},
                    {"titulo": "Añañaw", "youtube_video_id": "4pu321c5qQY"},
                    {"titulo": "Tayta", "youtube_video_id": "AFvzh_G-r6w"}
                ]
            },
            {
                "nombre_artistico": "Atuq Sisa",
                "nombre_real": None,
                "origen": "Ayacucho",
                "genero_musical": "Rock andino en quechua",
                "biografia": "Banda de rock andino que fusiona rock, blues y country con sonidos ancestrales y letras en quechua.",
                "hito_relevante": "Nominados a los Muvid Awards 2024 por su tema 'Urqu Runa'.",
                "fuente_url": "https://conciertosperu.com.pe/entre-lo-ancestral-y-lo-moderno-escucha-a-atuq-sisa-y-su-nuevo-tema-urqu-runa",
                "videos": [
                    {"titulo": "Urqu Runa (ft. Lluqi)", "youtube_video_id": "rmVjoLFC7tU"},
                    {"titulo": "Pawachkanñam (ft. Renata Flores)", "youtube_video_id": "DK8xAfoGvuA"},
                    {"titulo": "Sunqullay Andino", "youtube_video_id": "DZp9jhaHXL0"}
                ]
            }
        ]

        total_videos = 0
        for data in artists_data:
            artist = Artist(
                nombre_artistico=data["nombre_artistico"],
                nombre_real=data["nombre_real"],
                origen=data["origen"],
                genero_musical=data["genero_musical"],
                biografia=data["biografia"],
                hito_relevante=data["hito_relevante"],
                fuente_url=data["fuente_url"]
            )
            session.add(artist)
            await session.flush()  # To get artist.id
            
            for video_data in data["videos"]:
                video = Video(
                    artist_id=artist.id,
                    youtube_video_id=video_data["youtube_video_id"],
                    titulo=video_data["titulo"]
                )
                session.add(video)
                total_videos += 1
        
        await session.commit()
        print(f"Database successfully seeded with {len(artists_data)} artists and {total_videos} videos.")

if __name__ == "__main__":
    asyncio.run(seed())
