import React from 'react';

const GetTicketHero: React.FC = () => {
    return (
        <div className="mb-4 flex flex-col gap-2.5 md:mb-5 lg:mb-8">
            <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl md:text-[2.6rem] lg:text-5xl">
                Retire aqui sua senha
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base lg:text-lg">
                Selecione uma opção abaixo para iniciar seu atendimento de forma rápida.
            </p>
        </div>
    );
};

export default GetTicketHero;
