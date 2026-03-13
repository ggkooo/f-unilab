import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { clearAuthSession, getAccessToken, getAuthSession } from '../../auth/session';
import {
    cancelTicket,
    callTicket,
    completeTicket,
    fetchCompletedTickets,
    fetchWaitingTickets,
    recallTicket,
} from '../../services/attendantService';
import AttendantTopBar from './components/AttendantTopBar';
import CurrentAttendanceCard from './components/CurrentAttendanceCard';
import HistorySection from './components/HistorySection';
import WaitingQueueSection from './components/WaitingQueueSection';
import type { Ticket } from './types';
import { ALL_SERVICE_TYPES, getHistorySignature, getQueueSignature } from './utils';

const Attendant: React.FC = () => {
    const navigate = useNavigate();
    const [queue, setQueue] = useState<Ticket[]>([]);
    const [history, setHistory] = useState<Ticket[]>([]);
    const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
    const [selectedType, setSelectedType] = useState<string>(ALL_SERVICE_TYPES);
    const [isLoadingQueue, setIsLoadingQueue] = useState(true);
    const [callingTicketId, setCallingTicketId] = useState<string | null>(null);
    const [isRecallingCurrentTicket, setIsRecallingCurrentTicket] = useState(false);
    const [isCompletingCurrentTicket, setIsCompletingCurrentTicket] = useState(false);
    const [isCancellingCurrentTicket, setIsCancellingCurrentTicket] = useState(false);
    const [clockTick, setClockTick] = useState(0);

    const loggedCounter = getAuthSession()?.data?.user?.login ?? 'Guichê não identificado';

    const serviceTypeOptions = useMemo(
        () => [
            { label: 'Próxima Senha (Qualquer)', value: ALL_SERVICE_TYPES },
            ...Array.from(new Set(queue.map((ticket) => ticket.serviceType))).map((serviceType) => ({
                label: serviceType,
                value: serviceType,
            })),
        ],
        [queue],
    );

    const refreshCompletedHistory = async () => {
        try {
            const completedTickets = await fetchCompletedTickets(loggedCounter);

            setHistory((prev) => {
                const previousSignature = getHistorySignature(prev);
                const nextSignature = getHistorySignature(completedTickets);

                return previousSignature === nextSignature ? prev : completedTickets;
            });
        } catch (error) {
            console.error(error);
            setHistory((prev) => (prev.length === 0 ? prev : []));
        }
    };

    const refreshQueue = async (showLoading = false) => {
        if (showLoading) {
            setIsLoadingQueue(true);
        }

        try {
            const waitingTickets = await fetchWaitingTickets();

            setQueue((prev) => {
                const previousSignature = getQueueSignature(prev);
                const nextSignature = getQueueSignature(waitingTickets);

                return previousSignature === nextSignature ? prev : waitingTickets;
            });
        } catch (error) {
            console.error(error);
            setQueue((prev) => (prev.length === 0 ? prev : []));
        } finally {
            if (showLoading) {
                setIsLoadingQueue(false);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setClockTick((prev) => prev + 1);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        void refreshQueue(true);
        void refreshCompletedHistory();

        const interval = setInterval(() => {
            void refreshQueue();
            void refreshCompletedHistory();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const callTicketAtIndex = async (ticketIndex: number, emptyMessage: string) => {
        if (ticketIndex === -1) {
            alert(emptyMessage);
            return;
        }

        const accessToken = getAccessToken();

        if (!accessToken) {
            alert('Sua sessão expirou. Faça login novamente.');
            return;
        }

        const selectedTicket = queue[ticketIndex];

        if (!selectedTicket) {
            alert('Senha selecionada não está mais na fila.');
            return;
        }

        setCallingTicketId(selectedTicket.id);

        try {
            await callTicket(selectedTicket.id, loggedCounter, accessToken);

            if (currentTicket) {
                await completeTicket(currentTicket.id, accessToken);
                await refreshCompletedHistory();
            }

            setCurrentTicket({ ...selectedTicket, status: 'Called' });
            setQueue((prev) => prev.filter((ticket) => ticket.id !== selectedTicket.id));
        } catch (error) {
            console.error(error);
            alert('Falha ao chamar a senha. Tente novamente.');
        } finally {
            setCallingTicketId(null);
        }
    };

    const handleCallNext = async () => {
        const ticketIndex = queue.findIndex(
            (ticket) => selectedType === ALL_SERVICE_TYPES || ticket.serviceType === selectedType,
        );

        await callTicketAtIndex(ticketIndex, `Nenhuma senha do tipo "${selectedType}" aguardando.`);
    };

    const handleCallSpecificTicket = async (ticketId: string) => {
        const ticketIndex = queue.findIndex((ticket) => ticket.id === ticketId);
        await callTicketAtIndex(ticketIndex, 'Senha selecionada não está mais na fila.');
    };

    const handleCompleteCurrentTicket = async () => {
        if (!currentTicket) {
            alert('Nenhuma senha em atendimento para concluir.');
            return;
        }

        const accessToken = getAccessToken();

        if (!accessToken) {
            alert('Sua sessão expirou. Faça login novamente.');
            return;
        }

        setIsCompletingCurrentTicket(true);

        try {
            await completeTicket(currentTicket.id, accessToken);
            await refreshCompletedHistory();
            setCurrentTicket(null);
        } catch (error) {
            console.error(error);
            alert('Falha ao concluir a senha. Tente novamente.');
        } finally {
            setIsCompletingCurrentTicket(false);
        }
    };

    const handleRecallCurrentTicket = async () => {
        if (!currentTicket) {
            alert('Nenhuma senha em atendimento para repetir.');
            return;
        }

        const accessToken = getAccessToken();

        if (!accessToken) {
            alert('Sua sessão expirou. Faça login novamente.');
            return;
        }

        setIsRecallingCurrentTicket(true);

        try {
            await recallTicket(currentTicket.id, accessToken);
        } catch (error) {
            console.error(error);
            alert('Falha ao repetir a chamada da senha. Tente novamente.');
        } finally {
            setIsRecallingCurrentTicket(false);
        }
    };

    const handleCancelCurrentTicket = async () => {
        if (!currentTicket) {
            alert('Nenhuma senha em atendimento para cancelar.');
            return;
        }

        const accessToken = getAccessToken();

        if (!accessToken) {
            alert('Sua sessão expirou. Faça login novamente.');
            return;
        }

        setIsCancellingCurrentTicket(true);

        try {
            await cancelTicket(currentTicket.id, accessToken);
            setCurrentTicket(null);
            await refreshQueue();
        } catch (error) {
            console.error(error);
            alert('Falha ao cancelar a senha. Tente novamente.');
        } finally {
            setIsCancellingCurrentTicket(false);
        }
    };

    const handleLogout = () => {
        clearAuthSession();
        navigate('/login', { replace: true });
    };

    return (
        <Layout contentClassName="mx-auto flex w-[97%] flex-grow flex-col items-center justify-center py-8 sm:w-[95%] md:py-10 lg:w-[92%] xl:w-[90%]">
            <div className="w-full max-w-[112rem] grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <AttendantTopBar loggedCounter={loggedCounter} queueLength={queue.length} onLogout={handleLogout} />

                    <CurrentAttendanceCard
                        currentTicket={currentTicket}
                        selectedType={selectedType}
                        serviceTypeOptions={serviceTypeOptions}
                        isLoadingQueue={isLoadingQueue}
                        callingTicketId={callingTicketId}
                        isRecallingCurrentTicket={isRecallingCurrentTicket}
                        isCompletingCurrentTicket={isCompletingCurrentTicket}
                        isCancellingCurrentTicket={isCancellingCurrentTicket}
                        onSelectedTypeChange={setSelectedType}
                        onCallNext={() => void handleCallNext()}
                        onRecallCurrentTicket={() => void handleRecallCurrentTicket()}
                        onCompleteCurrentTicket={() => void handleCompleteCurrentTicket()}
                        onCancelCurrentTicket={() => void handleCancelCurrentTicket()}
                        queueLength={queue.length}
                    />
                </div>

                <div className="lg:col-span-5 flex flex-col gap-8 min-w-0">
                    <WaitingQueueSection
                        queue={queue}
                        isLoadingQueue={isLoadingQueue}
                        callingTicketId={callingTicketId}
                        clockTick={clockTick}
                        onCallSpecificTicket={(ticketId) => void handleCallSpecificTicket(ticketId)}
                    />
                    <HistorySection history={history} />
                </div>
            </div>
        </Layout>
    );
};

export default Attendant;
