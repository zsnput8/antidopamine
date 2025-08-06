import React from 'react';
import { ExternalLink, BookOpen, Target, Users, Trophy } from 'lucide-react';

function EnemPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] text-gray-900">
      {/* Header */}
      <header className="text-center pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            ENEM na Veia
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Chega de estudar igual todo mundo e esperar resultado diferente. Esse material é pra quem quer passar no ENEM de verdade, sem enrolação e sem método mágico. É estratégia pura baseada em quem já passou.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-16">
        {/* Hero Image */}
        <div className="mb-16">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-green-600 to-blue-700 min-h-[400px] md:min-h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center text-white max-w-md mx-auto">
                <Trophy className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 mx-auto mb-4 opacity-90" />
                <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 leading-tight">ENEM na Veia</h2>
                <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6">Estratégias que Funcionam</p>
                <div className="mt-4">
                  <a 
                    href="#"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 sm:gap-3 bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Quero passar no ENEM
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* Why this works */}
          <section className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-xl">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Por que isso funciona?
                </h2>
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Porque não é teoria de YouTube. É método testado por quem tirou nota alta e entrou na federal. Sem mimimi, sem "estude 12 horas por dia". É estratégia inteligente pra quem quer resultado real em menos tempo.
            </p>
          </section>

          {/* What you'll get */}
          <section className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  O que você vai receber
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-lg text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                <p>Cronograma de estudos que realmente funciona (não é aquele genérico de cursinho)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                <p>Técnicas de redação que garantem nota 900+ (com exemplos reais)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                <p>Estratégias de chute inteligente pra quando você não souber</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                <p>Mindset de quem passa (sem coach quântico)</p>
              </div>
            </div>
          </section>

          {/* Who is this for */}
          <section className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Pra quem é esse material?
                </h2>
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Pra quem tá cansado de estudar sem direção. Pra quem quer entrar na federal sem depender de sorte. 
              Se você quer método comprovado, sem enrolação e sem promessa mágica, você tá no lugar certo.
            </p>
          </section>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
            Quem já passou conta a real
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  C
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Carlos - UFMG</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Tirei 780 na redação seguindo exatamente o que tá no material. A técnica de introdução é ouro puro!"
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  J
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Júlia - USP</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Estudei só 4 meses com esse método e passei em Medicina. O cronograma é perfeito!"
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  P
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Pedro - UFRJ</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "As estratégias de chute me salvaram. Acertei questões que nem sabia direito. Método funciona!"
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Maria - UNICAMP</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Direto ao ponto, sem enrolação. Exatamente o que eu precisava pra focar no que importa."
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-12 px-6 border-t border-gray-200 bg-white">
        <p className="text-gray-500">
          &copy; 2025 ProjectSZN.
        </p>
      </footer>
    </div>
  );
}

export default EnemPage;