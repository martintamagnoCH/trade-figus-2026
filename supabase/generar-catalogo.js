// Ejecutar con: node supabase/generar-catalogo.js > supabase/seed-catalogo.sql

const equipos = [
  { code: 'ALG', name: 'Algeria' },
  { code: 'ARG', name: 'Argentina' },
  { code: 'AUS', name: 'Australia' },
  { code: 'AUT', name: 'Austria' },
  { code: 'BEL', name: 'Bélgica' },
  { code: 'BIH', name: 'Bosnia y Herzegovina' },
  { code: 'BRA', name: 'Brasil' },
  { code: 'CAN', name: 'Canadá' },
  { code: 'CIV', name: 'Costa de Marfil' },
  { code: 'COD', name: 'Congo DR' },
  { code: 'COL', name: 'Colombia' },
  { code: 'CPV', name: 'Cabo Verde' },
  { code: 'CRO', name: 'Croacia' },
  { code: 'CUW', name: 'Curaçao' },
  { code: 'CZE', name: 'República Checa' },
  { code: 'ECU', name: 'Ecuador' },
  { code: 'EGY', name: 'Egipto' },
  { code: 'ENG', name: 'Inglaterra' },
  { code: 'ESP', name: 'España' },
  { code: 'FRA', name: 'Francia' },
  { code: 'GER', name: 'Alemania' },
  { code: 'GHA', name: 'Ghana' },
  { code: 'HAI', name: 'Haití' },
  { code: 'IRN', name: 'Irán' },
  { code: 'IRQ', name: 'Irak' },
  { code: 'JOR', name: 'Jordania' },
  { code: 'JPN', name: 'Japón' },
  { code: 'KOR', name: 'Corea del Sur' },
  { code: 'KSA', name: 'Arabia Saudita' },
  { code: 'MAR', name: 'Marruecos' },
  { code: 'MEX', name: 'México' },
  { code: 'NED', name: 'Países Bajos' },
  { code: 'NOR', name: 'Noruega' },
  { code: 'NZL', name: 'Nueva Zelanda' },
  { code: 'PAN', name: 'Panamá' },
  { code: 'PAR', name: 'Paraguay' },
  { code: 'POR', name: 'Portugal' },
  { code: 'QAT', name: 'Qatar' },
  { code: 'RSA', name: 'Sudáfrica' },
  { code: 'SCO', name: 'Escocia' },
  { code: 'SEN', name: 'Senegal' },
  { code: 'SUI', name: 'Suiza' },
  { code: 'SWE', name: 'Suecia' },
  { code: 'TUN', name: 'Túnez' },
  { code: 'TUR', name: 'Turquía' },
  { code: 'URU', name: 'Uruguay' },
  { code: 'USA', name: 'Estados Unidos' },
  { code: 'UZB', name: 'Uzbekistán' },
];

const rows = [];

// Figurita especial (código sin prefijo)
rows.push({ codigo: '00', descripcion: 'Logo Panini (FOIL)', seccion: 'Apertura' });

// Sección Apertura (FWC1-FWC8)
const apertura = [
  'Emblema Oficial (FOIL)',        // FWC1
  'Mascota Oficial (FOIL)',        // FWC2
  'Slogan Oficial (FOIL)',         // FWC3
  'Balón Oficial (FOIL)',          // FWC4
  'Sede - Estados Unidos (FOIL)', // FWC5
  'Sede - Canadá (FOIL)',          // FWC6
  'Sede - México (FOIL)',          // FWC7
  'Cartel del Torneo (FOIL)',      // FWC8
];
apertura.forEach((desc, i) => {
  rows.push({ codigo: `FWC${i + 1}`, descripcion: desc, seccion: 'Apertura' });
});

// Sección Historia (FWC9-FWC19)
for (let n = 9; n <= 19; n++) {
  rows.push({ codigo: `FWC${n}`, descripcion: 'Historia del Mundial', seccion: 'Historia' });
}

// Sección FIFA Museum (MUS1-MUS11)
const museum = [
  'Uruguay 1930 (FOIL)',
  'Italia 1934 & 1938 (FOIL)',
  'Brasil 1958 & 1962 (FOIL)',
  'Inglaterra 1966 (FOIL)',
  'Brasil 1970 (FOIL)',
  'Alemania 1974 (FOIL)',
  'Argentina 1978 & 1986 (FOIL)',
  'Italia 1982 & 2006 (FOIL)',
  'Alemania 1990 & 2014 (FOIL)',
  'Brasil 1994 (FOIL)',
  'Francia 1998 & 2018 (FOIL)',
];
museum.forEach((desc, i) => {
  rows.push({ codigo: `MUS${i + 1}`, descripcion: desc, seccion: 'FIFA Museum' });
});

// Stickers por equipo (20 por equipo)
for (const equipo of equipos) {
  for (let n = 1; n <= 20; n++) {
    let descripcion;
    if (n === 1) {
      descripcion = `${equipo.name} - Escudo (FOIL)`;
    } else if (n === 13) {
      descripcion = `${equipo.name} - Foto del equipo`;
    } else {
      descripcion = `${equipo.name} - Jugador`;
    }
    rows.push({
      codigo: `${equipo.code}${n}`,
      descripcion,
      seccion: equipo.name,
    });
  }
}

// Generar SQL
console.log('-- Catálogo de figuritas FIFA World Cup 2026 Panini');
console.log('-- Generado automáticamente - 980 figuritas');
console.log('');
console.log('truncate table public.catalogo_figuritas;');
console.log('');
console.log('insert into public.catalogo_figuritas (codigo, descripcion, seccion) values');

const values = rows.map(
  (r) =>
    `  ('${r.codigo}', '${r.descripcion.replace(/'/g, "''")}', '${r.seccion.replace(/'/g, "''")}')`
);
console.log(values.join(',\n') + ';');

console.error(`\nGeneradas ${rows.length} figuritas para ${equipos.length} equipos.`);
