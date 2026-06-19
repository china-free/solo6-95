import { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

const typeColors: Record<string, string> = {
  info: 'text-matrix-green/70',
  success: 'text-matrix-green',
  error: 'text-matrix-red',
  warning: 'text-matrix-amber',
  system: 'text-matrix-blue',
};

const typePrefix: Record<string, string> = {
  info: '[INFO]',
  success: '[OK]',
  error: '[ERR]',
  warning: '[WARN]',
  system: '[SYS]',
};

export function TerminalLog() {
  const { terminalLogs, clearLogs } = useGameStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { hour12: false });
  };

  return (
    <div className="bg-black/90 border border-matrix-green/30 rounded-lg p-3 backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="text-matrix-green text-xs font-bold tracking-wider">
          ╔═══ TERMINAL ═══╗
        </div>
        <button
          onClick={clearLogs}
          className="p-1 text-matrix-green/50 hover:text-matrix-red transition-all"
          title="Clear logs"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="text-matrix-green/30 text-[10px] font-mono mb-2">
        root@cellular-automaton:~$
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-matrix font-mono text-xs space-y-0.5 pr-1"
      >
        <div className="text-matrix-green/50">
          {'// Cellular Automaton Logic Circuit Sandbox'}
        </div>
        <div className="text-matrix-green/50">
          {'// Version 1.0.0 - Matrix Edition'}
        </div>
        <div className="text-matrix-green/50">
          {'// Type "help" for available commands'}
        </div>
        <div className="text-matrix-green/30">&nbsp;</div>

        {terminalLogs.map((log) => (
          <div key={log.id} className="flex gap-2 leading-relaxed">
            <span className="text-matrix-green/30 whitespace-nowrap">
              [{formatTime(log.timestamp)}]
            </span>
            <span className={`font-bold whitespace-nowrap ${typeColors[log.type]}`}>
              {typePrefix[log.type]}
            </span>
            <span className={typeColors[log.type]}>{log.message}</span>
          </div>
        ))}

        <div className="flex items-center gap-1 text-matrix-green/70 mt-1">
          <span>root@cellular-automaton:~$</span>
          <span className="w-2 h-4 bg-matrix-green terminal-cursor" />
        </div>
      </div>
    </div>
  );
}
