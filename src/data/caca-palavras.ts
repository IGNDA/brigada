export const CACA_PALAVRAS_SIZE = 12;
export const WORDS_PER_GAME = 10;

export const cacaPalavrasWords = [
  // Biomas e ecossistemas
  "FLORESTA",
  "MATA",
  "MANGUEZAL",
  "CERRADO",
  "CAMPOS",
  "PANTANAL",
  "RECIFE",
  "CORAL",
  "SERRA",
  "VALE",
  "MONTANHA",
  "MORRO",
  "COLINA",
  "PLANALTO",
  "CAVERNA",
  "GRUTA",
  "BREJO",
  "DUNAS",
  "ILHA",
  "PRAIA",
  "LAGOA",
  "OCEANO",
  "MAR",
  "MANGUE",
  "RESTINGA",
  "TUNDRA",
  // Água e clima
  "AGUA",
  "CHUVA",
  "ORVALHO",
  "GELO",
  "NEVE",
  "NUVEM",
  "VENTO",
  "BRISA",
  "TEMPESTADE",
  "EVAPORACAO",
  "AQUIFERO",
  "LENCOL",
  "GOTA",
  "VAPOR",
  "UMIDADE",
  "CLIMA",
  "TROVAO",
  "RELAMPAGO",
  "ARCOIRIS",
  "GAROA",
  "GEADA",
  "VERAO",
  "INVERNO",
  "PRIMAVERA",
  "OUTONO",
  "NASCENTE",
  "RIO",
  "RIACHO",
  "CACHOEIRA",
  "RIBEIRAO",
  "BARRAGEM",
  // Fauna
  "ARARA",
  "TUCANO",
  "ONCA",
  "MICO",
  "CORUJA",
  "GARCA",
  "TATU",
  "CAPIVARA",
  "JACARE",
  "TAMANDUA",
  "BOTO",
  "GUARA",
  "LOBO",
  "MACACO",
  "URUBU",
  "COLIBRI",
  "BEIJAFLOR",
  "PAPAGAIO",
  "SABIA",
  "BEMTEVI",
  "GAVIAO",
  "FALCAO",
  "CANARIO",
  "PINGUIM",
  "BALEIA",
  "GOLFINHO",
  "TUBARAO",
  "TARTARUGA",
  "CAGADO",
  "JABUTI",
  "COBRA",
  "LAGARTIXA",
  "IGUANA",
  "CAMALEAO",
  "SAPO",
  "PERERECA",
  "BORBOLETA",
  "ABELHA",
  "FORMIGA",
  "JOANINHA",
  "VAGALUME",
  "GRILO",
  "CIGARRA",
  "LAGARTA",
  "CARANGUEJO",
  "SIRI",
  "ARANHA",
  "ANTA",
  "CUTIA",
  "COATI",
  "MURIQUI",
  "PICAPAU",
  "IRARA",
  "GAMBA",
  "JACU",
  "MACUCO",
  // Flora
  "ARVORE",
  "IPE",
  "AROEIRA",
  "PALMEIRA",
  "PAUBRASIL",
  "COQUEIRO",
  "BAMBU",
  "PINHEIRO",
  "EUCALIPTO",
  "SAMAMBAIA",
  "ORQUIDEA",
  "BROMELIA",
  "MUSGO",
  "LARANJEIRA",
  "ABACATEIRO",
  "GRAVIOLA",
  "JACARANDA",
  "SUCUPIRA",
  "JABUTICABA",
  "ACAI",
  "CAJU",
  "ACAICA",
  "PEROBA",
  "CANELA",
  "CEDRO",
  "GAMELEIRA",
  "ARAUCARIA",
  "PALMITO",
  "BURITI",
  "CARNAUBA",
  "ACACIA",
  "MIMOSA",
  "ALEGRIM",
  "CAPIM",
  "GUAXIMA",
  "HORTELA",
  "SIBIPIRUNA",
  "EMBAUBA",
  "IPORURU",
  // Incêndios e prevenção
  "QUEIMADA",
  "INCENDIO",
  "FOGUEIRA",
  "FAGULHA",
  "BRIGADA",
  "BOMBEIRO",
  "PREVENCAO",
  "ALERTA",
  "PROTECAO",
  "CUIDADO",
  "PERIGO",
  "CHAMA",
  "FAISCA",
  "FUMACA",
  "EXTINTOR",
  "SIRENE",
  "BALDE",
  "APAGAR",
  "QUEIMAR",
  "VEGETACAO",
  // Reciclagem e resíduos
  "RECICLAGEM",
  "LIXO",
  "RESIDUO",
  "LATINHA",
  "PET",
  "VIDRO",
  "PAPEL",
  "PAPELAO",
  "PLASTICO",
  "METAL",
  "ORGANICO",
  "COMPOSTAGEM",
  "REAPROVEITAR",
  "REUTILIZAR",
  "REDUZIR",
  "COLETA",
  "LIXEIRA",
  "GARRAFA",
  "EMBALAGEM",
  "SACOLA",
  "TAMPA",
  "CAIXA",
  "JORNAL",
  "REVISTA",
  "LATA",
  // Conservação e valores
  "NATUREZA",
  "PRESERVAR",
  "PROTEGER",
  "RESPEITO",
  "VOLUNTARIO",
  "VIDA",
  "FAUNA",
  "FLORA",
  "PLANETA",
  "TERRA",
  "VERDE",
  "EQUILIBRIO",
  "ARMONIA",
  "CONSCIENCIA",
  "EDUCACAO",
  "SIMBIOSE",
  "ECOSSISTEMA",
  "HABITAT",
  "ESPECIE",
  "AMBIENTE",
  "ECOLOGIA",
  "SUSTENTAR",
  "CARBONO",
  "OXIGENIO",
  "LIMPEZA",
  "SAUDE",
  "ESPERANCA",
  "FUTURO",
  "APRENDER",
  "CIDADANIA",
];

