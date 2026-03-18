import type { RefObject } from 'react';
import type { TvVideo } from '../types';

interface VideoPlayerPanelProps {
    video: TvVideo | null;
    error: string | null;
    videoRef: RefObject<HTMLVideoElement | null>;
}

const VideoPlayerPanel = ({ video, error, videoRef }: VideoPlayerPanelProps) => {
    const enforceSilentPlayback = (element: HTMLVideoElement | null) => {
        if (!element) {
            return;
        }

        element.muted = true;
        element.defaultMuted = true;
        element.volume = 0;
    };

    return (
        <div className="flex-[1.15] min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] flex flex-col justify-end">
            <div className="w-full bg-blue-100/40 rounded-xl lg:rounded-2xl shadow-inner p-2 sm:p-2.5 flex justify-center items-center border border-blue-200 h-full min-h-0">
                {error ? (
                    <span className="text-red-500 text-[clamp(1rem,1.2vw,1.4rem)] text-center px-6">{error}</span>
                ) : video ? (
                    <video
                        ref={videoRef}
                        key={video.filename}
                        className="rounded-lg lg:rounded-xl w-full h-full object-cover min-h-[200px] max-h-[44vh] 2xl:max-h-[46vh]"
                        src={video.url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onLoadedMetadata={(event) => enforceSilentPlayback(event.currentTarget)}
                        onPlay={(event) => enforceSilentPlayback(event.currentTarget)}
                        onVolumeChange={(event) => enforceSilentPlayback(event.currentTarget)}
                    />
                ) : (
                    <span className="text-slate-400 text-[clamp(1rem,1.2vw,1.4rem)] text-center">Nenhum vídeo disponível</span>
                )}
            </div>
        </div>
    );
};

export default VideoPlayerPanel;