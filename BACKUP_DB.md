# Backup de la Base de Datos - TakiAway

Este archivo (`techspec_backup.dump`) contiene un respaldo completo de la base de datos PostgreSQL del proyecto, generado con `pg_dump` en formato custom.

## Cómo restaurarlo

1. Levanta los contenedores del proyecto:
```bash
docker compose up -d db
```

2. Copia el archivo dentro del contenedor:
```bash
docker compose cp techspec_backup.dump db:/tmp/techspec_backup.dump
```

3. Restaura el backup:
```bash
docker compose exec db pg_restore -U user -d takiaway --clean --if-exists /tmp/techspec_backup.dump
```

## Nota

Alternativamente, la base de datos puede reconstruirse desde cero (con datos actualizados y verificados) ejecutando:
```bash
docker compose exec backend python seed.py
```
