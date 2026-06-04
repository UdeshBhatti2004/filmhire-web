import React from "react";
import { Upload, X, Loader2, Film, ImageIcon, Check } from "lucide-react";

function UploadPortfolioModal({
  showUploadModal,
  setShowUploadModal,
  title,
  setTitle,
  category,
  setCategory,
  thumbnailFile,
  videoFile,
  handleThumbnailChange,
  handleVideoChange,
  handleCreateMediaItem,
  isUploading,
}) {
  if (!showUploadModal) return null;

  // Prevent accidental backdrop closing if large file upload is mid-flight
  const handleBackdropClick = () => {
    if (!isUploading) {
      setShowUploadModal(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-[#0e0e11] border border-neutral-800/80 max-w-md w-full rounded-2xl p-6 space-y-6 text-left shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center border-b border-neutral-800/60 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold tracking-tight text-white">
              Publish New Project
            </h3>
            <p className="text-[11px] text-neutral-500">
              Add your media project files to your public portfolio index.
            </p>
          </div>
          <button
            onClick={() => !isUploading && setShowUploadModal(false)}
            disabled={isUploading}
            className="text-neutral-500 hover:text-white p-1 rounded-lg hover:bg-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-500 transition-all"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* INPUT FORM FIELDS */}
        <div className="space-y-4 text-xs">
          
          {/* TITLE INPUT */}
          <div className="space-y-1.5">
            <label className="text-neutral-400 font-medium tracking-wide block">
              Project Title
            </label>
            <input
              type="text"
              placeholder="e.g., Summer Fashion Campaign Reel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              className="w-full bg-neutral-900/60 border border-neutral-800 h-9 rounded-lg px-3 text-neutral-200 outline-none focus:border-neutral-500 transition-colors disabled:opacity-50 font-sans text-xs"
            />
          </div>

          {/* CATEGORY INPUT */}
          <div className="space-y-1.5">
            <label className="text-neutral-400 font-medium tracking-wide block">
              Category Focus
            </label>
            <input
              type="text"
              placeholder="e.g., Cinematography, Color Grading"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isUploading}
              className="w-full bg-neutral-900/60 border border-neutral-800 h-9 rounded-lg px-3 text-neutral-200 outline-none focus:border-neutral-500 transition-colors disabled:opacity-50 font-sans text-xs"
            />
          </div>

          {/* TWO-COLUMN FILE ATTACHMENTS */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            
            {/* THUMBNAIL ATTACHMENT */}
            <div className="space-y-1.5">
              <label className="text-neutral-400 font-medium tracking-wide block">
                Cover Thumbnail
              </label>
              <input
                type="file"
                id="modal-thumbnail-input"
                accept="image/*"
                onChange={handleThumbnailChange}
                disabled={isUploading}
                className="hidden"
              />
              <label
                htmlFor="modal-thumbnail-input"
                className={`h-24 border rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-all p-2 select-none group
                  ${thumbnailFile 
                    ? "border-neutral-700 bg-neutral-900/40 text-neutral-200" 
                    : "border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950/40 hover:bg-neutral-900/20 text-neutral-500 hover:text-neutral-400"
                  } ${isUploading ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
              >
                {thumbnailFile ? (
                  <>
                    <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] font-medium max-w-full truncate px-1">
                      {thumbnailFile.name}
                    </span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                    <span className="text-[10px] font-light">Select Image</span>
                  </>
                )}
              </label>
            </div>

            {/* VIDEO FILE ATTACHMENT */}
            <div className="space-y-1.5">
              <label className="text-neutral-400 font-medium tracking-wide block">
                Source Video Asset
              </label>
              <input
                type="file"
                id="modal-video-input"
                accept="video/*"
                onChange={handleVideoChange}
                disabled={isUploading}
                className="hidden"
              />
              <label
                htmlFor="modal-video-input"
                className={`h-24 border rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-all p-2 select-none group
                  ${videoFile 
                    ? "border-neutral-700 bg-neutral-900/40 text-neutral-200" 
                    : "border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950/40 hover:bg-neutral-900/20 text-neutral-500 hover:text-neutral-400"
                  } ${isUploading ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
              >
                {videoFile ? (
                  <>
                    <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] font-medium max-w-full truncate px-1">
                      {videoFile.name}
                    </span>
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                    <span className="text-[10px] font-light">Select Video</span>
                  </>
                )}
              </label>
            </div>

          </div>
        </div>

        {/* SUBMIT CONTROLLERS */}
        <div className="pt-2">
          <button
            onClick={handleCreateMediaItem}
            disabled={
              isUploading || !title.trim() || !thumbnailFile || !videoFile
            }
            className="w-full h-10 bg-white text-black disabled:bg-neutral-900 disabled:text-neutral-600 border disabled:border-neutral-800 border-white hover:bg-neutral-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                <span>Uploading Assets to Network...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Publish Project</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPortfolioModal;