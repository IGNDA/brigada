import type { Metadata } from "next";
import Gallery from "@/components/gallery/gallery";
import { BRIGADE_CONFIG } from "@/config/brigade";

export const metadata: Metadata = {
  title: `Nossos trabalhos — Galeria da ${BRIGADE_CONFIG.name}`,
  description: `Galeria de fotos dos cursos, eventos, resgates de fauna e ações de proteção ambiental realizadas pela ${BRIGADE_CONFIG.name} no Rio de Janeiro.`,
};

export default function NossosTrabalhosPage() {
  return <Gallery />;
}