export interface WordPlacement {
  word: string;
  cells: Array<[number, number]>;
}

export interface Puzzle {
  grid: string[][];
  placements: WordPlacement[];
}

type RandomFn = () => number;

const DIRECTIONS = [
  { dr: -1, dc: 0 },
  { dr: -1, dc: 1 },
  { dr: 0, dc: 1 },
  { dr: 1, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: -1 },
  { dr: 0, dc: -1 },
  { dr: -1, dc: -1 },
];

const LETTER_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function pickWords(count: number = WORDS_PER_GAME): string[] {
  return [...cacaPalavrasWords].sort(() => Math.random() - 0.5).slice(0, count);
}

export function generatePuzzle(
  words: string[],
  size: number = CACA_PALAVRAS_SIZE,
  random: RandomFn = Math.random
): Puzzle {
  const grid: string[][] = Array.from({ length: size }, () =>
    Array<string>(size).fill("")
  );
  const placements: WordPlacement[] = [];
  const sorted = [...words].sort((a, b) => b.length - a.length);

  for (const word of sorted) {
    const letters = [...word];
    let placed = false;
    for (let attempt = 0; attempt < 300 && !placed; attempt++) {
      const { dr, dc } = DIRECTIONS[Math.floor(random() * DIRECTIONS.length)];
      const range = size - word.length + 1;
      const startRow =
        dr > 0
          ? Math.floor(random() * range)
          : dr < 0
            ? word.length - 1 + Math.floor(random() * range)
            : Math.floor(random() * size);
      const startCol =
        dc > 0
          ? Math.floor(random() * range)
          : dc < 0
            ? word.length - 1 + Math.floor(random() * range)
            : Math.floor(random() * size);

      const directionLetters =
        random() < 0.5 ? [...letters].reverse() : letters;
      const cells: Array<[number, number]> = [];
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = startRow + dr * i;
        const c = startCol + dc * i;
        const existing = grid[r][c];
        if (existing && existing !== directionLetters[i]) {
          fits = false;
          break;
        }
        cells.push([r, c]);
      }
      if (!fits) continue;
      for (let i = 0; i < cells.length; i++) {
        grid[cells[i][0]][cells[i][1]] = directionLetters[i];
      }
      placements.push({ word, cells });
      placed = true;
    }
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) {
        grid[r][c] = LETTER_POOL[Math.floor(random() * LETTER_POOL.length)];
      }
    }
  }

  return { grid, placements };
}
