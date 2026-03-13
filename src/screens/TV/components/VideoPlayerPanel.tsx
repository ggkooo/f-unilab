import type { RefObject } from 'react';
import type { TvVideo } from '../types';

interface VideoPlayerPanelProps {
    video: TvVideo | null;
    videoSource: string | null;
    error: string | null;
    videoRef: RefObject<HTMLVideoElement | null>;
    onVideoEnded: () => void;
}

const VideoPlayerPanel = ({ video, videoSource, error, videoRef, onVideoEnded }: VideoPlayerPanelProps) => {
    return (
        <div className="flex-grow flex flex-col justify-end">
            <div className="w-full bg-blue-100/40 rounded-2xl shadow-inner p-2 flex justify-center items-center border border-blue-200 h-full min-h-[320px] max-h-[600px]">
                {error ? (
                    <span className="text-red-500 text-xl text-center px-6">{error}</span>
                ) : video && videoSource ? (
                    <video
                        ref={videoRef}
                        key={video.filename}
                        className="rounded-xl w-full h-full object-cover min-h-[300px] max-h-[580px]"
                        src={videoSource}
                        autoPlay
                        muted
                        playsInline
                        onEnded={onVideoEnded}
                    />
                ) : (
                    <span className="text-slate-400 text-xl">Nenhum vídeo disponível</span>
                )}
            </div>
        </div>
    );
};

export default VideoPlayerPanel;