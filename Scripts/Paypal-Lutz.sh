# Define los valores para cada variable
COUNTRIES=("AT" "DE" )

# Opciones de Playwright
PROJECT="chromium"
SPEC="tests/PowerSellers-Lutz-PayPal.spec.js"
RAIL="xxxlutz"

# Itera sobre combinaciones
for COUNTRY in "${COUNTRIES[@]}"; do

    echo "▶ Ejecutando test para COUNTRY=$COUNTRY"
     RAIL=$RAIL COUNTRY=$COUNTRY npx playwright test $SPEC --project $PROJECT --headed
    echo "✓ Finalizado test para $COUNTRY"
    echo "---------------------------------------------"

done