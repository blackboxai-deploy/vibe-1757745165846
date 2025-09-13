'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataManager } from '@/lib/data-manager';
import { formatarTempoPreciso, formatarDataHora } from '@/lib/calculations';

interface SessaoCompleta {
  id: string;
  metaId: string;
  meta?: any;
  duracao: number;
  duracaoSegundos: number;
  data: Date;
  tipo: 'manual' | 'cronometro';
  observacoes?: string;
  pausas: number;
}

export default function HistoricoPage() {
  const router = useRouter();
  const [sessoes, setSessoes] = useState<SessaoCompleta[]>([]);
  const [metas, setMetas] = useState<any[]>([]);
  const [filtroMeta, setFiltroMeta] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [ordenacao, setOrdenacao] = useState('data-desc');

  useEffect(() => {
    carregarDados();
  }, [filtroMeta, filtroTipo, filtroData, ordenacao]);

  const carregarDados = () => {
    try {
      let sessoesDados = DataManager.obterSessoes();
      const metasDados = DataManager.obterMetas();
      
      // Aplicar filtros
      if (filtroMeta) {
        sessoesDados = sessoesDados.filter(s => s.metaId === filtroMeta);
      }
      
      if (filtroTipo) {
        sessoesDados = sessoesDados.filter(s => s.tipo === filtroTipo);
      }
      
      if (filtroData) {
        const hoje = new Date();
        let dataLimite = new Date();
        
        switch (filtroData) {
          case 'hoje':
            dataLimite.setHours(0, 0, 0, 0);
            sessoesDados = sessoesDados.filter(s => new Date(s.data) >= dataLimite);
            break;
          case 'semana':
            dataLimite.setDate(hoje.getDate() - 7);
            sessoesDados = sessoesDados.filter(s => new Date(s.data) >= dataLimite);
            break;
          case 'mes':
            dataLimite.setDate(hoje.getDate() - 30);
            sessoesDados = sessoesDados.filter(s => new Date(s.data) >= dataLimite);
            break;
        }
      }
      
      // Aplicar ordenação
      const [campo, direcao] = ordenacao.split('-');
      sessoesDados.sort((a, b) => {
        let valorA: any, valorB: any;
        
        switch (campo) {
          case 'data':
            valorA = new Date(a.data);
            valorB = new Date(b.data);
            break;
          case 'duracao':
            valorA = a.duracaoSegundos || Math.round(a.duracao * 60);
            valorB = b.duracaoSegundos || Math.round(b.duracao * 60);
            break;
          case 'meta':
            const metaA = metasDados.find(m => m.id === a.metaId);
            const metaB = metasDados.find(m => m.id === b.metaId);
            valorA = metaA?.titulo || '';
            valorB = metaB?.titulo || '';
            break;
        }
        
        if (direcao === 'desc') {
          return valorB > valorA ? 1 : -1;
        } else {
          return valorA > valorB ? 1 : -1;
        }
      });
      
      const sessoesComMeta = sessoesDados.map(sessao => ({
        ...sessao,
        meta: metasDados.find(m => m.id === sessao.metaId)
      }));
      
      setSessoes(sessoesComMeta);
      setMetas(metasDados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const excluirSessao = (sessaoId: string) => {
    if (confirm('Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita.')) {
      try {
        DataManager.excluirSessao(sessaoId);
        carregarDados();
        alert('Sessão excluída com sucesso!');
      } catch (error) {
        alert('Erro ao excluir sessão');
        console.error(error);
      }
    }
  };

  const duplicarSessao = (sessao: SessaoCompleta) => {
    try {
      const novaSessao = {
        metaId: sessao.metaId,
        duracao: sessao.duracao,
        duracaoSegundos: sessao.duracaoSegundos || Math.round(sessao.duracao * 60),
        data: new Date(),
        dataInicio: new Date(),
        dataFim: new Date(),
        tipo: sessao.tipo,
        observacoes: sessao.observacoes,
        pausas: 0
      };
      
      DataManager.criarSessao(novaSessao);
      carregarDados();
      alert('Sessão duplicada com sucesso!');
    } catch (error) {
      alert('Erro ao duplicar sessão');
      console.error(error);
    }
  };

  const editarSessao = (sessaoId: string) => {
    // Implementação simples de edição via prompt
    const sessao = sessoes.find(s => s.id === sessaoId);
    if (!sessao) return;
    
    const novaObservacao = prompt('Editar observações:', sessao.observacoes || '');
    if (novaObservacao !== null) {
      try {
        DataManager.atualizarSessao(sessaoId, { observacoes: novaObservacao });
        carregarDados();
        alert('Sessão atualizada!');
      } catch (error) {
        alert('Erro ao atualizar sessão');
      }
    }
  };

  const estatisticas = {
    totalSessoes: sessoes.length,
    segundosTotal: sessoes.reduce((total, s) => total + (s.duracaoSegundos || Math.round(s.duracao * 60)), 0),
    mediaSegundos: sessoes.length > 0 ? 
      sessoes.reduce((total, s) => total + (s.duracaoSegundos || Math.round(s.duracao * 60)), 0) / sessoes.length : 0,
    metasUnicas: new Set(sessoes.map(s => s.metaId)).size,
    tiposCronometro: sessoes.filter(s => s.tipo === 'cronometro').length,
    tiposManual: sessoes.filter(s => s.tipo === 'manual').length
  };

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
            📈 Histórico Completo
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Todas suas sessões com precisão de segundos
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white/80 p-4 rounded-xl text-center shadow-lg">
            <div className="text-2xl font-bold text-blue-600">{estatisticas.totalSessoes}</div>
            <div className="text-sm text-slate-600">Sessões</div>
          </div>
          
          <div className="bg-white/80 p-4 rounded-xl text-center shadow-lg">
            <div className="text-lg font-bold text-green-600">{formatarTempoPreciso(estatisticas.segundosTotal)}</div>
            <div className="text-sm text-slate-600">Total</div>
          </div>
          
          <div className="bg-white/80 p-4 rounded-xl text-center shadow-lg">
            <div className="text-lg font-bold text-purple-600">{formatarTempoPreciso(Math.round(estatisticas.mediaSegundos))}</div>
            <div className="text-sm text-slate-600">Média</div>
          </div>
          
          <div className="bg-white/80 p-4 rounded-xl text-center shadow-lg">
            <div className="text-2xl font-bold text-orange-600">{estatisticas.metasUnicas}</div>
            <div className="text-sm text-slate-600">Metas</div>
          </div>
          
          <div className="bg-white/80 p-4 rounded-xl text-center shadow-lg">
            <div className="text-2xl font-bold text-cyan-600">{estatisticas.tiposCronometro}</div>
            <div className="text-sm text-slate-600">Cronômetro</div>
          </div>
          
          <div className="bg-white/80 p-4 rounded-xl text-center shadow-lg">
            <div className="text-2xl font-bold text-pink-600">{estatisticas.tiposManual}</div>
            <div className="text-sm text-slate-600">Manual</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white/80 p-6 rounded-xl shadow-lg mb-8">
          <h3 className="font-bold text-lg mb-4">🔍 Filtros e Ordenação</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Meta:</label>
              <select 
                value={filtroMeta}
                onChange={(e) => setFiltroMeta(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="">Todas as metas</option>
                {metas.map((meta) => (
                  <option key={meta.id} value={meta.id}>
                    {meta.titulo} ({meta.categoria})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tipo:</label>
              <select 
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="">Todos os tipos</option>
                <option value="cronometro">⏱️ Cronômetro</option>
                <option value="manual">📝 Manual</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Período:</label>
              <select 
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="">Todos os períodos</option>
                <option value="hoje">Hoje</option>
                <option value="semana">Última semana</option>
                <option value="mes">Último mês</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Ordenar:</label>
              <select 
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="data-desc">Mais recente</option>
                <option value="data-asc">Mais antigo</option>
                <option value="duracao-desc">Maior duração</option>
                <option value="duracao-asc">Menor duração</option>
                <option value="meta-asc">Meta (A-Z)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setFiltroMeta('');
                setFiltroTipo('');
                setFiltroData('');
                setOrdenacao('data-desc');
              }}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              Limpar Filtros
            </button>
            
            <button
              onClick={() => router.push('/demo')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              📝 Nova Sessão (Demo)
            </button>
          </div>
        </div>

        {/* Lista de Sessões */}
        <div className="bg-white/80 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-slate-900">
              📋 Sessões ({sessoes.length})
            </h3>
            
            {estatisticas.totalSessoes > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {formatarTempoPreciso(estatisticas.segundosTotal)}
                </div>
                <div className="text-sm text-slate-500">Tempo total registrado</div>
              </div>
            )}
          </div>
          
          {sessoes.length > 0 ? (
            <div className="space-y-4">
              {sessoes.map((sessao) => {
                const segundosSession = sessao.duracaoSegundos || Math.round(sessao.duracao * 60);
                const getTimeIcon = (segundos: number) => {
                  const horas = segundos / 3600;
                  if (horas >= 4) return '🏃'; // Maratonista
                  if (horas >= 2) return '💪'; // Forte
                  if (horas >= 1) return '⏰'; // Consistente
                  if (segundos >= 1800) return '📚'; // Focado (30min+)
                  return '📝'; // Básico
                };
                
                return (
                  <div 
                    key={sessao.id}
                    className="flex flex-col lg:flex-row lg:items-center gap-4 p-6 border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {sessao.meta && (
                          <div 
                            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: sessao.meta.cor }}
                          />
                        )}
                        <h4 className="font-bold text-xl text-slate-900">
                          {sessao.meta?.titulo || 'Meta removida'}
                        </h4>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                          {sessao.tipo === 'cronometro' ? '⏱️ Cronômetro' : '📝 Manual'}
                        </span>
                        {sessao.meta && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {sessao.meta.categoria}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getTimeIcon(segundosSession)}</span>
                          <span className="font-mono font-bold text-2xl text-blue-600">
                            {formatarTempoPreciso(segundosSession)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm">
                          📅 {formatarDataHora(new Date(sessao.data))}
                        </div>
                        
                        {sessao.pausas > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            ⏸️ {sessao.pausas} pausas
                          </div>
                        )}
                      </div>
                      
                      {sessao.observacoes && (
                        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-l-blue-400 rounded text-sm italic text-slate-700">
                          💭 "{sessao.observacoes}"
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2 lg:w-32">
                      <button
                        onClick={() => editarSessao(sessao.id)}
                        className="flex-1 lg:w-full px-4 py-2 border-2 border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        ✏️ Editar
                      </button>
                      
                      <button
                        onClick={() => duplicarSessao(sessao)}
                        className="flex-1 lg:w-full px-4 py-2 border-2 border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        📋 Duplicar
                      </button>
                      
                      <button
                        onClick={() => excluirSessao(sessao.id)}
                        className="flex-1 lg:w-full px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📈</div>
              <h3 className="font-bold text-2xl text-slate-900 mb-4">
                {filtroMeta || filtroTipo || filtroData ? 'Nenhuma sessão encontrada' : 'Nenhuma sessão registrada'}
              </h3>
              <p className="text-slate-500 mb-8 text-lg">
                {filtroMeta || filtroTipo || filtroData
                  ? 'Tente ajustar os filtros para encontrar suas sessões'
                  : 'Comece sua jornada registrando sua primeira sessão de prática'
                }
              </p>
              <div className="flex gap-4 justify-center">
                {(filtroMeta || filtroTipo || filtroData) && (
                  <button 
                    onClick={() => {
                      setFiltroMeta('');
                      setFiltroTipo('');
                      setFiltroData('');
                    }}
                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Limpar Filtros
                  </button>
                )}
                <button 
                  onClick={() => router.push('/demo')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  📝 Registrar Primeira Sessão
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resumo Analítico */}
        {sessoes.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">
              📊 Análise Detalhada com Segundos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{formatarTempoPreciso(estatisticas.segundosTotal)}</div>
                <p className="text-sm opacity-90">Tempo Total Exato</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold">{formatarTempoPreciso(Math.round(estatisticas.mediaSegundos))}</div>
                <p className="text-sm opacity-90">Duração Média</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold">{((estatisticas.segundosTotal / 36000000) * 100).toFixed(3)}%</div>
                <p className="text-sm opacity-90">Progresso 10k Horas</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold">{Math.round(estatisticas.segundosTotal / estatisticas.totalSessoes)}</div>
                <p className="text-sm opacity-90">Segundos Médios</p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-lg opacity-90">
                🎯 <strong>Meta:</strong> {(36000000 - estatisticas.segundosTotal).toLocaleString()} segundos restantes para 10.000 horas
              </p>
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="mt-8 bg-white/60 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-900">✨ Funcionalidades do Histórico:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div>
              <h4 className="font-semibold mb-2">⏰ Precisão de Segundos:</h4>
              <ul className="space-y-1">
                <li>• Cronômetro conta cada segundo</li>
                <li>• Registro manual aceita H:M:S</li>
                <li>• Exibição precisa: "2h 30min 45s"</li>
                <li>• Cálculos mantêm precisão total</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">📈 Gestão Completa:</h4>
              <ul className="space-y-1">
                <li>• Filtros por meta, tipo e período</li>
                <li>• Ordenação por data ou duração</li>
                <li>• Edição de observações</li>
                <li>• Duplicação rápida de sessões</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-8">
          <button 
            onClick={() => router.push('/auth')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
          >
            Experimentar Aplicativo Completo
          </button>
        </div>
      </div>
    </div>
  );
}