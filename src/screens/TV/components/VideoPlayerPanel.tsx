import type { RefObject } from 'react';
import React from 'react';
import type { TvMedia } from '../types';

interface VideoPlayerPanelProps {
    media: TvMedia | null;
    hasMultipleItems: boolean;
    error: string | null;
    videoRef: RefObject<HTMLVideoElement | null>;
    onVideoEnded: () => void;
}

type HtmlVideoWithAudioTracks = HTMLVideoElement & {
    audioTracks?: ArrayLike<{ enabled: boolean }>;
};

const VideoPlayerPanel = ({ media, hasMultipleItems, error, videoRef, onVideoEnded }: VideoPlayerPanelProps) => {
    const enforceSilentPlayback = (element: HTMLVideoElement | null) => {
        if (!element) {
            return;
        }

        element.muted = true;
        element.defaultMuted = true;
        element.volume = 0;
        element.setAttribute('muted', '');

        const trackContainer = element as HtmlVideoWithAudioTracks;

        if (!trackContainer.audioTracks) {
            return;
        }

        for (let index = 0; index < trackContainer.audioTracks.length; index += 1) {
            const track = trackContainer.audioTracks[index];

            if (track) {
                track.enabled = false;
            }
        }
    };

    return (
        <div className="flex-[1.15] min-h-[160px] sm:min-h-[180px] lg:min-h-[200px] xl:min-h-[260px] 2xl:min-h-[300px] flex flex-col justify-end">
            <div className="w-full bg-blue-100/40 rounded-xl lg:rounded-2xl shadow-inner p-2 sm:p-2.5 flex justify-center items-center border border-blue-200 h-full min-h-0">
                {error ? (
                    <span className="text-red-500 text-[clamp(1rem,1.2vw,1.4rem)] text-center px-6">{error}</span>
                ) : media?.type === 'video' ? (
                    <video
                        ref={(el) => {
                            (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
                            enforceSilentPlayback(el);
                        }}
                        key={media.filename}
                        className="rounded-lg lg:rounded-xl w-full h-full object-cover min-h-[140px] max-h-[30vh] lg:max-h-[34vh] xl:max-h-[42vh] 2xl:max-h-[46vh]"
                        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                        src={media.url}
                        autoPlay
                        muted
                        loop={!hasMultipleItems}
                        playsInline
                        onLoadedMetadata={(event) => enforceSilentPlayback(event.currentTarget)}
                        onPlay={(event) => enforceSilentPlayback(event.currentTarget)}
                        onVolumeChange={(event) => enforceSilentPlayback(event.currentTarget)}
                        onEnded={onVideoEnded}
                        onPause={(event) => {
                            if (!hasMultipleItems) {
                                void event.currentTarget.play();
                            }
                        }}
                    />
                ) : media?.type === 'image' ? (
                    <img
                        key={media.filename}
                        src={media.url}
                        alt={media.filename}
                        className="rounded-lg lg:rounded-xl w-full h-full object-cover min-h-[140px] max-h-[30vh] lg:max-h-[34vh] xl:max-h-[42vh] 2xl:max-h-[46vh]"
                    />
                ) : (
                    <span className="text-slate-400 text-[clamp(1rem,1.2vw,1.4rem)] text-center">Nenhuma mídia disponível</span>
                )}
            </div>
        </div>
    );
};

export default VideoPlayerPanel;