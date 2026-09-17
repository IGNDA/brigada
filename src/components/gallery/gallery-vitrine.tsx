"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchGallery } from "@/lib/api";
import { itemImageUrl } from "@/lib/gallery";
import type { GalleryItem } from "@/lib/gallery";
import { urls } from "@/lib/urls";

const VITRINE_LIMIT = 4;

export default function GalleryVitrine() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const manifest = await fetchGallery();
        if (!cancelled) {
          setItems(manifest.items.slice(0, VITRINE_LIMIT));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Falha ao carregar.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest-600">
          Nossa gente
        </p>
        <h2 className="mt-2 text-2xl font-bold text-forest-900 sm:text-3xl">
          Nossos trabalhos
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(VITRINE_LIMIT)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl bg-forest-100/50 animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest-600">
          Nossa gente
        </p>
        <h2 className="mt-2 text-2xl font-bold text-forest-900 sm:text-3xl">
          Nossos trabalhos
        </h2>
        <div className="mt-8 rounded-2xl border-2 border-dashed border-forest-200 bg-forest-50 p-12 text-center">
          <p className="text-forest-600">
            Não foi possível carregar a prévia da galeria.
          </p>
          <Link
            href={urls.gallery()}
            className="inline-flex items-center gap-2 rounded-full border border-forest-200 bg-white px-5 py-2 text-sm font-medium text-forest-700 shadow-sm transition-all hover:border-forest-300 hover:bg-forest-50"
          >
            Ver galeria completa
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest-600">
          Nossa gente
        </p>
        <h2 className="mt-2 text-2xl font-bold text-forest-900 sm:text-3xl">
          Nossos trabalhos
        </h2>
        <p className="mt-3 max-w-2xl text-forest-700">
          Um registro visual das ações de proteção ambiental realizadas pela
          Brigada IGNDA. Cada imagem conta uma história de dedicação voluntária.
        </p>
        <div className="mt-10 rounded-2xl bg-gradient-to-br from-forest-50 to-forest-100 p-10 sm:p-16 text-center">
          <div
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-forest-100 text-forest-600 text-4xl sm:h-32 sm:w-32 sm:text-5xl"
            aria-hidden="true"
          >
            📷
          </div>
          <p className="mt-6 text-lg font-medium text-forest-800">
            A galeria ainda está vazia
          </p>
          <p className="mt-2 text-forest-600 max-w-md mx-auto">
            As fotos dos resgates, cursos, eventos e operações aparecerão aqui
            automaticamente quando a equipe fizer os primeiros uploads.
          </p>
          <Link
            href={urls.gallery()}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-forest-600 hover:shadow-xl"
          >
            Acessar galeria
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-forest-600">
        Nossa gente
      </p>
      <h2 className="mt-2 text-2xl font-bold text-forest-900 sm:text-3xl">
        Nossos trabalhos
      </h2>
      <p className="mt-3 max-w-2xl text-forest-700">
        Um registro visual das ações de proteção ambiental realizadas pela
        Brigada IGNDA. Cada imagem conta uma história de dedicação voluntária.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Link
            key={item.id}
            href={urls.gallery()}
            className="group relative overflow-hidden rounded-xl bg-forest-50 shadow-sm transition-all hover:shadow-lg"
            aria-label={`Ver ${item.title} na galeria completa`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={itemImageUrl(item)}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <p className="font-semibold truncate">{item.title}</p>
              <p className="text-xs text-forest-100 capitalize">
                {item.category}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-forest-100 bg-white p-6 shadow-sm sm:px-8">
        <div>
          <p className="text-sm font-medium text-forest-600">Quer ver mais?</p>
          <h3 className="mt-1 text-lg font-bold text-forest-900">
            Galeria completa com todas as fotos organizadas por categoria
          </h3>
        </div>
        <Link
          href={urls.gallery()}
          className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-forest-600 hover:shadow-xl"
        >
          Acessar galeria
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
