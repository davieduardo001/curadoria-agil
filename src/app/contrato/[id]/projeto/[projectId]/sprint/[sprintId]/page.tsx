'use client';

import { PencilSquareIcon, LockClosedIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';


export default function SprintPlanningPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <main className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Visualizar Sprint</h1>
        <p className="text-gray-500 mb-6">Visualize os detalhes da sprint atual para acompanhar o progresso, as tarefas e os objetivos alcançados.</p>

        {/* Step Navigation */}
        <div className="flex gap-4 mb-8">
          {/* Planning */}
          <div className="flex-1 bg-white border-2 border-emerald-400 rounded-lg p-4 flex flex-col shadow-sm">
            <div className="flex items-center mb-2">
              <span className="font-semibold text-emerald-700 mr-2">Planning</span>
              <ChevronRightIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-gray-500">Na Planning, definimos e organizamos as atividades da próxima sprint, alinhando metas e prioridades.</p>
          </div>
          {/* Review */}
          <div className="flex-1 bg-white border-2 border-emerald-200 rounded-lg p-4 flex flex-col shadow-sm">
            <div className="flex items-center mb-2">
              <span className="font-semibold text-emerald-700 mr-2">Review</span>
              <ChevronRightIcon className="w-4 h-4 text-emerald-200" />
            </div>
            <p className="text-xs text-gray-500">Na Review, avaliamos o progresso da sprint e reconhecemos os resultados alcançados para feedback e ajustes.</p>
          </div>
          {/* Retrospectiva */}
          <div className="flex-1 bg-white border-2 border-emerald-200 rounded-lg p-4 flex flex-col shadow-sm">
            <div className="flex items-center mb-2">
              <span className="font-semibold text-emerald-700 mr-2">Retrospectiva</span>
              <ChevronRightIcon className="w-4 h-4 text-emerald-200" />
            </div>
            <p className="text-xs text-gray-500">Na Retro, refletimos sobre o desempenho da sprint, discutindo o que funcionou bem e o que pode ser melhorado para aprimorar o processo.</p>
          </div>
        </div>

        {/* Dados da Sprint Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Dados da Sprint</h2>
            <button className="p-2 rounded hover:bg-gray-100">
              <PencilSquareIcon className="w-5 h-5 text-emerald-600" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <span className="block text-gray-500 text-xs mb-1">Meta da Sprint</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">Xxxxxxxxxxxx</div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Número do Sprint</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">Xxxxxxxxxxxx</div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Data Inicial</span>
              <div className="flex items-center font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">
                xx/xx/xxxx
                <LockClosedIcon className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Data Final</span>
              <div className="flex items-center font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">
                xx/xx/xxxx
                <LockClosedIcon className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </div>
            <div className="md:col-span-2">
              <span className="block text-gray-500 text-xs mb-1">Observações</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2 min-h-[56px]"></div>
            </div>
          </div>
        </div>


        {/* Dados da Planning Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Dados da Planning</h2>
            <button className="p-2 rounded hover:bg-gray-100">
              <PencilSquareIcon className="w-5 h-5 text-emerald-600" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <span className="block text-gray-500 text-xs mb-1">Data de Realização</span>
              <div className="flex items-center font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">xx/xx/xxxx <LockClosedIcon className="w-4 h-4 text-gray-400 ml-2" /></div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Data Envio de E-mail PO</span>
              <div className="flex items-center font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">xx/xx/xxxx <LockClosedIcon className="w-4 h-4 text-gray-400 ml-2" /></div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Quantidade de U's Movimentados Sprint Anterior</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">Xxxxxxxxxxxx</div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Quantidade BUGs</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">Xxxxxxxxxxxx</div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Quantidade de U's</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">Xxxxxxxxxxxx</div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Total Story Points</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">Xxxxxxxxxxxx</div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Total Capacity</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">Xxxxxxxxxxxx</div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Quantidade Pontos de Função</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">Xxxxxxxxxxxx</div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">US Próxima Sprint</span>
              <div className="flex gap-2 mt-1">
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-emerald-600" checked readOnly />
                  <span className="ml-2">Sim</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-emerald-600" readOnly />
                  <span className="ml-2">Não</span>
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <span className="block text-gray-500 text-xs mb-1">Observações</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2 min-h-[56px]"></div>
            </div>
          </div>
        </div>

        {/* Dados da Review Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Dados da Review</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded hover:bg-gray-100">
                <PencilSquareIcon className="w-5 h-5 text-emerald-600" />
              </button>
              <button className="p-2 rounded hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <span className="block text-gray-500 text-xs mb-1">Data de Realização</span>
              <div className="flex items-center font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">xx/xx/xxxx <LockClosedIcon className="w-4 h-4 text-gray-400 ml-2" /></div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Ambiente Apresentado</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">Xxxxxxxxxxxx</div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Demandas DEV+QA Finalizadas</span>
              <div className="flex gap-2 mt-1">
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-emerald-600" checked readOnly />
                  <span className="ml-2">Sim</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-emerald-600" readOnly />
                  <span className="ml-2">Não</span>
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="md:col-span-2">
              <span className="block text-gray-500 text-xs mb-1">Considerações do Cliente</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2 min-h-[40px]">Xxxxxxxxxxxx</div>
            </div>
            <div className="md:col-span-2">
              <span className="block text-gray-500 text-xs mb-1">Observações</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2 min-h-[40px]"></div>
            </div>
          </div>
        </div>

        {/* Dados Retrospectiva Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Dados Retrospectiva</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded hover:bg-gray-100">
                <PencilSquareIcon className="w-5 h-5 text-emerald-600" />
              </button>
              <button className="p-2 rounded hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <span className="block text-gray-500 text-xs mb-1">Data de Realização</span>
              <div className="flex items-center font-medium text-gray-800 bg-gray-50 rounded px-3 py-2">xx/xx/xxxx <LockClosedIcon className="w-4 h-4 text-gray-400 ml-2" /></div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">Lição Sprint Anterior</span>
              <div className="flex gap-2 mt-1">
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-emerald-600" checked readOnly />
                  <span className="ml-2">Sim</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-emerald-600" readOnly />
                  <span className="ml-2">Não</span>
                </label>
              </div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs mb-1">E-mail PO Resultado Sprint</span>
              <div className="flex gap-2 mt-1">
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-emerald-600" checked readOnly />
                  <span className="ml-2">Sim</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-emerald-600" readOnly />
                  <span className="ml-2">Não</span>
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="md:col-span-2">
              <span className="block text-gray-500 text-xs mb-1">Lição aplicada nesta sprint</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2 min-h-[40px]">Xxxxxxxxxxxx</div>
            </div>
            <div className="md:col-span-2">
              <span className="block text-gray-500 text-xs mb-1">Ações para Próxima Sprint</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2 min-h-[40px]">Xxxxxxxxxxxx</div>
            </div>
            <div className="md:col-span-2">
              <span className="block text-gray-500 text-xs mb-1">Observações</span>
              <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2 min-h-[40px]"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
