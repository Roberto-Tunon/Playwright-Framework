# Define los valores para cada variable
COUNTRIES=("AT" "DE" "CH")

# Opciones de Playwright
PROJECT="chromium"
SPEC="tests/PowerSellers-Lutz-Credit.spec.js"
RAIL="moemax"

# Itera sobre combinaciones
for COUNTRY in "${COUNTRIES[@]}"; do

    echo "▶ Testing Credit card on Moemax $COUNTRY"
    RAIL=$RAIL COUNTRY=$COUNTRY npx playwright test $SPEC --project $PROJECT --headed
    echo "✓ Successful test on $RAIL $COUNTRY"
    echo "---------------------------------------------"

done