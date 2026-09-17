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

  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState<GalleryCategory>("cursos");
  const [editSaving, setEditSaving] = useState(false);
  const [editMessage, setEditMessage] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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
      setError(
        err instanceof Error ? err.message : "Falha ao carregar galeria."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching assíncrono
    void load();
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

  async function handleDelete(id: string) {
    if (!token) return;
    if (!window.confirm("Excluir este item?")) return;
    try {
      await deleteItem(token, id);
      await load();
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err instanceof Error ? err.message : "Falha ao excluir.");
      }
    }
  }

  function startEdit(item: GalleryItem) {
    setEditing(item);
    setEditTitle(item.title);
    setEditDescription(item.description ?? "");
    setEditCategory(item.category);
    setEditSaving(false);
    setEditMessage(null);
  }

  function cancelEdit() {
    setEditing(null);
    setEditMessage(null);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !editing) return;
    setEditSaving(true);
    setEditMessage(null);
    try {
      await updateItem(token, editing.id, {
        title: editTitle,
        description: editDescription,
        category: editCategory,
      });
      await load();
      setEditSaving(false);
      setEditing(null);
    } catch (err) {
      if (!handleAuthError(err)) {
        setEditMessage(err instanceof Error ? err.message : "Falha ao salvar.");
      }
      setEditSaving(false);
    }
  }

  const ITEMS_PER_PAGE = 12;

  const sortedItems = [...items].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  const term = search.trim().toLowerCase();
  const filteredItems = term
    ? sortedItems.filter(
        (i) =>
          i.title.toLowerCase().includes(term) ||
          (i.description ?? "").toLowerCase().includes(term)
      )
    : sortedItems;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(page, totalPages);
  const pagedItems = filteredItems.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">
            Nossos trabalhos
          </h1>
          <p className="text-sm text-forest-700">Administração da galeria.</p>
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
        className="mt-6 rounded-xl border border-forest-100 bg-white p-5 shadow-sm"
      >
        <h2 className="text-lg font-bold text-forest-900">Enviar imagens</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-forest-900">
            Título
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
          Descrição (opcional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm font-normal text-forest-900 outline-none focus:border-forest-500"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-forest-900">
          Arquivos
          <span className="ml-2 text-xs font-normal text-forest-600">
            (máx. 10MB por imagem)
          </span>
          <input
            ref={fileInputRef}
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
            {files.length} arquivo(s) selecionado(s) — serão otimizados
            automaticamente (redimensionados para 1600px, WebP, ~100–300KB).
          </p>
        )}

        <button
          type="submit"
          disabled={uploading || files.length === 0 || !token}
          className="mt-5 rounded-lg bg-forest-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Enviando..." : "Enviar imagens"}
        </button>

        {uploadMessage && (
          <p className="mt-3 text-sm text-forest-700" role="status">
            {uploadMessage}
          </p>
        )}
      </form>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-forest-900">
          Imagens ({filteredItems.length}
          {term ? ` de ${items.length}` : ""})
        </h2>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="Buscar por título..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-forest-200 py-2 pl-3 pr-8 text-sm text-forest-900 outline-none focus:border-forest-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-forest-500 hover:text-forest-800"
                aria-label="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>
          {totalPages > 1 && (
            <p className="text-xs text-forest-600">
              Página {safePage} de {totalPages}
            </p>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-emergency-600">{error}</p>}
        {loading && (
          <p className="mt-3 text-sm text-forest-700">Carregando...</p>
        )}

        {!loading && filteredItems.length === 0 && (
          <p className="mt-3 text-sm text-forest-700">
            {term
              ? "Nenhuma imagem encontrada."
              : "Nenhuma imagem cadastrada ainda."}
          </p>
        )}

        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {pagedItems.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-xl border border-forest-100 bg-white shadow-sm"
            >
              <Image
                src={itemImageUrl(item)}
                alt={item.title}
                width={400}
                height={160}
                className="h-32 w-full object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-forest-900">
                  {item.title}
                </p>
                <p className="text-xs text-forest-600">
                  {CATEGORIES[item.category].label}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="rounded-md border border-forest-300 px-2 py-1 text-xs font-medium text-forest-800 transition-colors hover:bg-forest-100"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-md border border-emergency-600 px-2 py-1 text-xs font-medium text-emergency-600 transition-colors hover:bg-emergency-600 hover:text-white"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="rounded-lg border border-forest-200 px-3 py-1.5 text-sm font-medium text-forest-800 transition-colors hover:bg-forest-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  n === safePage
                    ? "bg-forest-700 text-white"
                    : "border border-forest-200 text-forest-800 hover:bg-forest-100"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="rounded-lg border border-forest-200 px-3 py-1.5 text-sm font-medium text-forest-800 transition-colors hover:bg-forest-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próximo
            </button>
          </div>
        )}
      </section>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Editar item"
          onClick={cancelEdit}
        >
          <form
            onSubmit={handleEditSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-forest-900">Editar item</h2>
              <button
                type="button"
                onClick={cancelEdit}
                aria-label="Fechar"
                className="rounded-md px-2 py-1 text-sm font-medium text-forest-800 transition-colors hover:bg-forest-100"
              >
                ✕
              </button>
            </div>

            <Image
              src={itemImageUrl(editing)}
              alt={editing.title}
              width={400}
              height={160}
              className="mt-4 h-40 w-full rounded-lg object-cover"
            />

            <label className="mt-4 block text-sm font-medium text-forest-900">
              Título
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
                {editSaving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
