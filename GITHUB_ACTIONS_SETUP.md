# GitHub Actions Setup - Daily Regression Tests

## ¿Qué hemos configurado?

Se ha creado un **workflow de GitHub Actions** que reemplaza tu cronjob actual. El script `runner.js` se ejecutará **todos los días a las 9:00 UTC** automáticamente.

## Ubicación del archivo

```
.github/workflows/daily-regression-tests.yml
```

---

## 📋 ¿Cómo funciona?

### 1. **Trigger (Disparador)**
```yaml
schedule:
  - cron: '0 9 * * *'
```
- Se ejecuta a las **9:00 UTC** cada día
- El primer `0` = minuto 0
- El segundo `9` = hora 9
- Los `* * *` = todos los días, todos los meses, todos los días de la semana

### 2. **Pasos del workflow**

| Paso | Acción |
|------|--------|
| **Checkout** | Descarga el código del repositorio |
| **Setup Node.js** | Configura Node.js v18 + caché de npm |
| **Install dependencies** | Ejecuta `npm ci` (instalación limpia) |
| **Install Playwright browsers** | Descarga los navegadores necesarios |
| **Run tests** | Ejecuta `node runner.js` |
| **Upload results** | Sube los reportes de Allure y dashboard |

---

## 🕐 Ajustar la hora de ejecución

Si quieres que se ejecute a diferente hora, edita la línea de cron:

```yaml
# Ejemplos:
cron: '0 9 * * *'     # 9:00 UTC (actual)
cron: '0 14 * * *'    # 14:00 UTC
cron: '30 8 * * *'    # 8:30 UTC
cron: '0 9 * * 1-5'   # Solo lunes a viernes a las 9:00 UTC
```

> **Nota:** GitHub usa **UTC**. Si tu cronjob estaba en otra zona horaria, ajusta la hora.

---

## ✅ Verificar que funciona

1. Abre tu repositorio en GitHub
2. Ve a la pestaña **Actions**
3. Busca el workflow **"Daily Regression Tests"**
4. Verás un calendario con las ejecuciones programadas

### Para probar manualmente:

Haz clic en el workflow → **Run workflow** → **Run workflow**

Esto ejecutará las pruebas inmediatamente sin esperar a las 9:00.

---

## 📊 Ver resultados

Después de cada ejecución:

1. **Dentro** del job → pestaña **Summary**
2. **Sección** "Artifacts" → descarga:
   - `allure-results/` → datos brutos de Allure
   - `allure-report/` → reporte HTML generado

---

## 🔄 Diferencias: Cronjob vs GitHub Actions

| Aspecto | Cronjob | GitHub Actions |
|---------|---------|-----------------|
| **Dónde se ejecuta** | Tu máquina local | Servidores de GitHub |
| **Configuración** | `crontab -e` en terminal | `.github/workflows/*.yml` en repo |
| **Logs** | Terminal local / archivos | GitHub UI → Actions tab |
| **Fallos** | Necesitas monitoreo externo | Notificaciones del repo |
| **Escalabilidad** | Limitado a tu máquina | Ilimitado (gratuito hasta cierto punto) |
| **Git-friendly** | No | Sí, versionado con el código |

---

## 🛠️ Personalización avanzada

### 1. **Notificaciones por email en caso de fallo**

Agrega al final del archivo `yml`:

```yaml
- name: Send notification on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: ${{ secrets.MAIL_SERVER }}
    server_port: ${{ secrets.MAIL_PORT }}
    username: ${{ secrets.MAIL_USER }}
    password: ${{ secrets.MAIL_PASSWORD }}
    subject: "❌ Regression Tests Failed"
    to: your-email@example.com
    from: ${{ secrets.MAIL_FROM }}
    body: "Ver detalles: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
```

### 2. **Ejecutar solo en ciertos días**

```yaml
# Solo lunes a viernes
cron: '0 9 * * 1-5'

# Solo martes y jueves
cron: '0 9 * * 2,4'
```

### 3. **Guardar historial de reportes**

Actualmente se guardan 30 días. Para cambiar:

```yaml
retention-days: 60  # En la sección de artifacts
```

---

## ⚙️ Monitoreo y alertas

### GitHub proporciona:
- ✅ Email automático si el workflow falla
- ✅ Historial completo de ejecuciones
- ✅ Logs detallados de cada paso

### Próximos pasos opcionales:
- Integrar con Slack / Discord para notificaciones
- Publicar resultados de Allure en una página web
- Crear un dashboard que muestre tendencias

---

## 📝 Notas importantes

1. **Permisos**: GitHub Actions necesita permiso para escribir en el repositorio. Esto está habilitado por defecto.

2. **Costo**: GitHub regala 2000 minutos/mes de Actions para repositorios públicos. Las pruebas usan máximo ~10-15 min, así que no hay problema.

3. **Zona horaria**: GitHub siempre usa **UTC**. Si necesitas que sea a las 9:00 tu hora local, ajusta el cron.

4. **Secretos**: Si necesitas credenciales o tokens, úsalos bajo `${{ secrets.VARIABLE_NAME }}` (ver configuración del repo → Settings → Secrets).

---

## 🚀 Próximos pasos

1. Haz push de los cambios
2. Abre GitHub → Actions y verifica que el workflow aparece
3. Espera a las 9:00 UTC o ejecuta manualmente para probar
4. Monitorea los primeros reportes

¡Listo! Por ahora tu cronjob está reemplazado por una solución más robusta y fácil de mantener. 🎉
