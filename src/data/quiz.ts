export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    question:
      "Ao encontrar um animal silvestre aparentemente abandonado na mata, qual é a atitude correta?",
    options: [
      "Levar para casa e criar como pet",
      "Observar à distância e acionar órgão ambiental competente",
      "Alimentá-lo imediatamente",
      "Tocar e tentar resgatá-lo sozinho",
    ],
    correctIndex: 1,
    explanation:
      "Muitos filhotes não estão abandonados — a mãe está por perto. O certo é observar de longe e acionar órgãos ambientais competentes.",
  },
  {
    question:
      "Qual é o período mais crítico de incêndios florestais no Brasil?",
    options: [
      "Verão, com as chuvas",
      "Outono, com a queda de folhas",
      "Período seco, especialmente de julho a outubro",
      "Inverno, por causa da neve",
    ],
    correctIndex: 2,
    explanation:
      "Na seca, a vegetação fica ressequida e qualquer fagulha pode virar um incêndio de grandes proporções.",
  },
  {
    question:
      "Queimadas em áreas verdes urbanas devem ser comunicadas imediatamente a qual órgão?",
    options: [
      "Corpo de Bombeiros (193)",
      "Empresa de telefonia",
      "Cartório de registro",
      "Prefeitura só na semana seguinte",
    ],
    correctIndex: 0,
    explanation:
      "O Corpo de Bombeiros (telefone 193) atende emergências de incêndio, inclusive em áreas de vegetação.",
  },
  {
    question: "Qual destes resíduos NÃO é reciclável?",
    options: [
      "Garrafa PET",
      "Papelão seco",
      "Guardanapo de papel usado",
      "Lata de alumínio",
    ],
    correctIndex: 2,
    explanation:
      "Papel sujo ou engordurado (como guardanapos usados) não pode ser reciclado e vai para o não reciclável.",
  },
  {
    question: "Para onde deve ir uma lâmpada fluorescente quebrada ou usada?",
    options: [
      "Lixo comum",
      "Coleta seletiva de papel",
      "Ponto de coleta específico ou coleta de resíduos perigosos",
      "Composteira de casa",
    ],
    correctIndex: 2,
    explanation:
      "A lâmpada fluorescente contém mercúrio e precisa de descarte especial, em pontos de coleta adequados.",
  },
  {
    question:
      "Qual animal é símbolo da Mata Atlântica e vive no Rio de Janeiro?",
    options: [
      "Mico-leão-dourado",
      "Pinguim-imperador",
      "Urso-panda",
      "Lobo da tundra",
    ],
    correctIndex: 0,
    explanation:
      "O mico-leão-dourado é endêmico da Mata Atlântica fluminense e símbolo da conservação desse bioma.",
  },
  {
    question: "O que fazer com uma pilha ou bateria usada?",
    options: [
      "Jogar no lixo comum",
      "Enterrar no quintal",
      "Descartar em pontos de coleta de pilhas e baterias",
      "Queimar junto com o lixo",
    ],
    correctIndex: 2,
    explanation:
      "Pilhas e baterias têm metais pesados e devem ir a coletores específicos, presentes em supermercados e lojas.",
  },
  {
    question:
      "Fazer fogueira em área de mata sem autorização é a melhor definição de:",
    options: [
      "Turismo responsável",
      "Crime ambiental",
      "Piquenique comum",
      "Atividade permitida por lei",
    ],
    correctIndex: 1,
    explanation:
      "Queimar vegetação sem licença é crime ambiental (Lei 9.605/98) e pode causar incêndios devastadores.",
  },
  {
    question: "Qual é a melhor atitude para economizar água no dia a dia?",
    options: [
      "Tomar banhos cada vez mais longos",
      "Lavar calçada com mangueira aberta",
      "Fechar a torneira ao escovar os dentes",
      "Deixar a torneira gotejando",
    ],
    correctIndex: 2,
    explanation:
      "Pequenos hábitos, como fechar a torneira enquanto escova os dentes, economizam milhares de litros por ano.",
  },
  {
    question:
      "Além de árvores, o que uma floresta preservada fornece de essencial para a cidade?",
    options: [
      "Poluição do ar",
      "Água, regulação do clima e abrigo para a fauna",
      "Somente madeira para construção",
      "Nada em particular",
    ],
    correctIndex: 1,
    explanation:
      "As florestas protegem mananciais, regulam a temperatura e mantêm a biodiversidade — serviços vitais para as cidades.",
  },
];

export const quizOptions = [
  { label: "A", className: "bg-forest-500" },
  { label: "B", className: "bg-forest-600" },
  { label: "C", className: "bg-forest-700" },
  { label: "D", className: "bg-forest-800" },
] as const;

export function quizResultMessage(score: number, total: number): string {
  const percentage = total > 0 ? score / total : 0;
  if (percentage === 1)
    return "Perfeito! Você é um guardião do meio ambiente. 🌱";
  if (percentage >= 0.7)
    return "Muito bem! Você já entende bastante sobre proteção ambiental. 🌿";
  if (percentage >= 0.4)
    return "Bom começo! Continue aprendendo para proteger a natureza. 🌳";
  return "Que tal rever os conteúdos do site e tentar de novo? A natureza conta com você! 🤝";
}
