"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string | null;
  stock: number;
  slug: string;
  created_at?: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: string;
  stock: string;
  slug: string;
}

const INITIAL_FORM: ProductFormData = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  category: "Electronics",
  stock: "10",
  slug: "",
};

const CATEGORIES = [
  "Electronics",
  "Accessories",
  "Lifestyle",
  "Kitchen",
  "Clothing",
  "General",
];

export default function AdminProductsPage() {
  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [errorMsg, setErrorMsg]       = useState("");
  const [successMsg, setSuccessMsg]   = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [formData, setFormData]         = useState<ProductFormData>(INITIAL_FORM);
  const [submitting, setSubmitting]     = useState(false);

  // Delete confirmation modal state
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting]           = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load products");
      setProducts(data.products ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load products";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function openAddModal() {
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url ?? "",
      category: product.category ?? "General",
      stock: product.stock.toString(),
      slug: product.slug,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(INITIAL_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.description.trim()) {
      setErrorMsg("Name, price, and description are required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const url = editingId
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save product.");

      setSuccessMsg(
        editingId ? "Product updated successfully." : "Product created successfully."
      );
      closeModal();
      await fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save product.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingProduct) return;
    setIsDeleting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/products/${deletingProduct.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to delete product.");

      setSuccessMsg(`"${deletingProduct.name}" deleted successfully.`);
      setDeletingProduct(null);
      await fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete product.";
      setErrorMsg(msg);
    } finally {
      setIsDeleting(false);
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Product Management
          </h2>
          <p className="text-sm text-muted">
            Add, update, or remove inventory items from your catalog.
          </p>
        </div>

        <button
          type="button"
          id="admin-add-product-btn"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Product
        </button>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
          <p className="flex-1 font-medium">{successMsg}</p>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          <p className="flex-1 font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Filter products"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-primary/60 transition-colors"
        />
      </div>

      {/* Products Table (Desktop) / Cards (Mobile) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted">
          <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          <p className="text-sm">Loading products catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-2xl border border-border text-center px-4 gap-3">
          <Package className="w-10 h-10 text-muted" aria-hidden="true" />
          <p className="font-semibold text-foreground">No products found</p>
          <p className="text-sm text-muted max-w-sm">
            {search ? "No products match your search query." : "Get started by adding your first product to the store."}
          </p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm" aria-label="Products list">
              <thead className="bg-background/50 border-b border-border text-xs uppercase tracking-wider text-muted font-semibold">
                <tr>
                  <th scope="col" className="px-6 py-4">Product</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Price</th>
                  <th scope="col" className="px-6 py-4">Stock</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-background/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-border bg-background">
                          <Image
                            src={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80"}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-xs">{product.name}</p>
                          <p className="text-xs text-muted truncate max-w-xs">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        {product.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          product.stock > 0
                            ? "bg-success/10 text-success border border-success/20"
                            : "bg-error/10 text-error border border-error/20"
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          aria-label={`Edit ${product.name}`}
                          className="p-2 rounded-lg bg-background border border-border text-muted hover:text-foreground hover:border-primary/50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingProduct(product)}
                          aria-label={`Delete ${product.name}`}
                          className="p-2 rounded-lg bg-background border border-border text-muted hover:text-error hover:border-error/50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden divide-y divide-border">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-background">
                    <Image
                      src={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80"}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm line-clamp-1">{product.name}</p>
                    <p className="text-xs text-primary font-bold">₹{product.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                    {product.category || "General"}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${product.stock > 0 ? "text-success bg-success/10 border border-success/20" : "text-error bg-error/10 border border-error/20"}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => openEditModal(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-background border border-border text-xs font-semibold text-foreground hover:border-primary/50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingProduct(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-background border border-border text-xs font-semibold text-error hover:border-error/50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl p-6 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-bold text-foreground">
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-lg bg-background border border-border text-muted hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label htmlFor="product-name" className="block text-xs font-semibold text-muted mb-1">
                  Product Name <span className="text-error">*</span>
                </label>
                <input
                  id="product-name"
                  type="text"
                  required
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((f) => ({
                      ...f,
                      name,
                      slug: !editingId ? name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : f.slug,
                    }));
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="product-slug" className="block text-xs font-semibold text-muted mb-1">
                  URL Slug
                </label>
                <input
                  id="product-slug"
                  type="text"
                  placeholder="wireless-noise-cancelling-headphones"
                  value={formData.slug}
                  onChange={(e) => setFormData((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label htmlFor="product-price" className="block text-xs font-semibold text-muted mb-1">
                    Price (₹) <span className="text-error">*</span>
                  </label>
                  <input
                    id="product-price"
                    type="number"
                    min="0"
                    step="1"
                    required
                    placeholder="2999"
                    value={formData.price}
                    onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label htmlFor="product-stock" className="block text-xs font-semibold text-muted mb-1">
                    Stock Quantity
                  </label>
                  <input
                    id="product-stock"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="50"
                    value={formData.stock}
                    onChange={(e) => setFormData((f) => ({ ...f, stock: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="product-category" className="block text-xs font-semibold text-muted mb-1">
                  Category
                </label>
                <select
                  id="product-category"
                  value={formData.category}
                  onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="product-image" className="block text-xs font-semibold text-muted mb-1">
                  Image URL
                </label>
                <input
                  id="product-image"
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image_url}
                  onChange={(e) => setFormData((f) => ({ ...f, image_url: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="product-desc" className="block text-xs font-semibold text-muted mb-1">
                  Description <span className="text-error">*</span>
                </label>
                <textarea
                  id="product-desc"
                  rows={3}
                  required
                  placeholder="Detailed product features and specifications..."
                  value={formData.description}
                  onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl bg-background border border-border text-sm font-semibold text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      Saving...
                    </>
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl p-6 text-center space-y-6">
            <span className="w-16 h-16 rounded-2xl bg-error/10 border border-error/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8 text-error" aria-hidden="true" />
            </span>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Delete Product?</h3>
              <p className="text-sm text-muted leading-relaxed">
                Are you sure you want to delete <strong className="text-foreground">"{deletingProduct.name}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-background border border-border text-sm font-semibold text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-error text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    Deleting...
                  </>
                ) : (
                  "Delete Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
