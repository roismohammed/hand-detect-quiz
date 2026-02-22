export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Apa ibu kota Indonesia?",
    options: ["Surabaya", "Jakarta", "Bandung", "Medan"],
    correctIndex: 1,
    explanation: "Jakarta adalah ibu kota Indonesia saat ini.",
  },
  {
    id: 2,
    question: "Planet terbesar di tata surya adalah?",
    options: ["Mars", "Saturnus", "Jupiter", "Neptunus"],
    correctIndex: 2,
    explanation: "Jupiter adalah planet terbesar di tata surya kita.",
  },
  {
    id: 3,
    question: "Berapa hasil dari 7 × 8?",
    options: ["54", "56", "58", "62"],
    correctIndex: 1,
    explanation: "7 × 8 = 56",
  },
  {
    id: 4,
    question: "Siapa penemu bola lampu?",
    options: ["Nikola Tesla", "Thomas Edison", "Albert Einstein", "Isaac Newton"],
    correctIndex: 1,
    explanation: "Thomas Edison dikenal sebagai penemu bola lampu.",
  },
  {
    id: 5,
    question: "Hewan apa yang merupakan mamalia terbesar?",
    options: ["Gajah", "Jerapah", "Paus Biru", "Hiu Paus"],
    correctIndex: 2,
    explanation: "Paus Biru adalah mamalia terbesar yang pernah hidup di bumi.",
  },
];
