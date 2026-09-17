"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PhotoAlbum from "react-photo-album";
import "react-photo-album/masonry.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { fetchGallery } from "@/lib/api";
import {
  CATEGORIES,
  type GalleryCategory,
  type GalleryItem,
  itemImageUrl,
} from "@/lib/gallery";

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
      setError(
        err instanceof Error ? err.message : "Falha ao carregar a galeria."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching assíncrono
    void load();
  }, [load]);

  const visibleItems =
    filter === "todas" ? items : items.filter((i) => i.category === filter);

  const albums = useMemo(() => groupByTitle(visibleItems), [visibleItems]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-forest-500">
            Galeria
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-forest-900 sm:text-4xl">
            Nossos trabalhos
          </h1>
          <p className="mt-3 max-w-xl text-forest-600">
            Cursos, eventos, resgates e ações de proteção ambiental realizadas
            pela brigada.
          </p>
        </div>
        {albums.length > 0 && (
          <span className="rounded-full border border-forest-100 bg-white px-4 py-1.5 text-sm font-medium text-forest-700 shadow-sm">
            {items.length} {items.length === 1 ? "foto" : "fotos"} em{" "}
            {albums.length} {albums.length === 1 ? "galeria" : "galerias"}
          </span>
        )}
      </div>

      <div
        className="mt-8 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filtrar por categoria"
      >
        <button
          type="button"
          onClick={() => setFilter("todas")}
          className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all ${
            filter === "todas"
              ? "bg-forest-700 text-white shadow-forest-700/20"
              : "border border-forest-100 bg-white text-forest-700 hover:bg-forest-50"
          }`}
        >
          Todas
        </button>
        {Object.entries(CATEGORIES).map(([value, c]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value as GalleryCategory)}
            className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all ${
              filter === value
                ? "bg-forest-700 text-white shadow-forest-700/20"
                : "border border-forest-100 bg-white text-forest-700 hover:bg-forest-50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 h-px w-full bg-gradient-to-r from-forest-100 via-forest-200/60 to-transparent" />

      {error && (
        <p className="mt-8 rounded-lg border border-emergency-200 bg-emergency-50 p-4 text-sm text-emergency-700">
          {error}
        </p>
      )}

      {loading && <p className="mt-8 text-sm text-forest-700">Carregando...</p>}

      {!loading && !error && visibleItems.length === 0 && (
        <p className="mt-8 text-sm text-forest-700">
          Nenhuma imagem nesta categoria.
        </p>
      )}

      {!loading && albums.length > 0 && (
        <div className="mt-10 space-y-14">
          {albums.map((album) => (
            <section
              key={album.title}
              aria-label={album.title}
              className="overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-sm"
            >
              <div className="flex flex-col gap-3 border-b border-forest-100 bg-gradient-to-br from-forest-50/60 to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <h2 className="text-lg font-bold text-forest-900 sm:text-xl">
                  {album.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-forest-600/10 px-3 py-1 text-xs font-semibold text-forest-700">
                    {CATEGORIES[album.category].label}
                  </span>
                  <span className="rounded-full bg-forest-100 px-3 py-1 text-xs font-medium text-forest-600">
                    {album.items.length}{" "}
                    {album.items.length === 1 ? "foto" : "fotos"}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <PhotoAlbum
                  layout="masonry"
                  columns={(containerWidth) => {
                    if (containerWidth < 560) return 2;
                    if (containerWidth < 900) return 3;
                    return 4;
                  }}
                  spacing={12}
                  photos={album.items.slice(0, 4).map((item) => ({
                    src: itemImageUrl(item),
                    width: 4,
                    height: 3,
                    key: item.id,
                  }))}
                  onClick={({ index: photoIdx }) => {
                    const slides = album.items.map((i) => itemImageUrl(i));
                    setLightboxSlides(slides);
                    setPhotoIndex(photoIdx);
                    setOpen(true);
                  }}
                />
                {album.items.length > 4 && (
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        const slides = album.items.map((i) => itemImageUrl(i));
                        setLightboxSlides(slides);
                        setPhotoIndex(0);
                        setOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-forest-200 bg-white px-5 py-2 text-sm font-medium text-forest-700 shadow-sm transition-all hover:border-forest-300 hover:bg-forest-50"
                    >
                      Ver todas as {album.items.length} fotos
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={photoIndex}
        slides={lightboxSlides.map((src) => ({ src }))}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.9)" } }}
      />
    </section>
  );
}
