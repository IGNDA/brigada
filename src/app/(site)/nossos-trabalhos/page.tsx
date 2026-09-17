import type { Metadata } from "next";
import Gallery from "@/components/gallery/gallery";

export const metadata: Metadata = {
  title: "Nossos trabalhos — Galeria da Brigada IGNDA",
  description:
    "Galeria de fotos dos cursos, eventos, resgates de fauna e ações de proteção ambiental realizadas pela Brigada IGNDA no Rio de Janeiro.",
};

export default function NossosTrabalhosPage() {
  return <Gallery />;
}
