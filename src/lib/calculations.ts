import { Meta, Sessao, EstatisticaDia } from '@/types';

// Converter minutos para formato legível
export const formatarDuracao = (minutos: number): string => {
  const horas = Math.floor(minutos / 60);
  const mins = Math.round(minutos % 60);
  
  if (horas === 0) {
    return `${mins}min`;
  } else if (mins === 0) {
    return `${horas}h`;
  } else {
    return `${horas}h ${mins}min`;
  }
};

// Converter segundos para formato legível com precisão TOTAL
export const formatarTempoPreciso = (segundos: number): string => {
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

// Converter segundos para duração em minutos com precisão decimal
export const segundosParaMinutos = (segundos: number): number => {
  return segundos / 60;
};

// Converter minutos para segundos
export const minutosParaSegundos = (minutos: number): number => {
  return Math.round(minutos * 60);
};

// Converter horas decimais para formato legível
export const formatarHoras = (horas: number): string => {
  const horasInteiras = Math.floor(horas);
  const minutos = Math.round((horas - horasInteiras) * 60);
  
  if (horasInteiras === 0) {
    return `${minutos}min`;
  } else if (minutos === 0) {
    return `${horasInteiras}h`;
  } else {
    return `${horasInteiras}h ${minutos}min`;
  }
};

// Calcular percentual de progresso
export const calcularProgresso = (horasRegistradas: number, horasObjetivo: number): number => {
  if (horasObjetivo === 0) return 0;
  return Math.min(100, (horasRegistradas / horasObjetivo) * 100);
};

// Calcular tempo restante para meta
export const calcularTempoRestante = (horasRegistradas: number, horasObjetivo: number): number => {
  return Math.max(0, horasObjetivo - horasRegistradas);
};

// Calcular projeção de conclusão baseada na média
export const calcularProjecao = (meta: Meta, sessoes: Sessao[]): Date | null => {
  const sessoesMetaUltimos30Dias = sessoes
    .filter(s => s.metaId === meta.id)
    .filter(s => {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - 30);
      return new Date(s.data) >= dataLimite;
    });

  if (sessoesMetaUltimos30Dias.length === 0) return null;

  const segundosPorDia = sessoesMetaUltimos30Dias.reduce((total, s) => {
    return total + (s.duracaoSegundos || Math.round(s.duracao * 60));
  }, 0) / 30;
  
  const horasRestantes = calcularTempoRestante(meta.horasRegistradas, meta.horasObjetivo);
  const segundosRestantes = horasRestantes * 3600;
  
  if (segundosPorDia <= 0) return null;

  const diasRestantes = Math.ceil(segundosRestantes / segundosPorDia);
  const dataProjecao = new Date();
  dataProjecao.setDate(dataProjecao.getDate() + diasRestantes);
  
  return dataProjecao;
};

// Calcular estatísticas diárias
export const calcularEstatisticasDiarias = (sessoes: Sessao[], dias = 30): EstatisticaDia[] => {
  const hoje = new Date();
  const estatisticas: EstatisticaDia[] = [];
  
  for (let i = dias - 1; i >= 0; i--) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    data.setHours(0, 0, 0, 0);
    
    const sessoesDia = sessoes.filter(s => {
      const dataSessao = new Date(s.data);
      dataSessao.setHours(0, 0, 0, 0);
      return dataSessao.getTime() === data.getTime();
    });
    
    const segundosTotal = sessoesDia.reduce((total, s) => {
      return total + (s.duracaoSegundos || Math.round(s.duracao * 60));
    }, 0);
    const horasTotal = segundosTotal / 3600;
    const metasAtivas = new Set(sessoesDia.map(s => s.metaId)).size;
    
    estatisticas.push({
      data,
      horasTotal,
      sessoesTotal: sessoesDia.length,
      metasAtivas
    });
  }
  
  return estatisticas;
};

