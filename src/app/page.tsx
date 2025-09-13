'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando aplicativo 10.000 Horas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
            ⏳
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            10.000 Horas
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Sua jornada rumo à maestria com registro preciso de segundos
          </p>
          
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/cronometro-demo')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg"
            >
              ⏱️ Testar Cronômetro
            </button>
            <button 
              onClick={() => router.push('/historico')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
            >
              📈 Ver Histórico
            </button>
            <button 
              onClick={() => router.push('/demo')}
              className="px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200"
            >
              📋 Funcionalidades
            </button>
          </div>
        </div>

        {/* Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: '🎯',
              title: 'Metas Personalizadas',
              description: 'Crie metas de especialização com objetivos de horas personalizáveis'
            },
            {
              icon: '⏱️',
              title: 'Cronômetro Preciso',
              description: 'Registre tempo em tempo real com precisão de segundos'
            },
            {
              icon: '📝',
              title: 'Registro Manual',
              description: 'Adicione sessões manualmente com horas, minutos e segundos'
            },
            {
              icon: '📈',
              title: 'Histórico Completo',
              description: 'Visualize e edite todas suas sessões com filtros avançados'
            },
            {
              icon: '🏆',
              title: 'Sistema de Conquistas',
              description: '15 conquistas para manter você motivado na jornada'
            },
            {
              icon: '📊',
              title: 'Estatísticas Detalhadas',
              description: 'Insights automáticos sobre seu progresso e padrões'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-12 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para se tornar um especialista?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            A jornada de 10.000 horas começa com um único segundo
          </p>
          <button 
            onClick={() => router.push('/auth')}
            className="px-12 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-slate-50 transition-all duration-200 shadow-lg"
          >
            Iniciar Agora - É Grátis!
          </button>
        </div>
      </div>
    </div>
  );
}