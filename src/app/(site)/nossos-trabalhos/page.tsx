import type { Metadata } from "next";
import Gallery from "@/components/gallery/gallery";

export const metadata: Metadata = {
  title: "Nossos trabalhos",
  description:
    "Galeria de cursos, eventos, resgates e ações da 1 Brigada de Operações Florestais RJ (Brigada Ivan Moraes).",
};

export default function NossosTrabalhosPage() {
  return <Gallery />;
}
