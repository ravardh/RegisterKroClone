import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "../../config/api";

const backendBase = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
const assetUrl = (p) => (p ? `${backendBase}${p.startsWith("/") ? p : `/${p}`}` : "");

const emptyForm = {
  isActive: false,
  alt: "Special Offer",
  badgeText: "🎉 Special Offer",
  tabLabel: "🎉 Offer",
  tagline: "Limited time deal — don't miss it!",
  ctaText: "Explore Now",
  ctaLink: "/services",
  delay: "1200",
};

const OfferManage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef(null);

  const fetchOffer = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/special-offer");
      const data = res.data.data || {};
      setForm({
        isActive: !!data.isActive,
        alt: data.alt || emptyForm.alt,
        badgeText: data.badgeText || emptyForm.badgeText,
        tabLabel: data.tabLabel || emptyForm.tabLabel,
        tagline: data.tagline || emptyForm.tagline,
        ctaText: data.ctaText || emptyForm.ctaText,
        ctaLink: data.ctaLink || emptyForm.ctaLink,
        delay: String(data.delay ?? emptyForm.delay),
      });
      setCurrentImageUrl(data.imageUrl || "");
      setRemoveImage(false);
      setImageFile(null);
    } catch (err) {
      console.error("fetchOffer", err);
      toast.error(err.response?.data?.message || "Failed to load special offer settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffer();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const clearImageSelection = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.isActive && !currentImageUrl && !imageFile) {
      toast.error("Upload an offer banner image before enabling the offer");
      return;
    }

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("isActive", form.isActive ? "true" : "false");
      fd.append("alt", form.alt.trim());
      fd.append("badgeText", form.badgeText.trim());
      fd.append("tabLabel", form.tabLabel.trim());
      fd.append("tagline", form.tagline.trim());
      fd.append("ctaText", form.ctaText.trim());
      fd.append("ctaLink", form.ctaLink.trim());
      fd.append("delay", form.delay.trim());
      fd.append("removeImage", removeImage ? "true" : "false");
      if (imageFile) {
        fd.append("image", imageFile);
      }

      const res = await axios.put("/admin/special-offer", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data.data || {};
      setCurrentImageUrl(data.imageUrl || "");
      setRemoveImage(false);
      clearImageSelection();
      toast.success("Special offer settings saved");
    } catch (err) {
      console.error("saveOffer", err);
      toast.error(err.response?.data?.message || "Failed to save special offer settings");
    } finally {
      setSaving(false);
    }
  };

  const previewImageSrc = imagePreviewUrl
    || (removeImage ? "" : assetUrl(currentImageUrl));

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500 font-medium">Loading special offer settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Special Offer</h1>
        <p className="text-gray-500 mt-1">
          Control the floating promotional banner on the home page
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-6 max-w-3xl"
      >
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">Show offer banner</p>
            <p className="text-xs text-gray-500 mt-0.5">
              When enabled, visitors see the peek banner on the home page
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Banner image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              setImageFile(e.target.files?.[0] || null);
              setRemoveImage(false);
            }}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {previewImageSrc ? (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  {imagePreviewUrl ? "Preview (new image)" : "Current banner"}
                </p>
                <img
                  src={previewImageSrc}
                  alt="Offer banner preview"
                  className="max-w-xs w-full rounded-xl border-2 border-indigo-100 shadow-md bg-gray-50"
                />
              </div>
              <div className="flex flex-col gap-2 self-start sm:self-center">
                {imagePreviewUrl && (
                  <button
                    type="button"
                    onClick={clearImageSelection}
                    className="text-sm font-semibold text-red-600 hover:text-red-800"
                  >
                    Remove selected file
                  </button>
                )}
                {currentImageUrl && !imagePreviewUrl && (
                  <button
                    type="button"
                    onClick={() => setRemoveImage(true)}
                    className="text-sm font-semibold text-red-600 hover:text-red-800"
                  >
                    Remove current image
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-2">
              Upload a JPG, PNG, WEBP, or GIF (max 5 MB). Required when the offer is active.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image alt text</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={form.alt}
              onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Show delay (ms)</label>
            <input
              type="number"
              min="0"
              step="100"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={form.delay}
              onChange={(e) => setForm((f) => ({ ...f, delay: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Peek tab label</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={form.tabLabel}
              onChange={(e) => setForm((f) => ({ ...f, tabLabel: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Badge text</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={form.badgeText}
              onChange={(e) => setForm((f) => ({ ...f, badgeText: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tagline</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={form.tagline}
            onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Button text</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={form.ctaText}
              onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Button link</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={form.ctaLink}
              onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
              placeholder="/services"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-md disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferManage;
