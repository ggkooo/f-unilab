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
      <span className="text-5xl lg:text-7xl font-mono font-bold text-[#003B71] drop-shadow-sm tracking-widest">
        {hours}:{minutes}:{seconds}
      </span>
      <span className="text-xl lg:text-2xl text-slate-500 mt-2 capitalize">{date}</span>
    </div>
  );
};

export default Clock;
