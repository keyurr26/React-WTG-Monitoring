// imagePreloader.js

/**
 * Fetch an image URL and return a base64 data URL.
 *
 * Key points:
 *  - Fetches the blob in the browser (handles CORS if server allows).
 *  - Decodes it with an <img> (browser natively decodes WebP/AVIF/etc).
 *  - Re-encodes as JPEG via <canvas> because @react-pdf/renderer
 *    does NOT reliably embed WebP/AVIF images.
 *  - Downscales to MAX_WIDTH to keep the PDF small.
 *
 * Returns null on any failure so the PDF shows "No Photo".
 */
export const urlToBase64 = async (url) => {
    if (!url || typeof url !== "string") return null;

    // Already a data URL — but could still be webp. Re-encode to be safe.
    if (url.startsWith("data:")) {
        return await reencodeToJpeg(url);
    }

    try {
        const res = await fetch(url, {
            mode: "cors",
            // credentials: "include", // uncomment if your media server needs auth cookies
            // headers: { Authorization: `Bearer ${token}` }, // uncomment if token needed
        });

        if (!res.ok) {
            console.warn("❌ Image fetch failed:", url, "status:", res.status);
            return null;
        }

        const blob = await res.blob();

        // Convert blob → data URL
        const rawDataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("FileReader failed"));
            reader.readAsDataURL(blob);
        });

        // Re-encode through canvas → guaranteed JPEG
        const jpegDataUrl = await reencodeToJpeg(rawDataUrl);

        if (jpegDataUrl) {
            console.log("✅ Converted:", url, "→ jpeg", `(${blob.size} bytes src)`);
            return jpegDataUrl;
        }
        console.warn("⚠️ Canvas re-encode failed, using raw data URL:", url);
        return rawDataUrl;
    } catch (err) {
        console.warn("❌ Image preload error:", url, err);
        return null;
    }
};

/**
 * Decode any image data URL via <img> and re-draw onto a canvas,
 * then export as JPEG. This is what makes WebP work in @react-pdf/renderer.
 */
const reencodeToJpeg = (dataUrl, maxWidth = 800, quality = 0.85) => {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                const scale = img.width > maxWidth ? maxWidth / img.width : 1;
                canvas.width = Math.max(1, Math.round(img.width * scale));
                canvas.height = Math.max(1, Math.round(img.height * scale));

                const ctx = canvas.getContext("2d");
                // White background so transparent PNGs don't come out black
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const jpeg = canvas.toDataURL("image/jpeg", quality);
                resolve(jpeg);
            } catch (e) {
                console.warn("Canvas encode error:", e);
                resolve(null);
            }
        };

        img.onerror = () => {
            console.warn("Image decode error for:", dataUrl.slice(0, 80));
            resolve(null);
        };

        img.src = dataUrl;
    });
};

// All photo-bearing fields across your sections
const PHOTO_FIELDS = [
    "evidence_photo",
    "batching_slip",
    "start_photo",
    "end_photo",
    "l1_photo",
    "l2_photo",
    "l3_photo",
    "photo", // road section
    "line_photo", // electrical
];

/**
 * Walk through activitySections and convert every photo URL to base64 (JPEG).
 * Preserves the rest of each item.
 */
export const preloadSectionImages = async (sections) => {
    const processed = await Promise.all(
        sections.map(async (section) => {
            const data = await Promise.all(
                section.data.map(async (item) => {
                    const clone = { ...item
                    };

                    await Promise.all(
                        PHOTO_FIELDS.map(async (field) => {
                            const val = clone[field];
                            if (val && typeof val === "string") {
                                const converted = await urlToBase64(val);
                                // Only overwrite if conversion succeeded, else keep null
                                // (so PDF shows "No Photo" instead of a broken URL)
                                clone[field] = converted || null;
                            }
                        })
                    );

                    return clone;
                })
            );

            return { ...section,
                data
            };
        })
    );

    return processed;
};