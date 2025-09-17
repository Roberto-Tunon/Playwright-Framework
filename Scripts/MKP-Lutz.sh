# Define las configuraciones como "Campo1=...,Campo2=...,Campo3=..."
CONFIGURACIONES=(
  "COUNTRY=AT,MODE=1P,PAY=KN"
  "COUNTRY=DE,MODE=3P,PAY=KL"
)

# Opciones de Playwright
PROJECT="chromium"
SPEC="tests/MKP/PowerSellers-Lutz-MKP.spec.js"

# Itera sobre cada configuración
for CONFIG in "${CONFIGURACIONES[@]}"; do
  # Evalúa cada par clave=valor y exporta como variable
  eval $(echo $CONFIG | tr ',' '\n')

  echo "▶ Ejecutando test para COUNTRY=$COUNTRY, MODE=$MODE y PAY=$PAY"
  COUNTRY=$COUNTRY MODE=$MODE PAY=$PAY npx playwright test $SPEC --project $PROJECT --headed
  echo "✓ Finalizado test para $COUNTRY - $MODE - $PAY"
  echo "---------------------------------------------"
done