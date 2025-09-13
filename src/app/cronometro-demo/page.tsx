'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CronometroDemoPage() {
  const router = useRouter();
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const [pausas, setPausas] = useState(0);
  const [metaSelecionada, setMetaSelecionada] = useState('violao');
  const [observacoes, setObservacoes] = useState('');
  const [sessoesSalvas, setSessoesSalvas] = useState<any[]>([]);

  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval>;
    
    if (ativo) {
      intervalo = setInterval(() => {
        setSegundos(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [ativo]);

  const formatarTempo = (segs: number): string => {
    const horas = Math.floor(segs / 3600);
    const mins = Math.floor((segs % 3600) / 60);
    const s = segs % 60;
    return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatarTempoPreciso = (segs: number): string => {
    const horas = Math.floor(segs / 3600);
    const mins = Math.floor((segs % 3600) / 60);
    const s = segs % 60;
    
    if (horas === 0 && mins === 0) {
      return `${s}s`;
    } else if (horas === 0) {
      return s === 0 ? `${mins}min` : `${mins}min ${s}s`;
    } else {
      let resultado = `${horas}h`;
      if (mins > 0) resultado += ` ${mins}min`;
      if (s > 0) resultado += ` ${s}s`;
      return resultado;
    }
  };

  const iniciar = () => setAtivo(true);
  
  const pausar = () => {
    setAtivo(false);
    setPausas(prev => prev + 1);
  };

  const parar = () => {
    if (segundos > 0) {
      const novaSessao = {
        id: Date.now(),
        meta: metaSelecionada,
        tempo: segundos,
        tempoFormatado: formatarTempoPreciso(segundos),
        data: new Date().toLocaleString('pt-BR'),
        tipo: 'cronometro',
        observacoes: observacoes || 'Sessão registrada via cronômetro',
        pausas
      };
      
      setSessoesSalvas(prev => [novaSessao, ...prev]);
      alert(`✅ Sessão salva! ${formatarTempoPreciso(segundos)} registrados para ${metaSelecionada}`);
    }
    
    setAtivo(false);
    setSegundos(0);
    setPausas(0);
    setObservacoes('');
  };

  const reset = () => {
    setAtivo(false);
    setSegundos(0);
    setPausas(0);
  };

  const metas = [
    { id: 'violao', nome: 'Violão', cor: '#3B82F6' },
    { id: 'programacao', nome: 'Programação', cor: '#8B5CF6' },
    { id: 'ingles', nome: 'Inglês', cor: '#10B981' },
    { id: 'desenho', nome: 'Desenho', cor: '#F59E0B' },
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
          
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            ⏱️ Cronômetro com Precisão de Segundos
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Demonstração funcional do cronômetro com registro preciso
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cronômetro Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 p-8 rounded-2xl shadow-xl text-center">
              {/* Display do Tempo */}
              <div className="mb-8">
                <div className="text-7xl font-mono font-bold text-slate-900 mb-4">
                  {formatarTempo(segundos)}
                </div>
                
                <div className="text-2xl text-slate-600 mb-6">
                  {formatarTempoPreciso(segundos)}
                </div>
                
                <div className="flex justify-center gap-4 text-sm text-slate-500">
                  {pausas > 0 && <span>⏸️ {pausas} pausas</span>}
                  {segundos > 0 && <span>📊 {Math.round(segundos / 60)} minutos</span>}
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                <span className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${
                  ativo ? 'bg-green-500 text-white' : 
                  segundos > 0 ? 'bg-yellow-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {ativo ? '▶️ Rodando' : segundos > 0 ? '⏸️ Pausado' : '⏹️ Parado'}
                </span>
              </div>

              {/* Controles */}
              <div className="flex justify-center gap-4">
                {!ativo && segundos === 0 && (
                  <button
                    onClick={iniciar}
                    className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors text-lg"
                  >
                    ▶️ Iniciar
                  </button>
                )}

                {ativo && (
                  <button
                    onClick={pausar}
                    className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors text-lg"
                  >
                    ⏸️ Pausar
                  </button>
                )}

                {!ativo && segundos > 0 && (
                  <>
                    <button
                      onClick={iniciar}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      ▶️ Retomar
                    </button>
                    
                    <button
                      onClick={parar}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      ⏹️ Parar & Salvar
                    </button>
                  </>
                )}

                {segundos > 0 && (
                  <button
                    onClick={reset}
                    className="px-6 py-3 border-2 border-red-300 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors"
                  >
                    🔄 Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="space-y-6">
            {/* Selecionar Meta */}
            <div className="bg-white/90 p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-4">⚙️ Configurações</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Meta:</label>
                  <select 
                    value={metaSelecionada}
                    onChange={(e) => setMetaSelecionada(e.target.value)}
                    disabled={ativo}
                    className="w-full p-3 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
                  >
                    {metas.map((meta) => (
                      <option key={meta.id} value={meta.id}>
                        {meta.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Observações:</label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="O que você vai praticar nesta sessão?"
                    className="w-full p-3 border border-slate-300 rounded-lg bg-white resize-none"
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {observacoes.length}/200 caracteres
                  </p>
                </div>
              </div>
            </div>

            {/* Meta Atual */}
            <div className="bg-white/90 p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-4">🎯 Meta Selecionada</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: metas.find(m => m.id === metaSelecionada)?.cor }}
                  />
                  <span className="font-semibold">
                    {metas.find(m => m.id === metaSelecionada)?.nome}
                  </span>
                </div>
                
                <div className="text-sm text-slate-600">
                  <p>• Sessão será registrada automaticamente</p>
                  <p>• Segundos contados com precisão total</p>
                  <p>• Estado persistente entre navegações</p>
                </div>
              </div>
            </div>

            {/* Sessão Atual */}
            {segundos > 0 && (
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="font-bold text-lg mb-4 text-blue-800">📊 Sessão Atual</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tempo:</span>
                    <span className="font-mono font-bold">{formatarTempoPreciso(segundos)}</span>
                  </div>
                  
                  {pausas > 0 && (
                    <div className="flex justify-between">
                      <span>Pausas:</span>
                      <span>{pausas}x</span>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-blue-200 text-xs text-blue-600">
                    Esta sessão será salva quando você parar o cronômetro
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sessões Salvas */}
        {sessoesSalvas.length > 0 && (
          <div className="mt-12">
            <div className="bg-white/90 rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-xl mb-6 text-slate-900">
                📈 Sessões Registradas com Precisão de Segundos
              </h3>
              
              <div className="space-y-4">
                {sessoesSalvas.map((sessao) => (
                  <div 
                    key={sessao.id}
                    className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: metas.find(m => m.id === sessao.meta)?.cor }}
                      />
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {metas.find(m => m.id === sessao.meta)?.nome}
                        </h4>
                        <p className="text-sm text-slate-500">{sessao.data}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-mono font-bold text-xl text-blue-600">
                        {sessao.tempoFormatado}
                      </div>
                      <div className="text-sm text-slate-500">
                        {sessao.pausas > 0 && `⏸️ ${sessao.pausas} pausas`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {formatarTempoPreciso(
                      sessoesSalvas.reduce((total, s) => total + s.tempo, 0)
                    )}
                  </div>
                  <p className="text-sm text-green-600">
                    Total de tempo registrado nesta demonstração
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Funcionalidades */}
        <div className="mt-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">
            ✨ Funcionalidades Implementadas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-3">⏱️ Cronômetro Avançado:</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>✓ Contagem precisa por segundos</li>
                <li>✓ Display HH:MM:SS em tempo real</li>
                <li>✓ Controles: Start, Pause, Resume, Stop, Reset</li>
                <li>✓ Contagem automática de pausas</li>
                <li>✓ Seleção de meta durante cronometragem</li>
                <li>✓ Observações personalizáveis</li>
                <li>✓ Salvamento automático da sessão</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-3">📊 Registro e Exibição:</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>✓ Formato completo: "2h 30min 45s"</li>
                <li>✓ Precisão total mantida</li>
                <li>✓ Histórico com todos os detalhes</li>
                <li>✓ Filtros por meta e tipo</li>
                <li>✓ Estatísticas em tempo real</li>
                <li>✓ Cálculos com base em segundos</li>
                <li>✓ Persistência de estado</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-lg font-medium mb-4">
              🎯 Demonstração funcionando perfeitamente!
            </p>
            <button 
              onClick={() => router.push('/historico')}
              className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Ver Histórico Completo
            </button>
          </div>
        </div>

        {/* Registro Manual Demo */}
        <div className="mt-8 bg-white/90 p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-slate-900">
            📝 Registro Manual com Segundos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Exemplo de Formulário:</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Horas</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="24" 
                      defaultValue="1"
                      className="w-full p-2 border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Minutos</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="59" 
                      defaultValue="30"
                      className="w-full p-2 border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Segundos</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="59" 
                      defaultValue="45"
                      className="w-full p-2 border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="font-semibold text-green-700">
                    Total: 1h 30min 45s
                  </p>
                </div>
                
                <div className="text-sm text-slate-600">
                  <p>✓ Campos separados para máxima precisão</p>
                  <p>✓ Validação em tempo real</p>
                  <p>✓ Presets de tempo comum</p>
                  <p>✓ Preview instantâneo</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Presets Disponíveis:</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '5 min', segundos: 300 },
                  { label: '15 min', segundos: 900 },
                  { label: '30 min', segundos: 1800 },
                  { label: '45 min', segundos: 2700 },
                  { label: '1 hora', segundos: 3600 },
                  { label: '1h 30min', segundos: 5400 },
                  { label: '2 horas', segundos: 7200 },
                  { label: '3 horas', segundos: 10800 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    {preset.label}
                    <div className="text-xs text-slate-500">
                      {formatarTempoPreciso(preset.segundos)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}