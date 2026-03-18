
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
    const alertAudioRef = useRef<HTMLAudioElement | null>(null);
    const previousTopTicketRef = useRef<TvTicket | null>(null);
    const previousTopTicketSignatureRef = useRef('');
    const hasHydratedTicketsRef = useRef(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const getTicketAlertSignature = (ticket: TvTicket | null) => {
        if (!ticket) {
            return '';
        }

        return [
            ticket.id,
            ticket.key,
            ticket.serviceType,
            ticket.counterName,
            ticket.updatedAt.getTime(),
            ticket.calledAt?.getTime() ?? 0,
        ].join(':');
    };

    const playTicketAlert = () => {
        const audio = alertAudioRef.current;

        if (!audio) {
            return;
        }

        // Some TV browsers keep stale media state; reset audio properties before every playback.
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
        audio.defaultMuted = false;
        audio.volume = 1;
        void audio.play().catch(() => {
            // Fallback to a fresh instance in case the original audio element became blocked.
            const fallbackAudio = new Audio('/assets/sound/sound.mp3');
            fallbackAudio.preload = 'auto';
            fallbackAudio.muted = false;
            fallbackAudio.defaultMuted = false;
            fallbackAudio.volume = 1;
            fallbackAudio.currentTime = 0;

            void fallbackAudio.play().catch(() => {
                // Ignore autoplay blocks silently to avoid interrupting the TV screen flow.
            });
        });
    };

    const refreshTickets = async (showLoading = false) => {
        if (showLoading) {
            setIsLoadingTickets(true);
        }

        try {
            const nextTickets = await fetchRecentlyCalledTickets();
            const nextTopTicket = nextTickets[0] ?? null;
            const nextTopTicketSignature = getTicketAlertSignature(nextTopTicket);

            if (hasHydratedTicketsRef.current) {
                if (
                    nextTopTicketSignature.length > 0
                    && nextTopTicketSignature !== previousTopTicketSignatureRef.current
                ) {
                    playTicketAlert();
                }
            } else {
                hasHydratedTicketsRef.current = true;
            }

            previousTopTicketRef.current = nextTopTicket;
            previousTopTicketSignatureRef.current = nextTopTicketSignature;

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
        const audio = new Audio('/assets/sound/sound.mp3');
        audio.preload = 'auto';
        audio.muted = false;
        audio.defaultMuted = false;
        audio.volume = 1;
        alertAudioRef.current = audio;

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

            if (alertAudioRef.current) {
                alertAudioRef.current.pause();
                alertAudioRef.current = null;
            }
        };
    }, []);

    return (
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 text-slate-800 h-screen max-h-screen flex flex-col w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute -top-32 -left-32 w-[40vw] h-[40vw] bg-blue-200 opacity-30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-blue-100 opacity-20 rounded-full blur-2xl animate-pulse" />
            </div>

            <div className="shrink-0">
                <Header />
            </div>

            <main className="flex-1 min-h-0 overflow-hidden w-full grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] items-stretch justify-center p-3 sm:p-4 lg:p-6 2xl:p-8 gap-4 lg:gap-6 2xl:gap-8 z-10">
                <CurrentTicketPanel ticket={tickets[0] ?? null} isLoading={isLoadingTickets} error={ticketsError} />

                <div className="min-h-0 min-w-0 overflow-hidden flex flex-col gap-4 lg:gap-6 2xl:gap-8">
                    <RecentCallsPanel tickets={tickets} isLoading={isLoadingTickets} error={ticketsError} />
                    <VideoPlayerPanel
                        video={videos[currentVideoIndex] ?? null}
                        error={videosError}
                        videoRef={videoRef}
                    />
                </div>
            </main>

            <div className="shrink-0">
                <Footer />
            </div>
        </div>
    );
};

export default Tv;
