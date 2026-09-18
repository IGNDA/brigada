export type WasteCategory =
  "papel" | "plastico" | "vidro" | "metal" | "organico" | "nao-reciclavel";

export interface WasteItem {
  id: string;
  name: string;
  emoji: string;
  category: WasteCategory;
}

export interface WasteCategoryInfo {
  id: WasteCategory;
  label: string;
  color: string;
  hoverColor: string;
}

export const wasteCategories: WasteCategoryInfo[] = [
  {
    id: "papel",
    label: "Papel",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
  },
  {
    id: "plastico",
    label: "Plástico",
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
  },
  {
    id: "vidro",
    label: "Vidro",
    color: "bg-green-600",
    hoverColor: "hover:bg-green-700",
  },
  {
    id: "metal",
    label: "Metal",
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
  },
  {
    id: "organico",
    label: "Orgânico",
    color: "bg-amber-800",
    hoverColor: "hover:bg-amber-900",
  },
  {
    id: "nao-reciclavel",
    label: "Não reciclável",
    color: "bg-gray-700",
    hoverColor: "hover:bg-gray-800",
  },
];

export const wasteItems: WasteItem[] = [
  { id: "jornal", name: "Jornal", emoji: "📰", category: "papel" },
  { id: "caixa", name: "Caixa de papelão", emoji: "📦", category: "papel" },
  { id: "revista", name: "Revista", emoji: "🗞️", category: "papel" },
  { id: "pet", name: "Garrafa PET", emoji: "🧴", category: "plastico" },
  { id: "sacola", name: "Sacola plástica", emoji: "🛍️", category: "plastico" },
  {
    id: "copinho",
    name: "Copinho plástico",
    emoji: "🥤",
    category: "plastico",
  },
  { id: "garrafa", name: "Garrafa de vidro", emoji: "🍾", category: "vidro" },
  { id: "pote", name: "Pote de vidro", emoji: "🫙", category: "vidro" },
  { id: "latinha", name: "Lata de alumínio", emoji: "🥫", category: "metal" },
  { id: "tampa", name: "Tampa de metal", emoji: "⚙️", category: "metal" },
  { id: "banana", name: "Casca de banana", emoji: "🍌", category: "organico" },
  {
    id: "comida",
    name: "Resto de alimento",
    emoji: "🥗",
    category: "organico",
  },
  {
    id: "guardanapo",
    name: "Guardanapo de papel usado",
    emoji: "🧻",
    category: "nao-reciclavel",
  },
  { id: "pilha", name: "Pilha usada", emoji: "🔋", category: "nao-reciclavel" },
];