// Calcular sequência de dias consecutivos
export const calcularSequenciaConsecutiva = (sessoes: Sessao[]): number => {
  if (sessoes.length === 0) return 0;
  
  const diasComSessao = new Set(
    sessoes.map(s => new Date(s.data).toDateString())
  );
  
  let sequencia = 0;
  const hoje = new Date();
  
  // Verificar sequência atual (começando de hoje)
  for (let i = 0; i < 365; i++) { // Máximo 1 ano
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    
    if (diasComSessao.has(data.toDateString())) {
      sequencia++;
    } else {
      break;
    }
  }
  
  return sequencia;
};

// Gerar insights automáticos
export const gerarInsights = (metas: Meta[], sessoes: Sessao[]): string[] => {
  const insights: string[] = [];
  
  // Insight sobre consistência
  const sequencia = calcularSequenciaConsecutiva(sessoes);
  if (sequencia >= 7) {
    insights.push(`🔥 Incrível! Você está praticando por ${sequencia} dias consecutivos!`);
  } else if (sequencia >= 3) {
    insights.push(`💪 Boa! ${sequencia} dias consecutivos de prática. Continue assim!`);
  }
  
  // Insight sobre progresso da semana
  const umaSemanAtras = new Date();
  umaSemanAtras.setDate(umaSemanAtras.getDate() - 7);
  const sessoesUltimaSemana = sessoes.filter(s => new Date(s.data) >= umaSemanAtras);
  
  if (sessoesUltimaSemana.length > 0) {
    const segundosUltimaSemana = sessoesUltimaSemana.reduce((total, s) => {
      return total + (s.duracaoSegundos || Math.round(s.duracao * 60));
    }, 0);
    const horasUltimaSemana = segundosUltimaSemana / 3600;
    
    if (horasUltimaSemana >= 10) {
      insights.push(`📈 Excelente semana! Você praticou ${formatarHoras(horasUltimaSemana)}!`);
    } else if (horasUltimaSemana >= 5) {
      insights.push(`📊 Boa semana de prática: ${formatarHoras(horasUltimaSemana)} registradas!`);
    }
  }
  
  // Insight sobre meta com maior progresso
  const metaComMaiorProgresso = metas
    .filter(m => m.ativa && m.horasRegistradas > 0)
    .sort((a, b) => calcularProgresso(b.horasRegistradas, b.horasObjetivo) - calcularProgresso(a.horasRegistradas, a.horasObjetivo))[0];
  
  if (metaComMaiorProgresso) {
    const progresso = calcularProgresso(metaComMaiorProgresso.horasRegistradas, metaComMaiorProgresso.horasObjetivo);
    if (progresso >= 25) {
      insights.push(`🎯 ${metaComMaiorProgresso.titulo} já está ${progresso.toFixed(1)}% concluída!`);
    }
  }
  
  // Insight sobre total de horas
  const segundosTotal = sessoes.reduce((total, s) => {
    return total + (s.duracaoSegundos || Math.round(s.duracao * 60));
  }, 0);
  const horasTotal = segundosTotal / 3600;
  
  if (horasTotal >= 100) {
    insights.push(`🏆 Parabéns! Você já acumulou ${formatarHoras(horasTotal)} de prática!`);
  } else if (horasTotal >= 10) {
    insights.push(`⭐ Ótimo progresso! ${formatarHoras(horasTotal)} já foram registradas!`);
  }
  
  return insights;
};

// Utilitários de data
export const formatarData = (data: Date): string => {
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatarDataHora = (data: Date): string => {
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatarDataHoraCompleta = (data: Date): string => {
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const obterNomeDiaSemana = (data: Date): string => {
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return dias[data.getDay()];
};

export const obterNomeMes = (mes: number): string => {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return meses[mes];
};

// Função para calcular duração entre duas datas com precisão de segundos
export const calcularDuracaoEntreDatas = (inicio: Date, fim: Date): number => {
  return Math.floor((fim.getTime() - inicio.getTime()) / 1000);
};