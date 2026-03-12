
import { useEffect, useRef, useState } from 'react';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import Clock from '../../components/ui/Clock';
import { fetchRecentlyCalledTickets, fetchTvVideoBlob, fetchTvVideos } from '../../services/tvService';
import CurrentTicketPanel from './components/CurrentTicketPanel';
import RecentCallsPanel from './components/RecentCallsPanel';
import VideoPlayerPanel from './components/VideoPlayerPanel';
import type { TvTicket, TvVideo } from './types';
import { getTicketsSignature, getVideosSignature } from './utils';

const TICKETS_REFRESH_INTERVAL_MS = 5000;
const VIDEOS_REFRESH_INTERVAL_MS = 30000;

const Tv = () => {
    const [tickets, setTickets] = useState<TvTicket[]>([]);
    const [isLoadingTickets, setIsLoadingTickets] = useState(true);
    const [ticketsError, setTicketsError] = useState<string | null>(null);

    const [videos, setVideos] = useState<TvVideo[]>([]);
    const [videosError, setVideosError] = useState<string | null>(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [videoReloadToken, setVideoReloadToken] = useState(0);
    const [videoSource, setVideoSource] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const refreshTickets = async (showLoading = false) => {
        if (showLoading) {
            setIsLoadingTickets(true);
        }

        try {
            const nextTickets = await fetchRecentlyCalledTickets();

            setTicketsError(null);
            setTickets((previousTickets) => {
                if (getTicketsSignature(previousTickets) === getTicketsSignature(nextTickets)) {
                    return previousTickets;
                }

                return nextTickets;
            });
        } catch (error) {
            setTicketsError(error instanceof Error ? error.message : 'Falha ao carregar as senhas da TV.');
            setTickets((previousTickets) => {
                if (previousTickets.length === 0) {
                    return previousTickets;
                }

                return [];
            });
        } finally {
            if (showLoading) {
                setIsLoadingTickets(false);
            }
        }
    };

    const refreshVideos = async () => {
        try {
            const nextVideos = await fetchTvVideos();

            setVideosError(null);
            setVideos((previousVideos) => {
                if (getVideosSignature(previousVideos) === getVideosSignature(nextVideos)) {
                    return previousVideos;
                }

                return nextVideos;
            });

            setCurrentVideoIndex((previousIndex) => {
                if (nextVideos.length === 0) {
                    return 0;
                }

                return previousIndex >= nextVideos.length ? 0 : previousIndex;
            });
        } catch (error) {
            setVideosError(error instanceof Error ? error.message : 'Falha ao carregar os videos da TV.');
            setVideos((previousVideos) => {
                if (previousVideos.length === 0) {
                    return previousVideos;
                }

                return [];
            });
            setCurrentVideoIndex(0);
        }
    };

    useEffect(() => {
        void refreshTickets(true);
        void refreshVideos();

        const ticketsInterval = window.setInterval(() => {
            void refreshTickets();
        }, TICKETS_REFRESH_INTERVAL_MS);

        const videosInterval = window.setInterval(() => {
            void refreshVideos();
        }, VIDEOS_REFRESH_INTERVAL_MS);

        return () => {
            window.clearInterval(ticketsInterval);
            window.clearInterval(videosInterval);
        };
    }, []);

    useEffect(() => {
        const currentVideo = videos[currentVideoIndex];

        if (!currentVideo) {
            setVideoSource(null);
            return;
        }

        let isCancelled = false;
        let objectUrl: string | null = null;

        const loadVideo = async () => {
            setVideoSource(null);

            try {
                const blob = await fetchTvVideoBlob(currentVideo.filename);

                if (isCancelled) {
                    return;
                }

                objectUrl = URL.createObjectURL(blob);
                setVideosError(null);
                setVideoSource(objectUrl);
            } catch (error) {
                if (isCancelled) {
                    return;
                }

                setVideosError(error instanceof Error ? error.message : 'Falha ao carregar o video atual.');
                setVideoSource(null);
            }
        };

        void loadVideo();

        return () => {
            isCancelled = true;

            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [currentVideoIndex, videoReloadToken, videos]);

    const handleVideoEnded = () => {
        if (videos.length <= 1) {
            setVideoReloadToken((previous) => previous + 1);
            return;
        }

        setCurrentVideoIndex((previous) => (previous + 1) % videos.length);
    };

    return (
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 text-slate-800 min-h-screen flex flex-col w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute -top-32 -left-32 w-[40vw] h-[40vw] bg-blue-200 opacity-30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-blue-100 opacity-20 rounded-full blur-2xl animate-pulse" />
            </div>

            <Header />

            <div className="z-10 flex justify-center mt-4 mb-2">
                <Clock />
            </div>

            <main className="flex-grow w-full flex flex-col lg:flex-row items-stretch justify-center p-6 lg:p-10 gap-8 h-full z-10">
                <CurrentTicketPanel ticket={tickets[0] ?? null} isLoading={isLoadingTickets} error={ticketsError} />

                <div className="flex-1 flex flex-col gap-8 min-w-0">
                    <RecentCallsPanel tickets={tickets} isLoading={isLoadingTickets} error={ticketsError} />
                    <VideoPlayerPanel
                        video={videos[currentVideoIndex] ?? null}
                        videoSource={videoSource}
                        error={videosError}
                        videoRef={videoRef}
                        onVideoEnded={handleVideoEnded}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Tv;
