export type EquipoInfo = { nombre: string; iso: string | null; emoji?: string; grupo: string };

export const EQUIPOS: Record<string, EquipoInfo> = {
  "00": { nombre: "Apertura", iso: null, emoji: "⚽", grupo: "Apertura" },
  FWC: { nombre: "Apertura", iso: null, emoji: "⚽", grupo: "Apertura" },
  HIS: { nombre: "Historia", iso: null, emoji: "📖", grupo: "Historia" },
  MEX: { nombre: "México", iso: "mx", grupo: "Grupo A" },
  KOR: { nombre: "Corea del Sur", iso: "kr", grupo: "Grupo A" },
  RSA: { nombre: "Sudáfrica", iso: "za", grupo: "Grupo A" },
  CZE: { nombre: "República Checa", iso: "cz", grupo: "Grupo A" },
  CAN: { nombre: "Canadá", iso: "ca", grupo: "Grupo B" },
  SUI: { nombre: "Suiza", iso: "ch", grupo: "Grupo B" },
  QAT: { nombre: "Qatar", iso: "qa", grupo: "Grupo B" },
  BIH: { nombre: "Bosnia y Herzegovina", iso: "ba", grupo: "Grupo B" },
  BRA: { nombre: "Brasil", iso: "br", grupo: "Grupo C" },
  MAR: { nombre: "Marruecos", iso: "ma", grupo: "Grupo C" },
  HAI: { nombre: "Haití", iso: "ht", grupo: "Grupo C" },
  SCO: { nombre: "Escocia", iso: "gb-sct", grupo: "Grupo C" },
  USA: { nombre: "Estados Unidos", iso: "us", grupo: "Grupo D" },
  PAR: { nombre: "Paraguay", iso: "py", grupo: "Grupo D" },
  AUS: { nombre: "Australia", iso: "au", grupo: "Grupo D" },
  TUR: { nombre: "Turquía", iso: "tr", grupo: "Grupo D" },
  GER: { nombre: "Alemania", iso: "de", grupo: "Grupo E" },
  CUW: { nombre: "Curaçao", iso: "cw", grupo: "Grupo E" },
  CIV: { nombre: "Costa de Marfil", iso: "ci", grupo: "Grupo E" },
  ECU: { nombre: "Ecuador", iso: "ec", grupo: "Grupo E" },
  NED: { nombre: "Países Bajos", iso: "nl", grupo: "Grupo F" },
  JPN: { nombre: "Japón", iso: "jp", grupo: "Grupo F" },
  SWE: { nombre: "Suecia", iso: "se", grupo: "Grupo F" },
  TUN: { nombre: "Túnez", iso: "tn", grupo: "Grupo F" },
  BEL: { nombre: "Bélgica", iso: "be", grupo: "Grupo G" },
  EGY: { nombre: "Egipto", iso: "eg", grupo: "Grupo G" },
  IRN: { nombre: "Irán", iso: "ir", grupo: "Grupo G" },
  NZL: { nombre: "Nueva Zelanda", iso: "nz", grupo: "Grupo G" },
  ESP: { nombre: "España", iso: "es", grupo: "Grupo H" },
  CPV: { nombre: "Cabo Verde", iso: "cv", grupo: "Grupo H" },
  KSA: { nombre: "Arabia Saudita", iso: "sa", grupo: "Grupo H" },
  URU: { nombre: "Uruguay", iso: "uy", grupo: "Grupo H" },
  FRA: { nombre: "Francia", iso: "fr", grupo: "Grupo I" },
  SEN: { nombre: "Senegal", iso: "sn", grupo: "Grupo I" },
  IRQ: { nombre: "Irak", iso: "iq", grupo: "Grupo I" },
  NOR: { nombre: "Noruega", iso: "no", grupo: "Grupo I" },
  ARG: { nombre: "Argentina", iso: "ar", grupo: "Grupo J" },
  ALG: { nombre: "Algeria", iso: "dz", grupo: "Grupo J" },
  AUT: { nombre: "Austria", iso: "at", grupo: "Grupo J" },
  JOR: { nombre: "Jordania", iso: "jo", grupo: "Grupo J" },
  POR: { nombre: "Portugal", iso: "pt", grupo: "Grupo K" },
  COD: { nombre: "Congo DR", iso: "cd", grupo: "Grupo K" },
  UZB: { nombre: "Uzbekistán", iso: "uz", grupo: "Grupo K" },
  COL: { nombre: "Colombia", iso: "co", grupo: "Grupo K" },
  ENG: { nombre: "Inglaterra", iso: "gb-eng", grupo: "Grupo L" },
  CRO: { nombre: "Croacia", iso: "hr", grupo: "Grupo L" },
  GHA: { nombre: "Ghana", iso: "gh", grupo: "Grupo L" },
  PAN: { nombre: "Panamá", iso: "pa", grupo: "Grupo L" },
};

export function getPrefijo(codigo: string): string {
  // FWC9–FWC19 son la sección "Historia" (va al final del álbum)
  if (/^FWC(9|1[0-9])$/.test(codigo)) return "HIS";
  // Códigos especiales sin letras (ej: "00")
  return codigo.match(/^([A-Z]+)/)?.[1] ?? codigo;
}

// Orden del álbum Panini FIFA 2026: primero especiales, luego equipos por grupo
export const ORDEN_ALBUM = [
  "00", "FWC",
  // Grupo A
  "MEX", "RSA", "KOR", "CZE",
  // Grupo B
  "CAN", "BIH", "QAT", "SUI",
  // Grupo C
  "BRA", "MAR", "HAI", "SCO",
  // Grupo D
  "USA", "PAR", "AUS", "TUR",
  // Grupo E
  "GER", "CUW", "CIV", "ECU",
  // Grupo F
  "NED", "JPN", "SWE", "TUN",
  // Grupo G
  "BEL", "EGY", "IRN", "NZL",
  // Grupo H
  "ESP", "CPV", "KSA", "URU",
  // Grupo I
  "FRA", "SEN", "IRQ", "NOR",
  // Grupo J
  "ARG", "ALG", "AUT", "JOR",
  // Grupo K
  "POR", "COD", "UZB", "COL",
  // Grupo L
  "ENG", "CRO", "GHA", "PAN",
  // Al final
  "HIS",
];
