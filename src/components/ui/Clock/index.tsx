import React from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());
  const date = time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <span className="text-[clamp(1.8rem,4.5vw,6rem)] font-mono font-bold text-[#003B71] drop-shadow-sm tracking-wider">
        {hours}:{minutes}:{seconds}
      </span>
      <span className="text-[clamp(0.9rem,1.3vw,1.8rem)] text-slate-500 mt-1 sm:mt-2 capitalize text-center px-3">{date}</span>
    </div>
  );
};

export default Clock;
