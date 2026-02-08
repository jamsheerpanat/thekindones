"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HeroManagementPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [settings, setSettings] = useState({
        title: "",
        subtitle: "",
        image: "",
        promoText: "",
        primaryBtn: "",
        primaryUrl: "",
        secondaryBtn: "",
        secondaryUrl: "",
    });

    useEffect(() => {
        fetch("/tko/api/admin/hero")
            .then((res) => res.json())
            .then((data) => {
                if (data) setSettings(data);
                setLoading(false);
            });
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/tko/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setSettings({ ...settings, image: data.url });
            } else {
                alert(data.error || "Upload failed");
            }
        } catch (error) {
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/tko/api/admin/hero", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                router.refresh();
                alert("Hero settings updated!");
            }
        } catch (error) {
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card p-6">
            <h2 className="text-2xl font-bold mb-2">Hero Management</h2>
            <p className="text-ink-500 mb-6 text-sm">Update the main banner text, image, and call-to-action buttons.</p>

            <form onSubmit={handleSubmit} className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Hero Title</label>
                        <input
                            type="text"
                            className="input bg-ink-50 border-none rounded-xl"
                            value={settings.title}
                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Promo Text</label>
                        <input
                            type="text"
                            className="input bg-ink-50 border-none rounded-xl"
                            value={settings.promoText}
                            onChange={(e) => setSettings({ ...settings, promoText: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Hero Subtitle</label>
                    <textarea
                        className="input bg-ink-50 border-none rounded-xl min-h-[100px] py-3"
                        value={settings.subtitle}
                        onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                    />
                </div>

                {/* Hero Image Section */}
                <div className="flex flex-col gap-3 p-4 border-2 border-dashed border-ink-100 rounded-2xl bg-ink-50/30">
                    <label className="text-sm font-semibold">Hero Image</label>

                    {settings.image && (
                        <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border border-ink-100 bg-white">
                            <Image
                                src={settings.image}
                                alt="Hero Preview"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setSettings({ ...settings, image: "" })}
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm text-red-500 transition-colors"
                                title="Remove image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn btn-outline bg-white"
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : settings.image ? "Change Image" : "Upload Hero Image"}
                        </button>
                        <div className="flex flex-col">
                            <span className="text-xs text-ink-400 font-medium">Recommend: 1920x800px or wider</span>
                            {settings.image && !settings.image.startsWith('http') && (
                                <span className="text-[10px] text-brand-600 font-mono mt-0.5 truncate max-w-[200px]">{settings.image}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-2">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-ink-300">Or use a direct URL</label>
                        <input
                            type="text"
                            className="input bg-white border border-ink-100 rounded-xl text-xs h-9"
                            placeholder="https://images.unsplash.com/..."
                            value={settings.image}
                            onChange={(e) => setSettings({ ...settings, image: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 border-t border-ink-100 pt-6">
                    <div className="grid gap-4">
                        <h4 className="font-semibold text-sm">Primary Button</h4>
                        <input
                            type="text"
                            placeholder="Label"
                            className="input bg-ink-50 border-none rounded-xl"
                            value={settings.primaryBtn}
                            onChange={(e) => setSettings({ ...settings, primaryBtn: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="URL"
                            className="input bg-ink-50 border-none rounded-xl"
                            value={settings.primaryUrl}
                            onChange={(e) => setSettings({ ...settings, primaryUrl: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-4">
                        <h4 className="font-semibold text-sm">Secondary Button</h4>
                        <input
                            type="text"
                            placeholder="Label"
                            className="input bg-ink-50 border-none rounded-xl"
                            value={settings.secondaryBtn}
                            onChange={(e) => setSettings({ ...settings, secondaryBtn: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="URL"
                            className="input bg-ink-50 border-none rounded-xl"
                            value={settings.secondaryUrl}
                            onChange={(e) => setSettings({ ...settings, secondaryUrl: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="btn btn-primary px-8" disabled={saving || uploading}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
