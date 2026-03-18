import React from 'react';
import type { ApiVideo } from '../../../services/adminService';
import { formatDateTime } from '../utils';

interface VideosSectionProps {
    videos: ApiVideo[];
    videosError: string | null;
    isLoadingVideos: boolean;
    deletingVideoName: string | null;
    onRefreshVideos: () => Promise<void>;
    onDeleteVideo: (filename: string) => void;
}

const VideosSection: React.FC<VideosSectionProps> = ({
    videos,
    videosError,
    isLoadingVideos,
    deletingVideoName,
    onRefreshVideos,
    onDeleteVideo,
}) => {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg lg:p-8">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Vídeos</h2>
                    <p className="text-sm text-slate-500">Visualize a biblioteca atual e remova arquivos quando necessário.</p>
                </div>
                <button
                    type="button"
                    onClick={() => void onRefreshVideos()}
                    className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                    Atualizar vídeos
                </button>
            </div>

            {videosError && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{videosError}</div>}

            <div className="grid gap-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800">Biblioteca de vídeos</h3>
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">{videos.length}</span>
                    </div>

                    <div className="max-h-[24rem] space-y-3 overflow-y-auto pr-1">
                        {isLoadingVideos && <div className="py-6 text-center text-slate-400 italic">Carregando vídeos...</div>}
                        {!isLoadingVideos && videos.length === 0 && <div className="py-6 text-center text-slate-400 italic">Nenhum vídeo encontrado.</div>}
                        {videos.map((video) => (
                            <div key={video.filename} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-bold text-slate-800">{video.filename}</div>
                                        <div className="mt-1 text-xs text-slate-500">{formatDateTime(video.created_at)}</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onDeleteVideo(video.filename)}
                                        disabled={deletingVideoName === video.filename}
                                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {deletingVideoName === video.filename ? 'Removendo...' : 'Remover'}
                                    </button>
                                </div>

                                {video.url && (
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-3 inline-flex rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-white"
                                    >
                                        Abrir vídeo
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideosSection;
