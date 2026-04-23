import { useState, useEffect } from "react";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import { useEditMyFoundItemMutation, useCategoryQuery } from "../../redux/api/api";
import { ImageUpload } from "../../ui/ImageUpload";

interface FoundItemSnapshot {
  id: string;
  foundItemName: string;
  description: string;
  location: string;
  date: string;
  claimProcess?: string;
  img?: string;
  category?: { id: string; name: string };
}

interface Props {
  item: FoundItemSnapshot;
  onClose: () => void;
  onSuccess: () => void;
}

const inputCls =
  "w-full px-3 py-2.5 bg-gray-800/50 border border-red-900/40 hover:border-red-800/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/70 focus:border-yellow-500/60 transition-all duration-200 text-sm";

const EditFoundItemModal = ({ item, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState({
    foundItemName: item.foundItemName,
    description:   item.description,
    location:      item.location,
    date:          item.date ? new Date(item.date).toISOString().split("T")[0] : "",
    claimProcess:  item.claimProcess ?? "",
    categoryId:    item.category?.id ?? "",
  });
  const [imgUrl,      setImgUrl]      = useState(item.img ?? "");
  const [editError,   setEditError]   = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  const [editMyFoundItem, { isLoading }] = useEditMyFoundItemMutation();
  const { data: categoriesData }         = useCategoryQuery({});

  const today = new Date().toISOString().split("T")[0];

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editSuccess) return;
    setEditError(null);
    try {
      await editMyFoundItem({
        id:           item.id,
        foundItemName: form.foundItemName.trim(),
        description:  form.description.trim(),
        location:     form.location.trim(),
        claimProcess: form.claimProcess.trim(),
        categoryId:   form.categoryId || undefined,
        img:          imgUrl || item.img,
        date:         new Date(form.date).toISOString(),
      }).unwrap();
      setEditSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1400);
    } catch (err: any) {
      setEditError(err?.data?.message ?? "Failed to update. Please try again.");
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !isLoading) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLoading, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl glass-card rounded-xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/60">
          <div>
            <h2 className="text-xl font-bold gold-text">Edit Found Item</h2>
            <p className="text-xs text-gray-500 mt-0.5">Changes are saved immediately to your report.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-700/50 disabled:opacity-40"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form id="edit-found-item-form" onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Item name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Item Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.foundItemName}
                onChange={set("foundItemName")}
                required
                maxLength={120}
                placeholder="e.g. Black Leather Wallet"
                className={inputCls}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={set("description")}
                required
                placeholder="Describe the item in detail — color, brand, size, condition…"
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Category + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                <select value={form.categoryId} onChange={set("categoryId")} className={`${inputCls} cursor-pointer`}>
                  <option value="">— Select category —</option>
                  {([...(categoriesData as any)?.data ?? []] as any[])
                    .sort((a: any, b: any) => {
                      if (a.name.toLowerCase() === "others") return 1;
                      if (b.name.toLowerCase() === "others") return -1;
                      return a.name.localeCompare(b.name);
                    })
                    .map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Date Found <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={set("date")}
                  required
                  max={today}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.location}
                onChange={set("location")}
                required
                placeholder="e.g. CAFA Building, 2nd Floor Hallway"
                className={inputCls}
              />
            </div>

            {/* Claim instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                How to Claim Instructions
                <span className="ml-1.5 text-xs text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={form.claimProcess}
                onChange={set("claimProcess")}
                placeholder="Describe what the claimer must provide or do to retrieve this item…"
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Item Photo
                <span className="ml-1.5 text-xs text-gray-500 font-normal">
                  (hover over image to change or remove)
                </span>
              </label>
              <ImageUpload
                uploadedUrl={imgUrl || undefined}
                disabled={isLoading}
                onUploadComplete={(url) => setImgUrl(url)}
                onUploadClear={() => setImgUrl("")}
              />
            </div>

            {/* Feedback */}
            {editError && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-900/20 border border-red-500/40">
                <span className="text-red-400 mt-0.5 flex-shrink-0 text-sm">✕</span>
                <p className="text-sm text-red-300">{editError}</p>
              </div>
            )}
            {editSuccess && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-900/20 border border-green-500/40">
                <FaCheckCircle className="text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-300">Item updated successfully! Closing…</p>
              </div>
            )}
          </form>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-700/60">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/60 hover:bg-gray-600/60 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-found-item-form"
            disabled={isLoading || editSuccess}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-red-800 hover:bg-red-700 disabled:bg-red-900/50 disabled:cursor-not-allowed rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-1 focus:ring-offset-gray-900"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : editSuccess ? (
              <>
                <FaCheckCircle className="w-3.5 h-3.5" />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFoundItemModal;
