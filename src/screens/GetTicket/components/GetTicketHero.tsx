import React from 'react';

const GetTicketHero: React.FC = () => {
    return (
        <div className="mb-4 flex flex-col gap-2.5 md:mb-5 lg:mb-8">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Atendimento Digital
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl md:text-[2.6rem] lg:text-5xl">
                Como podemos te ajudar hoje?
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base lg:text-lg">
                Selecione uma opção abaixo para iniciar seu atendimento de forma rápida.
            </p>
        </div>
    );
};

export default GetTicketHero;
