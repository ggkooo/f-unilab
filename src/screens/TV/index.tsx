
import { useEffect, useRef, useState } from 'react';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import { fetchRecentlyCalledTickets, fetchTvVideos } from '../../services/tvService';
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
            setVideosError(error instanceof Error ? error.message : 'Falha ao carregar os vídeos da TV.');
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

    return (
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 text-slate-800 h-dvh flex flex-col w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute -top-32 -left-32 w-[40vw] h-[40vw] bg-blue-200 opacity-30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-blue-100 opacity-20 rounded-full blur-2xl animate-pulse" />
            </div>

            <Header />

            <main className="flex-1 min-h-0 w-full grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] items-stretch justify-center p-3 sm:p-4 lg:p-6 2xl:p-8 gap-4 lg:gap-6 2xl:gap-8 z-10">
                <CurrentTicketPanel ticket={tickets[0] ?? null} isLoading={isLoadingTickets} error={ticketsError} />

                <div className="min-h-0 min-w-0 flex flex-col gap-4 lg:gap-6 2xl:gap-8">
                    <RecentCallsPanel tickets={tickets} isLoading={isLoadingTickets} error={ticketsError} />
                    <VideoPlayerPanel
                        video={videos[currentVideoIndex] ?? null}
                        error={videosError}
                        videoRef={videoRef}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Tv;
