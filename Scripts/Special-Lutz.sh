# Define los valores para cada variable
MODES=("KO" "SW" "TW" "ON" "DEL" "KL" "KN")

# Opciones de Playwright
PROJECT="chromium"
SPEC="tests/PowerSellers-Lutz-Payments.spec.ts"

# Itera sobre combinaciones
for PAY in "${MODES[@]}"; do

    echo "▶ Ejecutando test para MODE=$PAY"
    PAY=$PAY npx playwright test $SPEC --project $PROJECT --headed
    echo "✓ Finalizado test para $PAY"
    echo "---------------------------------------------"

done