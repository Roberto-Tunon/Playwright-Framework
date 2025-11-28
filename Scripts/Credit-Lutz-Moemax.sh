# Define los valores para cada variable
COUNTRIES=("AT" "DE" "CH")
RAIL=("moemax" "xxxlutz")

# Opciones de Playwright
PROJECT="chromium"
SPEC="tests/PowerSellers-Lutz-Credit.spec.js"

# Itera sobre combinaciones
for RAIL in "${RAIL[@]}"; do
  for COUNTRY in "${COUNTRIES[@]}"; do

    echo "▶ Testing Credit card on ${RAIL^^} $COUNTRY"
    RAIL=$RAIL COUNTRY=$COUNTRY npx playwright test $SPEC --project $PROJECT --headed
    echo "✓ Successful test on ${RAIL^^} $COUNTRY"
    echo "---------------------------------------------"

  done
done