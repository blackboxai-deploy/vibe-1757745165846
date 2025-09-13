export interface Usuario {
  id: string;
  nome: string;
  email: string;
  dataCadastro: Date;
  configuracoes: {
    notificacoes: boolean;
    metaHorasDiaria: number;
    tema: 'light' | 'dark' | 'system';
  };
}

export interface Meta {
  id: string;
  usuarioId: string;
  titulo: string;
  descricao: string;
  horasObjetivo: number;
  horasRegistradas: number; // em horas decimais (ex: 2.75 = 2h 45min)
  segundosRegistrados: number; // total em segundos para precisão máxima
  dataCriacao: Date;
  dataUltimaAtualizacao: Date;
  ativa: boolean;
  categoria: string;
  cor: string;
}

export interface Sessao {
  id: string;
  metaId: string;
  usuarioId: string;
  duracao: number; // em minutos (decimal para compatibilidade)
  duracaoSegundos: number; // duração total em segundos para precisão
  data: Date;
  dataInicio: Date;
  dataFim: Date;
  tipo: 'manual' | 'cronometro';
  observacoes?: string;
  pausas: number; // número de pausas
}

export interface Conquista {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  tipo: 'horas' | 'consistencia' | 'meta' | 'especial';
  condicao: number;
  desbloqueada: boolean;
  dataDesbloqueio?: Date;
}

export interface ConquistaUsuario {
  id: string;
  usuarioId: string;
  conquistaId: string;
  dataDesbloqueio: Date;
  metaRelacionada?: string;
}

export interface EstatisticaDia {
  data: Date;
  horasTotal: number;
  sessoesTotal: number;
  metasAtivas: number;
}

export interface EstatisticaSemana {
  inicioSemana: Date;
  fimSemana: Date;
  horasTotal: number;
  sessoesTotal: number;
  diasAtivos: number;
  mediaHorasPorDia: number;
}

export interface EstatisticaMes {
  mes: number;
  ano: number;
  horasTotal: number;
  sessoesTotal: number;
  diasAtivos: number;
  conquistasDesbloqueadas: number;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'conquista' | 'lembrete' | 'meta' | 'info';
  lida: boolean;
  data: Date;
}

export type StatusCronometro = 'parado' | 'rodando' | 'pausado';

export interface EstadoCronometro {
  status: StatusCronometro;
  tempoDecorrido: number; // em segundos
  metaSelecionada?: string;
  iniciadoEm?: Date;
  pausadoEm?: Date;
  totalPausas: number;
}

export interface FiltroSessoes {
  dataInicio?: Date;
  dataFim?: Date;
  metaId?: string;
  tipo?: 'manual' | 'cronometro';
  duracaoMinima?: number;
}

export interface OrdenacaoSessoes {
  campo: 'data' | 'duracao' | 'meta';
  direcao: 'asc' | 'desc';
}

export interface DadosExportacao {
  usuario: Usuario;
  metas: Meta[];
  sessoes: Sessao[];
  conquistas: ConquistaUsuario[];
  versao: string;
  dataExportacao: Date;
}

export enum TipoConquista {
  HORAS = 'horas',
  CONSISTENCIA = 'consistencia', 
  META = 'meta',
  ESPECIAL = 'especial'
}

export enum CategoriasMeta {
  MUSICA = 'Música',
  PROGRAMACAO = 'Programação',
  IDIOMAS = 'Idiomas',
  ESPORTES = 'Esportes',
  ARTE = 'Arte',
  ACADEMICO = 'Acadêmico',
  PROFISSIONAL = 'Profissional',
  HOBBY = 'Hobby',
  OUTRO = 'Outro'
}