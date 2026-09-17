"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { fetchGallery } from "@/lib/api";
import {
  CATEGORIES,
  type GalleryCategory,
  type GalleryItem,
  itemImageUrl,
} from "@/lib/gallery";
import { ChevronRight, Camera, Tag, Calendar } from "lucide-react";
import { BRIGADE_CONFIG } from "@/config/brigade";

type Filter = "todas" | GalleryCategory;

interface Album {
  title: string;
  category: GalleryCategory;
  items: GalleryItem[];
  src: string;
  width: number;
  height: number;
}

const PHOTO_RATIO = { width: 4, height: 3 };

function groupByTitle(items: GalleryItem[]): Album[] {
  const map = new Map<string, GalleryItem[]>();
  for (const item of items) {
    const key = item.title || "Sem título";
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  const albums: Album[] = [];
  for (const [title, list] of map) {
    const sortedList = [...list].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
    const first = sortedList[0];
    albums.push({
      title,
      category: first.category,
      items: sortedList,
      src: itemImageUrl(first),
      width: PHOTO_RATIO.width,
      height: PHOTO_RATIO.height,
    });
  }
  albums.sort((a, b) =>
    b.items[0].createdAt.localeCompare(a.items[0].createdAt)
  );
  return albums;
}

function CategoryBadge({ category, isActive, onClick }: {
  category: GalleryCategory | "todas";
  isActive: boolean;
  onClick: () => void;
}) {
  const label = category === "todas" ? "Todas" : CATEGORIES[category].label;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all ${
        isActive
          ? "bg-forest-700 text-white shadow-forest-700/20"
          : "border border-forest-200 bg-white/80 text-forest-700 hover:bg-forest-50 hover:border-forest-300 backdrop-blur-sm"
      }`}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}

function AlbumCard({ album, onOpenLightbox }: { album: Album; onOpenLightbox: (album: Album, startIndex?: number) => void }) {
  const coverImage = album.items[0];
  const date = new Date(coverImage.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm border border-forest-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={itemImageUrl(coverImage)}
          alt={`Capa do álbum ${album.title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="rounded-full bg-forest-600/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
            {CATEGORIES[album.category].label}
          </span>
          <span className="rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white flex items-center gap-1">
            <Camera className="h-3 w-3" aria-hidden="true" />
            {album.items.length}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {date}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-forest-900 truncate group-hover:text-forest-700 transition-colors">
          {album.title}
        </h2>
        <p className="mt-2 text-sm text-forest-600 flex items-center gap-1">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          {album.items.length} {album.items.length === 1 ? "foto" : "fotos"}
        </p>
        
        {album.items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-forest-100">
            <button
              type="button"
              onClick={() => onOpenLightbox(album, 0)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-forest-200 bg-white px-4 py-3 text-sm font-medium text-forest-700 shadow-sm transition-all hover:border-forest-300 hover:bg-forest-50 hover:shadow-md"
            >
              <span>
                {album.items.length === 1 ? "Ver imagem em tamanho real" : "Ver álbum completo"}
              </span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function EmptyState({ filter }: { filter: Filter }) {
  const isFiltered = filter !== "todas";
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="rounded-3xl border-2 border-dashed border-forest-200 bg-forest-50/50 p-12 sm:p-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-forest-100 text-forest-500">
          <Camera className="h-10 w-10" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-forest-900 mb-2">
          {isFiltered ? "Nenhuma imagem nesta categoria" : "A galeria está vazia"}
        </h3>
        <p className="text-forest-600 max-w-md mx-auto mb-6">
          {isFiltered
            ? "Tente selecionar outra categoria ou volte mais tarde."
            : "As fotos dos resgates, cursos, eventos e operações aparecerão aqui automaticamente quando a equipe fizer os primeiros uploads."}
        </p>
        {!isFiltered && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-forest-600 hover:shadow-xl"
          >
            Acessar área administrativa
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-forest-500">
            Galeria
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-forest-900 sm:text-4xl">
            Nossos trabalhos
          </h1>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <article key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm border border-forest-100 animate-pulse">
            <div className="aspect-[4/3] bg-forest-100/50" />
            <div className="p-5 sm:p-6 space-y-3">
              <div className="h-5 bg-forest-100 rounded w-3/4" />
              <div className="h-4 bg-forest-100 rounded w-1/2" />
              <div className="h-10 bg-forest-100 rounded" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="rounded-2xl border border-emergency-200 bg-emergency-50 p-8 text-center">
        <p className="text-emergency-700">{message}</p>
      </div>
    </section>
  );
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<Filter>("todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState<string[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  const load = useCallback(async () => {
    try {
      const manifest = await fetchGallery();
      setItems(manifest.items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar a galeria.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Use a ref to track if component is mounted to avoid state updates after unmount
  const mountedRef = useRef(true);
  
  useEffect(() => {
    mountedRef.current = true;
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        load();
      }
    }, 0);
    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
    };
  }, [load]);

  const visibleItems =
    filter === "todas" ? items : items.filter((i) => i.category === filter);

  const albums = useMemo(() => groupByTitle(visibleItems), [visibleItems]);

  const handleOpenLightbox = useCallback((album: Album, startIndex = 0) => {
    const slides = album.items.map((i) => itemImageUrl(i));
    setLightboxSlides(slides);
    setPhotoIndex(startIndex);
    setOpen(true);
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (visibleItems.length === 0) return <EmptyState filter={filter} />;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-forest-500">
            Galeria
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-forest-900 sm:text-4xl">
            Nossos trabalhos
          </h1>
          <p className="mt-3 max-w-xl text-forest-600">
            Cursos, eventos, resgates e ações de proteção ambiental realizadas
            pela {BRIGADE_CONFIG.name}.
          </p>
        </div>
        {albums.length > 0 && (
          <div className="flex items-center gap-3 text-sm text-forest-600">
            <span className="flex items-center gap-1">
              <Camera className="h-4 w-4" aria-hidden="true" />
              {items.length} {items.length === 1 ? "foto" : "fotos"}
            </span>
            <span className="text-forest-300">·</span>
            <span className="flex items-center gap-1">
              <Tag className="h-4 w-4" aria-hidden="true" />
              {albums.length} {albums.length === 1 ? "álbum" : "álbuns"}
            </span>
          </div>
        )}
      </div>

      <div
        className="mb-10 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filtrar por categoria"
      >
        <CategoryBadge
          category="todas"
          isActive={filter === "todas"}
          onClick={() => setFilter("todas")}
        />
        {Object.entries(CATEGORIES).map(([value]) => (
          <CategoryBadge
            key={value}
            category={value as GalleryCategory}
            isActive={filter === value}
            onClick={() => setFilter(value as GalleryCategory)}
          />
        ))}
      </div>

      <div className="mb-10 h-px w-full bg-gradient-to-r from-forest-100 via-forest-200/60 to-transparent" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {albums.map((album) => (
          <AlbumCard key={album.title} album={album} onOpenLightbox={handleOpenLightbox} />
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={photoIndex}
        slides={lightboxSlides.map((src) => ({ src }))}
        styles={{
          container: { backgroundColor: "rgba(0,0,0,0.95)" },
          toolbar: { backgroundColor: "rgba(0,0,0,0.7)" },
        }}
      />
    </section>
  );
}