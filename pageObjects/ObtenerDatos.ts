import constantes, { DatosRail } from '../tests/constantes';

export function ObtenerDatos(pais: string): DatosRail {
  const clave = `datos${pais}`;
  if (constantes[clave]) {
    return constantes[clave] as DatosRail;
  } else {
    throw new Error(`País no soportado: ${pais}`);
  }
}