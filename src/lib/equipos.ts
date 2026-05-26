export const EQUIPOS: Record<string, { nombre: string; iso: string | null; emoji?: string }> = {
  "00": { nombre: "Apertura",             iso: null, emoji: "⚽" },
  FWC:  { nombre: "Apertura",             iso: null, emoji: "⚽" },
  HIS:  { nombre: "Historia",             iso: null, emoji: "📖" },
  ALG: { nombre: "Algeria",              iso: "dz" },
  ARG: { nombre: "Argentina",            iso: "ar" },
  AUS: { nombre: "Australia",            iso: "au" },
  AUT: { nombre: "Austria",              iso: "at" },
  BEL: { nombre: "Bélgica",              iso: "be" },
  BIH: { nombre: "Bosnia y Herzegovina", iso: "ba" },
  BRA: { nombre: "Brasil",               iso: "br" },
  CAN: { nombre: "Canadá",               iso: "ca" },
  CIV: { nombre: "Costa de Marfil",      iso: "ci" },
  COD: { nombre: "Congo DR",             iso: "cd" },
  COL: { nombre: "Colombia",             iso: "co" },
  CPV: { nombre: "Cabo Verde",           iso: "cv" },
  CRO: { nombre: "Croacia",              iso: "hr" },
  CUW: { nombre: "Curaçao",              iso: "cw" },
  CZE: { nombre: "República Checa",      iso: "cz" },
  ECU: { nombre: "Ecuador",              iso: "ec" },
  EGY: { nombre: "Egipto",               iso: "eg" },
  ENG: { nombre: "Inglaterra",           iso: "gb-eng" },
  ESP: { nombre: "España",               iso: "es" },
  FRA: { nombre: "Francia",              iso: "fr" },
  GER: { nombre: "Alemania",             iso: "de" },
  GHA: { nombre: "Ghana",                iso: "gh" },
  HAI: { nombre: "Haití",                iso: "ht" },
  IRN: { nombre: "Irán",                 iso: "ir" },
  IRQ: { nombre: "Irak",                 iso: "iq" },
  JOR: { nombre: "Jordania",             iso: "jo" },
  JPN: { nombre: "Japón",                iso: "jp" },
  KOR: { nombre: "Corea del Sur",        iso: "kr" },
  KSA: { nombre: "Arabia Saudita",       iso: "sa" },
  MAR: { nombre: "Marruecos",            iso: "ma" },
  MEX: { nombre: "México",               iso: "mx" },
  NED: { nombre: "Países Bajos",         iso: "nl" },
  NOR: { nombre: "Noruega",              iso: "no" },
  NZL: { nombre: "Nueva Zelanda",        iso: "nz" },
  PAN: { nombre: "Panamá",               iso: "pa" },
  PAR: { nombre: "Paraguay",             iso: "py" },
  POR: { nombre: "Portugal",             iso: "pt" },
  QAT: { nombre: "Qatar",                iso: "qa" },
  RSA: { nombre: "Sudáfrica",            iso: "za" },
  SCO: { nombre: "Escocia",              iso: "gb-sct" },
  SEN: { nombre: "Senegal",              iso: "sn" },
  SUI: { nombre: "Suiza",                iso: "ch" },
  SWE: { nombre: "Suecia",               iso: "se" },
  TUN: { nombre: "Túnez",                iso: "tn" },
  TUR: { nombre: "Turquía",              iso: "tr" },
  URU: { nombre: "Uruguay",              iso: "uy" },
  USA: { nombre: "Estados Unidos",       iso: "us" },
  UZB: { nombre: "Uzbekistán",           iso: "uz" },
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
  "MEX", "KOR", "RSA", "CZE",
  // Grupo B
  "CAN", "SUI", "QAT", "BIH",
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
