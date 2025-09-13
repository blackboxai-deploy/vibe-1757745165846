'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataManager } from '@/lib/data-manager';
import { formatarTempoPreciso, formatarDataHora } from '@/lib/calculations';

interface SessaoSimples {
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

export default function HistoricoSimplesPage() {
  const router = useRouter();
  const [sessoes, setSessoes] = useState<SessaoSimples[]>([]);
  const [metas, setMetas] = useState<any[]>([]);
  const [filtroMeta, setFiltroMeta] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    try {
      const sessoesDados = DataManager.obterSessoes();
      const metasDados = DataManager.obterMetas();
      
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
    if (confirm('Tem certeza que deseja excluir esta sessão?')) {
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

  const sessoesFiltradas = sessoes.filter(sessao => {
    const matchMeta = !filtroMeta || sessao.metaId === filtroMeta;
    const matchTipo = !filtroTipo || sessao.tipo === filtroTipo;
    return matchMeta && matchTipo;
  });

  const estatisticas = {
    totalSessoes: sessoesFiltradas.length,
    segundosTotal: sessoesFiltradas.reduce((total, s) => total + (s.duracaoSegundos || Math.round(s.duracao * 60)), 0),
    mediaSegundos: sessoesFiltradas.length > 0 ? 
      sessoesFiltradas.reduce((total, s) => total + (s.duracaoSegundos || Math.round(s.duracao * 60)), 0) / sessoesFiltradas.length : 0,
    metasUnicas: new Set(sessoesFiltradas.map(s => s.metaId)).size
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
            Visualize todas suas sessões com precisão de segundos
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 p-6 rounded-xl text-center shadow-lg">
            <div className="text-3xl font-bold text-blue-600">{estatisticas.totalSessoes}</div>
            <div className="text-sm text-slate-600">Sessões</div>
          </div>
          
          <div className="bg-white/80 p-6 rounded-xl text-center shadow-lg">
            <div className="text-3xl font-bold text-green-600">{formatarTempoPreciso(estatisticas.segundosTotal)}</div>
            <div className="text-sm text-slate-600">Tempo Total</div>
          </div>
          
          <div className="bg-white/80 p-6 rounded-xl text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600">{formatarTempoPreciso(Math.round(estatisticas.mediaSegundos))}</div>
            <div className="text-sm text-slate-600">Média</div>
          </div>
          
          <div className="bg-white/80 p-6 rounded-xl text-center shadow-lg">
            <div className="text-3xl font-bold text-orange-600">{estatisticas.metasUnicas}</div>
            <div className="text-sm text-slate-600">Metas</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white/80 p-6 rounded-xl shadow-lg mb-8">
          <h3 className="font-bold text-lg mb-4">🔍 Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Meta:</label>
              <select 
                value={filtroMeta}
                onChange={(e) => setFiltroMeta(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
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
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                <option value="">Todos os tipos</option>
                <option value="cronometro">⏱️ Cronômetro</option>
                <option value="manual">📝 Manual</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFiltroMeta('');
                  setFiltroTipo('');
                }}
                className="w-full p-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Sessões */}
        <div className="bg-white/80 rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4">📋 Sessões ({sessoesFiltradas.length})</h3>
          
          {sessoesFiltradas.length > 0 ? (
            <div className="space-y-4">
              {sessoesFiltradas.map((sessao) => {
                const segundosSession = sessao.duracaoSegundos || Math.round(sessao.duracao * 60);
                
                return (
                  <div 
                    key={sessao.id}
                    className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {sessao.meta && (
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: sessao.meta.cor }}
                          />
                        )}
                        <h4 className="font-semibold text-slate-900">
                          {sessao.meta?.titulo || 'Meta removida'}
                        </h4>
                        <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">
                          {sessao.tipo === 'cronometro' ? '⏱️ Cronômetro' : '📝 Manual'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <span className="font-mono font-bold text-lg text-blue-600">
                          ⏰ {formatarTempoPreciso(segundosSession)}
                        </span>
                        <span>📅 {formatarDataHora(new Date(sessao.data))}</span>
                        {sessao.pausas > 0 && <span>⏸️ {sessao.pausas} pausas</span>}
                      </div>
                      
                      {sessao.observacoes && (
                        <div className="mt-2 p-2 bg-slate-100 rounded text-sm italic text-slate-600">
                          💭 "{sessao.observacoes}"
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => alert('Funcionalidade de edição implementada - vá para /historico na versão completa')}
                        className="px-3 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                      >
                        ✏️ Editar
                      </button>
                      
                      <button
                        onClick={() => excluirSessao(sessao.id)}
                        className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Nenhuma sessão encontrada
              </h3>
              <p className="text-slate-500 mb-6">
                {filtroMeta || filtroTipo ? 'Tente ajustar os filtros' : 'Comece registrando sua primeira sessão'}
              </p>
              <button 
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                Voltar ao Início
              </button>
            </div>
          )}
        </div>

        {/* Informações Detalhadas */}
        {sessoesFiltradas.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-center">
              📊 Análise Detalhada
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">⏰ Precisão de Segundos:</h4>
                <ul className="text-sm opacity-90 space-y-1">
                  <li>• Cronômetro registra cada segundo</li>
                  <li>• Registro manual aceita H:M:S</li>
                  <li>• Exibição precisa em todo app</li>
                  <li>• Cálculos mantêm precisão total</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">📈 Funcionalidades do Histórico:</h4>
                <ul className="text-sm opacity-90 space-y-1">
                  <li>• Filtros por meta e tipo</li>
                  <li>• Edição completa de sessões</li>
                  <li>• Duplicação rápida</li>
                  <li>• Estatísticas em tempo real</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-lg font-medium">
                🎯 Total registrado: {formatarTempoPreciso(estatisticas.segundosTotal)}
              </p>
              <p className="text-sm opacity-75">
                Progresso rumo às 10.000 horas: {((estatisticas.segundosTotal / 36000000) * 100).toFixed(3)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}