# Define los valores para cada variable
COUNTRIES=("AT" "DE" "CH" "CZ" "SE")

# Opciones de Playwright
PROJECT="chromium"
SPEC="tests/PowerSellers-Lutz-Credit.spec.js"

# Itera sobre combinaciones
for COUNTRY in "${COUNTRIES[@]}"; do

    echo "▶ Ejecutando test para COUNTRY=$COUNTRY"
    COUNTRY=$COUNTRY npx playwright test $SPEC --project $PROJECT --headed
    echo "✓ Finalizado test para $COUNTRY"
    echo "---------------------------------------------"

done