import React from 'react';

const GetTicketHero: React.FC = () => {
    return (
        <div className="mb-3 flex flex-col gap-2 md:mb-4 lg:mb-4 xl:mb-6 2xl:mb-8">
            <h1 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl md:text-[2rem] lg:text-[2.2rem] xl:text-[2.6rem] 2xl:text-5xl">
                Retire aqui sua senha
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base lg:text-lg">
                Selecione uma opção abaixo para iniciar seu atendimento de forma rápida.
            </p>
        </div>
    );
};

export default GetTicketHero;
