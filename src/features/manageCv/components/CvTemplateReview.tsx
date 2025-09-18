"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  ArrowsOutSimple,
  ArrowCounterClockwise,
} from "phosphor-react";
import html2canvas from "html2canvas";
import { getScaledHtml } from "../../../hooks/getScaledHtml";
import toast from "react-hot-toast";

type CvPreviewProps = {
  htmlContent: string;
  templateName: string;
  isDetail?: boolean; // nếu true thì ẩn nút chụp hình
  onScreenshot?: (image: File) => void;
};

export default function CvPreview({
  htmlContent,
  templateName,
  isDetail = false,
  onScreenshot,
}: CvPreviewProps) {
  const [zoom, setZoom] = useState(0.7);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const scaledHtml = useMemo(() => {
    return getScaledHtml(htmlContent, zoom, { templateType: templateName });
  }, [htmlContent, zoom, templateName]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.3));
  const resetZoom = () => setZoom(1.0);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  
  const toggleFullscreen = () => {
    const iframe = iframeRef.current;
    if (!document.fullscreenElement && iframe) {
      iframe
        .requestFullscreen()
        .catch((err) => console.log("Fullscreen failed:", err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleTakeScreenshot = async () => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      // Tạo một iframe ẩn với HTML gốc (không có zoom)
      const originalHtml = getScaledHtml(htmlContent, 1.0, {
        templateType: templateName,
      });

      const hiddenIframe = document.createElement("iframe");
      hiddenIframe.style.position = "fixed";
      hiddenIframe.style.top = "-9999px";
      hiddenIframe.style.left = "-9999px";
      hiddenIframe.style.width = "800px"; // Width rộng hơn để chứa content
      hiddenIframe.style.height = "1600px"; // Height cao hơn
      hiddenIframe.style.border = "none";
      hiddenIframe.setAttribute("sandbox", "allow-scripts allow-same-origin");

      document.body.appendChild(hiddenIframe);

      // Load HTML vào hidden iframe
      hiddenIframe.srcdoc = originalHtml;

      // Đợi iframe load xong
      await new Promise((resolve) => {
        hiddenIframe.onload = resolve;
      });

      // Đợi thêm một chút để đảm bảo CSS render xong
      await new Promise((resolve) => setTimeout(resolve, 500));

      const hiddenIframeDocument = hiddenIframe.contentWindow?.document;
      if (!hiddenIframeDocument) {
        document.body.removeChild(hiddenIframe);
        return;
      }

      const wrapper = hiddenIframeDocument.querySelector(
        ".preview-wrapper",
      ) as HTMLElement;
      if (!wrapper) {
        document.body.removeChild(hiddenIframe);
        return;
      }

      const contentWidth = wrapper.scrollWidth ;
      const contentHeight = wrapper.scrollHeight;

      // Chụp screenshot với kích thước chính xác của content
      const canvas = await html2canvas(wrapper, {
        useCORS: true,
        scale: 2,
        width: contentWidth,
        height: contentHeight,
        backgroundColor: "#000000", // Background đen
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        windowWidth: contentWidth,
        windowHeight: contentHeight,
      });

      // Xóa hidden iframe
      document.body.removeChild(hiddenIframe);

      // Xuất file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "preview.png", { type: "image/png" });
          onScreenshot?.(file);
          toast.success("Screenshot captured!");
        }
      }, "image/png");
    } catch (error) {
      console.error("Failed to take screenshot:", error);
      toast.error("Screenshot failed!");
    } finally {
      setScreenshotLoading(false);
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        const iframeDoc = iframe.contentDocument;
        if (iframeDoc) {
          const viewport = iframeDoc.querySelector('meta[name="viewport"]');
          if (viewport) {
            viewport.setAttribute(
              "content",
              `width=device-width, initial-scale=1.0, maximum-scale=${zoom}, user-scalable=no`,
            );
          }
        }
      } catch (e) {
        console.log("Cross-origin iframe access restricted");
      }
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [zoom]);

  return (
    <div className="flex flex-col h-full p-4 bg-gray-100 rounded-xl shadow-md">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">CV Preview</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.3}
            type="button"
            className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 disabled:opacity-40"
          >
            <MagnifyingGlassMinus size={20} />
          </button>
          <span className="px-3 py-1 text-sm bg-gray-50 rounded">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 2.0}
            type="button"
            className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 disabled:opacity-40"
          >
            <MagnifyingGlassPlus size={20} />
          </button>
          <button
            onClick={resetZoom}
            type="button"
            className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700"
          >
            <ArrowCounterClockwise size={18} /> Reset
          </button>
          <button
            onClick={toggleFullscreen}
            type="button"
            className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700"
          >
            <ArrowsOutSimple size={18} /> Fullscreen
          </button>
          {!isDetail && (
            <button
              type="button"
              onClick={handleTakeScreenshot}
              disabled={screenshotLoading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {screenshotLoading ? "Capturing..." : "Take Screenshot"}
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-hidden bg-gray-800 rounded-lg shadow-inner">
        <iframe
          ref={iframeRef}
          srcDoc={scaledHtml}
          className="w-full min-h-[70vh] border-0 rounded-lg bg-gray-800"
          title="CV Preview"
          aria-label="Preview of the selected CV template"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
