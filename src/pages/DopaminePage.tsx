import React from 'react';
import { ExternalLink, Brain, Target, Users } from 'lucide-react';

function DopaminePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] text-gray-900">
      {/* Header */}
      <header className="text-center pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Desbloqueie sua Dopamina
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Comecei esse material como um projeto acadêmico, quase terapêutico. Quanto mais eu estudava sobre dopamina, mais eu entendia minhas próprias sabotagens. No fim, ficou exatamente tudo o que eu queria falar pras pessoas. Cuide de sí mesmo, sua mente é seu bem mais precioso.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-16">
        {/* Hero Image */}
        <div className="mb-16">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-blue-600 to-purple-700 min-h-[400px] md:min-h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center text-white max-w-md mx-auto">
                <Brain className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 mx-auto mb-4 opacity-90" />
                <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 leading-tight">Desbloqueie sua Dopamina</h2>
                <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6">Guia Prático de Foco Mental</p>
                <div className="mt-4">
                  <a 
                    href="https://zsn.mycartpanda.com/checkout/191739029:1"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 sm:gap-3 bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Quero ler agora
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* Why I wrote this */}
          <section className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Por que escrevi isso?
                </h2>
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
            Porque meu cérebro virou um TikTok ambulante. Eu pulava de aba em aba, lia 3 parágrafos e já tava pegando o celular. A real? Eu não tava burro só tava dopado de estímulo o tempo todo. Esse livro é o resumo do que testei pra sair desse ciclo vicioso e recuperar o controle da minha atenção. Sem mágica, só neurociência aplicada na vida real.
            </p>
          </section>

          {/* What you'll find */}
          <section className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-xl">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  O que você vai encontrar aqui
                </h2>
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
          Nada que seja "mais do mesmo". Trouxe com base factual provas de que o seu cortéx pre frontal tá destruido. E pra piorar, ninguém quer que você "melhore". Te mostro o caminho que vai fazer você atingir o máximo que sua genética permitir.
            </p>
          </section>

          {/* Who is this for */}
          <section className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Pra quem eu escrevi isso?
                </h2>
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Pra quem sente que a mente tá no piloto automático. Pra quem quer clareza mental, foco e controle. 
              Se você quer algo direto, honesto e funcional — sem papo de guru — você vai se identificar.
            </p>
          </section>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
            O que as pessoas estão falando
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Marcos Silva</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Cara, eu tava viciado em Instagram e TikTok. Depois de aplicar as técnicas do ebook, consegui focar 3 horas seguidas estudando. Mudou minha vida!"
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Ana Costa</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Sem enrolação, sem promessa mágica. Só estratégias que realmente funcionam. Finalmente entendi por que eu não conseguia me concentrar."
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  R
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Rafael Santos</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Material incrível! Direto ao ponto, sem enrolação. Valeu cada centavo. Minha produtividade aumentou 300%."
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  L
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Larissa Oliveira</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Consegui organizar minha mente e parar de procrastinar. O conteúdo é gold, sério. Recomendo demais!"
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Outros Projetos */}
      <section className="bg-white border-t border-gray-200 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Outros Projetos
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Confira outros materiais que podem te ajudar a alcançar seus objetivos
          </p>
          <div className="flex justify-center">
            <a 
              href="/enem"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              ENEM na Veia
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 px-6 border-t border-gray-200 bg-white">
        <p className="text-gray-500">
          &copy; 2025 ProjectSZN.
        </p>
      </footer>
    </div>
  );
}

export default DopaminePage;