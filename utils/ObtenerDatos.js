const  constantes = require('../tests/constantes');

function ObtenerDatos(pais) {
    const clave = `datos${pais}`;
    if (constantes[clave]) {
      return constantes[clave];
    } else {
      throw new Error(`País no soportado: ${pais}`);
    }
  }

module.exports = { ObtenerDatos };  