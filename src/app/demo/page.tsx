'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DemoPage() {
  const router = useRouter();
  const [cronometroSegundos, setCronometroSegundos] = useState(0);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);

  const formatarTempo = (segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const formatarTempoPreciso = (segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    if (horas === 0 && mins === 0) {
      return `${segs}s`;
    } else if (horas === 0) {
      return segs === 0 ? `${mins}min` : `${mins}min ${segs}s`;
    } else {
      let resultado = `${horas}h`;
      if (mins > 0) resultado += ` ${mins}min`;
      if (segs > 0) resultado += ` ${segs}s`;
      return resultado;
    }
  };

  const iniciarCronometro = () => {
    setCronometroAtivo(true);
    const id = setInterval(() => {
      setCronometroSegundos(prev => prev + 1);
    }, 1000);
    setIntervalId(id);
  };

  const pararCronometro = () => {
    setCronometroAtivo(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const resetarCronometro = () => {
    pararCronometro();
    setCronometroSegundos(0);
  };

  const sessoesMock = [
    { id: 1, meta: 'Violão', tempo: 7325, tipo: 'cronometro', data: '2024-01-15 14:30' }, // 2h 2min 5s
    { id: 2, meta: 'Programação', tempo: 5445, tipo: 'manual', data: '2024-01-14 09:15' }, // 1h 30min 45s
    { id: 3, meta: 'Inglês', tempo: 2187, tipo: 'cronometro', data: '2024-01-13 19:00' }, // 36min 27s
    { id: 4, meta: 'Design', tempo: 10830, tipo: 'manual', data: '2024-01-12 16:45' }, // 3h 0min 30s
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            ← Voltar
          </button>
          
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            ⏳
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Demo - 10.000 Horas
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Experimente as funcionalidades principais com registro preciso de segundos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cronômetro Demo */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              ⏱️ Cronômetro com Segundos
            </h2>
            
            <div className="text-center mb-8">
              <div className="text-6xl font-mono font-bold text-slate-900 dark:text-white mb-4">
                {formatarTempo(cronometroSegundos)}
              </div>
              
              <div className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                {formatarTempoPreciso(cronometroSegundos)}
              </div>
              
              <div className="flex justify-center gap-3">
                {!cronometroAtivo ? (
                  <button
                    onClick={iniciarCronometro}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    ▶️ Iniciar
                  </button>
                ) : (
                  <button
                    onClick={pararCronometro}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    ⏸️ Pausar
                  </button>
                )}
                
                <button
                  onClick={resetarCronometro}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-500 mb-4">
                ✨ <strong>Novidade:</strong> Agora com precisão de segundos!
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• Contagem em tempo real</p>
                <p>• Persistência entre navegações</p>
                <p>• Salvamento automático</p>
                <p>• Contagem de pausas</p>
              </div>
            </div>
          </div>

          {/* Histórico Demo */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              📈 Histórico Completo
            </h2>
            
            <div className="space-y-4">
              {sessoesMock.map((sessao) => (
                <div key={sessao.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{sessao.meta}</span>
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">
                        {sessao.tipo === 'cronometro' ? '⏱️ Cronômetro' : '📝 Manual'}
                      </span>
                    </div>
                    <div className="font-mono font-bold text-blue-600">
                      {formatarTempoPreciso(sessao.tempo)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">{sessao.data}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 mb-4">
                ✨ <strong>Novidades do Histórico:</strong>
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• Exibição precisa com segundos</p>
                <p>• Filtros avançados por data e meta</p>
                <p>• Edição completa de sessões</p>
                <p>• Duplicação de sessões</p>
                <p>• Estatísticas detalhadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Funcionalidades Implementadas */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
            🚀 Funcionalidades Completas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Gestão de Metas',
                items: ['Criar, editar, excluir', 'Filtros por categoria', '9 categorias predefinidas', 'Cores personalizáveis']
              },
              {
                icon: '⏱️',
                title: 'Cronômetro Avançado',
                items: ['Precisão de segundos', 'Play/Pause/Stop/Reset', 'Persistência de estado', 'Contagem de pausas']
              },
              {
                icon: '📝',
                title: 'Registro Manual',
                items: ['Campos H:M:S separados', 'Presets de tempo', 'Calendar picker', 'Validações avançadas']
              },
              {
                icon: '📈',
                title: 'Histórico Completo',
                items: ['Filtros avançados', 'Edição de sessões', 'Duplicação rápida', 'Busca por texto']
              },
              {
                icon: '🏆',
                title: 'Sistema de Conquistas',
                items: ['15 conquistas únicas', 'Desbloqueio automático', 'Progresso visual', 'Notificações']
              },
              {
                icon: '⚙️',
                title: 'Configurações',
                items: ['Perfil personalizável', 'Backup/Restore', 'Tema claro/escuro', 'Exportação de dados']
              }
            ].map((categoria, index) => (
              <div key={index} className="bg-white/60 dark:bg-slate-800/60 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-3xl mb-3">{categoria.icon}</div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">
                  {categoria.title}
                </h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {categoria.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Experimente agora mesmo!
          </h3>
          <button 
            onClick={() => router.push('/auth')}
            className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
          >
            Começar Minha Jornada de 10.000 Horas
          </button>
        </div>
      </div>
    </div>
  );
}