import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="text-slate-400" /> Settings
        </h1>
        <p className="text-slate-500 mt-1">Manage your shop preferences and AI Agent.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-4 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800">AI Agent (AGENT_ENABLED)</h3>
          <p className="text-sm text-slate-500">Turn the AI Copilot on or off.</p>
        </div>
        <div className="w-12 h-6 bg-red-500 rounded-full relative cursor-pointer">
          <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
        </div>
      </div>
    </div>
  )
}