"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteItem, fetchGallery, updateItem, uploadImage } from "@/lib/api";
import {
  CATEGORIES,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/gallery";
import { clearSessionToken, getSessionToken } from "@/lib/admin-session";
import { itemImageUrl } from "@/lib/gallery";
import { optimizeImage } from "@/lib/optimize-image";
import { ChevronDown, ChevronUp, Trash2, Edit2, X, Image as ImageIcon, Plus, FolderOpen } from "lucide-react";

interface Album {
  title: string;
  category: GalleryCategory;
  items: GalleryItem[];
  coverUrl: string;
  photoCount: number;
  createdAt: string;
}

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
      coverUrl: itemImageUrl(first),
      photoCount: list.length,
      createdAt: first.createdAt,
    });
  }
  albums.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return albums;
}

export default function AdminApp({
  onLogout,
  initialToken,
}: {
  onLogout: () => void;
  initialToken: string;
}) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("cursos");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState<GalleryCategory>("cursos");
  const [editSaving, setEditSaving] = useState(false);
  const [editMessage, setEditMessage] = useState<string | null>(null);

  const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [albumFilter, setAlbumFilter] = useState<string>("all");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = initialToken || getSessionToken();

  function handleAuthError(err: unknown): boolean {
    if (
      err instanceof Error &&
      (err as Error & { status?: number }).status === 401
    ) {
      clearSessionToken();
      onLogout();
      return true;
    }
    return false;
  }

  const load = useCallback(async () => {
    try {
      const manifest = await fetchGallery();
      setItems(manifest.items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar galeria.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [load]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!token || files.length === 0) return;
    setUploading(true);
    setUploadMessage("Otimizando e enviando imagens...");
    try {
      for (const file of files) {
        const optimized = await optimizeImage(file);
        await uploadImage(token, optimized.file, {
          title,
          description,
          category,
        });
      }
      setFiles([]);
      setTitle("");
      setDescription("");
      setUploadMessage(`${files.length} imagem(ns) enviada(s) com sucesso.`);
      await load();
    } catch (err) {
      if (!handleAuthError(err)) {
        setUploadMessage(
          err instanceof Error ? err.message : "Falha no upload."
        );
      }
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setUploading(false);
    }
  }

  async function handleDeleteAlbum(albumTitle: string) {
    if (!token) return;
    if (!window.confirm(`Excluir o álbum "${albumTitle}" e todas as suas fotos?`)) return;
    try {
      const album = groupByTitle(items).find(a => a.title === albumTitle);
      if (!album) return;
      
      for (const item of album.items) {
        await deleteItem(token, item.id);
      }
      await load();
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err instanceof Error ? err.message : "Falha ao excluir álbum.");
      }
    }
  }

  async function handleDeleteItem(id: string) {
    if (!token) return;
    if (!window.confirm("Excluir esta foto?")) return;
    try {
      await deleteItem(token, id);
      await load();
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err instanceof Error ? err.message : "Falha ao excluir.");
      }
    }
  }

  const albums = groupByTitle(items);

  const term = search.trim().toLowerCase();
  const filteredAlbums = albums
    .filter((album) => {
      if (albumFilter !== "all" && album.category !== albumFilter) return false;
      if (term) {
        return album.title.toLowerCase().includes(term) ||
          album.items.some(i => i.description?.toLowerCase().includes(term));
      }
      return true;
    });

  const toggleAlbum = (title: string) => {
    const next = new Set(expandedAlbums);
    if (next.has(title)) next.delete(title);
    else next.add(title);
    setExpandedAlbums(next);
  };

  const isExpanded = (title: string) => expandedAlbums.has(title);

  const uploadRef = useRef<HTMLInputElement>(null);

  function startEditAlbum(album: Album) {
    setEditingAlbum(album);
    setEditTitle(album.title);
    setEditDescription(album.items[0].description ?? "");
    setEditCategory(album.category);
    setEditSaving(false);
    setEditMessage(null);
  }

  function cancelEdit() {
    setEditingAlbum(null);
    setEditMessage(null);
  }

  async function handleEditAlbumSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !editingAlbum) return;
    setEditSaving(true);
    setEditMessage(null);
    try {
      for (const item of editingAlbum.items) {
        await updateItem(token, item.id, {
          title: editTitle,
          description: editDescription,
          category: editCategory,
        });
      }
      await load();
      setEditSaving(false);
      setEditingAlbum(null);
    } catch (err) {
      if (!handleAuthError(err)) {
        setEditMessage(err instanceof Error ? err.message : "Falha ao salvar.");
      }
      setEditSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">
            Nossos trabalhos
          </h1>
          <p className="text-sm text-forest-700">Administração da galeria por álbuns.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearSessionToken();
            onLogout();
          }}
          className="rounded-lg border border-forest-200 px-4 py-2 text-sm font-medium text-forest-800 transition-colors hover:bg-forest-100"
        >
          Sair
        </button>
      </div>

      <form
        onSubmit={handleUpload}
        className="mb-8 rounded-xl border border-forest-100 bg-white p-5 shadow-sm"
      >
        <h2 className="text-lg font-bold text-forest-900 flex items-center gap-2">
          <Plus className="h-5 w-5" aria-hidden="true" />
          Novo álbum / Enviar imagens
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-forest-900">
            Título do álbum
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Resgate de onça-pintada - Janeiro 2024"
              className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm font-normal text-forest-900 outline-none focus:border-forest-500"
            />
          </label>

          <label className="block text-sm font-medium text-forest-900">
            Categoria
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GalleryCategory)}
              className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm font-normal text-forest-900 outline-none focus:border-forest-500"
            >
              {Object.entries(CATEGORIES).map(([value, c]) => (
                <option key={value} value={value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block text-sm font-medium text-forest-900">
          Descrição (opcional - aplicada a todas as fotos do álbum)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm font-normal text-forest-900 outline-none focus:border-forest-500"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-forest-900">
          Arquivos (múltiplos)
          <span className="ml-2 text-xs font-normal text-forest-600">
            (máx. 10MB por imagem, otimização automática)
          </span>
          <input
            ref={uploadRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const selected = Array.from(e.target.files ?? []);
              setFiles(selected);
              if (selected.length === 0) e.target.value = "";
            }}
            className="mt-1 block w-full text-sm text-forest-700 file:mr-3 file:rounded-lg file:border-0 file:bg-forest-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-forest-800 hover:file:bg-forest-200"
          />
        </label>

        {files.length > 0 && (
          <p className="mt-2 text-xs text-forest-700">
            {files.length} arquivo(s) — serão otimizados (redimensionados para 1600px, WebP, ~100–300KB).
          </p>
        )}

        <button
          type="submit"
          disabled={uploading || files.length === 0 || !token}
          className="mt-5 rounded-lg bg-forest-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Enviando..." : "Criar álbum / Enviar imagens"}
        </button>

        {uploadMessage && (
          <p className="mt-3 text-sm text-forest-700" role="status">
            {uploadMessage}
          </p>
        )}
      </form>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-forest-900">
            Álbuns ({filteredAlbums.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="search"
              placeholder="Buscar álbum..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setAlbumFilter("all");
              }}
              className="w-full sm:w-64 rounded-lg border border-forest-200 py-2 pl-3 pr-8 text-sm text-forest-900 outline-none focus:border-forest-500"
            />
            <select
              value={albumFilter}
              onChange={(e) => setAlbumFilter(e.target.value)}
              className="rounded-lg border border-forest-200 px-3 py-2 text-sm font-normal text-forest-900 outline-none focus:border-forest-500"
            >
              <option value="all">Todas as categorias</option>
              {Object.entries(CATEGORIES).map(([value, c]) => (
                <option key={value} value={value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-emergency-600">{error}</p>}
        {loading && <p className="mb-4 text-sm text-forest-700">Carregando...</p>}

        {!loading && filteredAlbums.length === 0 && (
          <div className="text-center py-12 text-forest-700">
            {search || albumFilter !== "all"
              ? "Nenhum álbum encontrado."
              : "Nenhum álbum cadastrado ainda."}
          </div>
        )}

        <div className="space-y-4">
          {filteredAlbums.map((album) => {
            const expanded = isExpanded(album.title);
            return (
              <article
                key={album.title}
                className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleAlbum(album.title)}
                  className="w-full flex items-center justify-between gap-4 p-4 hover:bg-forest-50 transition-colors"
                  aria-expanded={expanded}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 h-14 w-14 rounded-lg overflow-hidden border border-forest-200 bg-forest-50">
                      <Image
                        src={album.coverUrl}
                        alt={`Capa do álbum ${album.title}`}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-forest-900 truncate">
                          {album.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-2 py-0.5 text-xs font-semibold text-forest-700">
                          <FolderOpen className="h-3 w-3" aria-hidden="true" />
                          {album.photoCount} {album.photoCount === 1 ? "foto" : "fotos"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-forest-600/10 px-2 py-0.5 text-xs font-semibold text-forest-700">
                          {CATEGORIES[album.category].label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-forest-600">
                        {album.items[0].description ? `${album.items[0].description.slice(0, 80)}...` : "Sem descrição"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditAlbum(album)}
                      className="rounded-md border border-forest-300 px-3 py-1.5 text-xs font-medium text-forest-800 transition-colors hover:bg-forest-100"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                      Editar álbum
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAlbum(album.title)}
                      className="rounded-md border border-emergency-600 px-3 py-1.5 text-xs font-medium text-emergency-600 transition-colors hover:bg-emergency-600 hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                      Excluir álbum
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleAlbum(album.title);
                      }}
                      className="rounded-md p-1.5 text-forest-500 hover:bg-forest-100 transition-colors"
                      aria-label={expanded ? "Recolher álbum" : "Expandir álbum"}
                    >
                      {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-forest-100 bg-forest-50/50 p-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {album.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className="relative overflow-hidden rounded-lg border border-forest-100 bg-white shadow-sm"
                        >
                          <Image
                            src={itemImageUrl(item)}
                            alt={item.title}
                            width={300}
                            height={200}
                            className="aspect-[4/3] w-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-2 left-2 right-2 text-white text-xs flex items-center justify-between px-2">
                            <span className="truncate max-w-[80%]">{item.title}</span>
                            <span className="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded text-[10px]">
                              <ImageIcon className="h-2.5 w-2.5" aria-hidden="true" />
                              #{idx + 1}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Individual edit could be added here
                              }}
                              className="rounded p-1 bg-white/90 text-forest-600 hover:bg-white hover:text-forest-800 transition-colors"
                              aria-label="Editar foto"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(item.id);
                              }}
                              className="rounded p-1 bg-white/90 text-emergency-600 hover:bg-white hover:text-emergency-800 transition-colors"
                              aria-label="Excluir foto"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-forest-600 text-center">
                      {album.photoCount} {album.photoCount === 1 ? "foto" : "fotos"} neste álbum
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {filteredAlbums.length === 0 && !loading && (
          <p className="text-center py-8 text-forest-700">
            {search || albumFilter !== "all"
              ? "Nenhum álbum encontrado."
              : "Nenhum álbum cadastrado ainda."}
          </p>
        )}
      </section>

      {editingAlbum && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Editar álbum"
          onClick={cancelEdit}
        >
          <form
            onSubmit={handleEditAlbumSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-forest-900">Editar álbum</h2>
              <button
                type="button"
                onClick={cancelEdit}
                aria-label="Fechar"
                className="rounded-md px-2 py-1 text-sm font-medium text-forest-800 transition-colors hover:bg-forest-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Image
              src={editingAlbum.coverUrl}
              alt={editingAlbum.title}
              width={400}
              height={200}
              className="mt-4 h-40 w-full rounded-lg object-cover"
            />

            <label className="mt-4 block text-sm font-medium text-forest-900">
              Título do álbum
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm font-normal text-forest-900 outline-none focus:border-forest-500"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-forest-900">
              Categoria
              <select
                value={editCategory}
                onChange={(e) =>
                  setEditCategory(e.target.value as GalleryCategory)
                }
                className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm font-normal text-forest-900 outline-none focus:border-forest-500"
              >
                {Object.entries(CATEGORIES).map(([value, c]) => (
                  <option key={value} value={value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm font-medium text-forest-900">
              Descrição
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm font-normal text-forest-900 outline-none focus:border-forest-500"
              />
            </label>

            {editMessage && (
              <p className="mt-3 text-sm text-emergency-600">{editMessage}</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-forest-200 px-4 py-2 text-sm font-medium text-forest-800 transition-colors hover:bg-forest-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={editSaving}
                className="rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editSaving ? "Salvando..." : "Salvar álbum"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}