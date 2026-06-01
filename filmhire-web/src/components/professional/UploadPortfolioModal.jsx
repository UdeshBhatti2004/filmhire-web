import React from "react";
import {Upload, X, Loader2} from "lucide-react";

function UploadPortfolioModal({
  showUploadModal,
  setShowUploadModal,
  newMediaTitle,
  setNewMediaTitle,
  newMediaTech,
  setNewMediaTech,
  selectedFile,
  handleFileChange,
  handleCreateMediaItem,
  isUploading,
}) {
  if (!showUploadModal) return null;

  return (
    <>
              <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-[#111116] border border-white/[0.08] max-w-sm w-full rounded-xl p-5 space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-white/[0.05] pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">Publish Project Object</h3>
                    <button onClick={() => !isUploading && setShowUploadModal(false)} className="text-neutral-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-neutral-400 block mb-1">Project Interface Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. KINETICA Typography Variant" 
                        value={newMediaTitle} 
                        onChange={(e) => setNewMediaTitle(e.target.value)} 
                        disabled={isUploading}
                        className="w-full bg-[#181822] border border-white/[0.06] h-8 rounded px-2.5 text-neutral-200 outline-none focus:border-indigo-500/40"
                      />
                    </div>
      
                    {/* TOOLS USED ARRAY MAP STRING STRING */}
                    <div>
                      <label className="text-neutral-400 block mb-1">Tools Required / Ecosystems Used <span className="text-neutral-600">(Comma Separated)</span></label>
                      <input 
                        type="text" 
                        placeholder="After Effects, Photoshop, Figma, Tailwind CSS" 
                        value={newMediaTech} 
                        onChange={(e) => setNewMediaTech(e.target.value)} 
                        disabled={isUploading}
                        className="w-full bg-[#181822] border border-white/[0.06] h-8 rounded px-2.5 text-neutral-200 outline-none focus:border-indigo-500/40"
                      />
                    </div>
      
                    <div>
                      <label className="text-neutral-400 block mb-1.5">Asset Source Binary File</label>
                      <input type="file" id="portfolio-file-input" accept="image/*,video/*" onChange={handleFileChange} disabled={isUploading} className="hidden" />
                      <label 
                        htmlFor="portfolio-file-input"
                        className="w-full h-20 border border-dashed border-white/10 hover:border-indigo-500/40 bg-black/40 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer text-neutral-400 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-neutral-500" />
                        <span className="text-[10px] px-3 max-w-full truncate text-center font-light">
                          {selectedFile ? selectedFile.name : "Select local storage target"}
                        </span>
                      </label>
                    </div>
                  </div>
      
                  <button 
                    onClick={handleCreateMediaItem} 
                    disabled={isUploading || !newMediaTitle.trim() || !selectedFile}
                    className="w-full h-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold text-xs rounded transition-all flex items-center justify-center gap-2"
                  >
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Publish Object</span>}
                  </button>
                </div>
              </div>
            
    </>
  );
}

export default UploadPortfolioModal;