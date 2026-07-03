"use client";

import { User, Phone, Gift, Lock } from "lucide-react";

interface GeneralSettingsFormProps {
  config: any;
  setConfig: (config: any) => void;
}

export function GeneralSettingsForm({
  config,
  setConfig,
}: GeneralSettingsFormProps) {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Groom Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" /> Groom Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">First Name</label>
            <input 
              type="text" 
              value={config.groom_first_name || ""} 
              onChange={e => setConfig({...config, groom_first_name: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              placeholder="e.g. John"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
            <input 
              type="text" 
              value={config.groom_last_name || ""} 
              onChange={e => setConfig({...config, groom_last_name: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              placeholder="e.g. Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title / Gelar</label>
            <input 
              type="text" 
              value={config.groom_title || ""} 
              onChange={e => setConfig({...config, groom_title: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              placeholder="e.g. S.Kom"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Birth Order Title</label>
            <input 
              type="text" 
              value={config.groom_order_title || ""} 
              onChange={e => setConfig({...config, groom_order_title: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              placeholder="e.g. First son of / Putra pertama dari"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Parents' Names</label>
            <input 
              type="text" 
              value={config.groom_parents || ""} 
              onChange={e => setConfig({...config, groom_parents: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              placeholder="e.g. Mr. Robert Doe & Mrs. Alice Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Phone className="w-3 h-3" /> WhatsApp Phone
            </label>
            <input 
              type="text" 
              value={config.phone_groom || ""} 
              onChange={e => setConfig({...config, phone_groom: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition text-sm"
              placeholder="e.g. +628123456789"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-700 mt-6 mb-4 flex items-center gap-2">
          <Gift className="w-4 h-4 text-blue-500" /> Gift Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bank Name</label>
            <input type="text" value={config.gift_bank_groom || ""} onChange={e => setConfig({...config, gift_bank_groom: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" placeholder="e.g. BCA"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Account Number</label>
            <input type="text" value={config.gift_account_groom || ""} onChange={e => setConfig({...config, gift_account_groom: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" placeholder="e.g. 1234567890"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Account Holder Name</label>
            <input type="text" value={config.gift_name_groom || ""} onChange={e => setConfig({...config, gift_name_groom: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" placeholder="e.g. John Doe"/>
          </div>
        </div>
      </div>

      {/* Bride Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-pink-600" /> Bride Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">First Name</label>
            <input 
              type="text" 
              value={config.bride_first_name || ""} 
              onChange={e => setConfig({...config, bride_first_name: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
              placeholder="e.g. Jane"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
            <input 
              type="text" 
              value={config.bride_last_name || ""} 
              onChange={e => setConfig({...config, bride_last_name: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
              placeholder="e.g. Smith"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title / Gelar</label>
            <input 
              type="text" 
              value={config.bride_title || ""} 
              onChange={e => setConfig({...config, bride_title: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
              placeholder="e.g. B.A"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Birth Order Title</label>
            <input 
              type="text" 
              value={config.bride_order_title || ""} 
              onChange={e => setConfig({...config, bride_order_title: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
              placeholder="e.g. Second daughter of / Putri kedua dari"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Parents' Names</label>
            <input 
              type="text" 
              value={config.bride_parents || ""} 
              onChange={e => setConfig({...config, bride_parents: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
              placeholder="e.g. Mr. Michael Smith & Mrs. Sarah Smith"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Phone className="w-3 h-3" /> WhatsApp Phone
            </label>
            <input 
              type="text" 
              value={config.phone_bride || ""} 
              onChange={e => setConfig({...config, phone_bride: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition text-sm"
              placeholder="e.g. +628123456789"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-700 mt-6 mb-4 flex items-center gap-2">
          <Gift className="w-4 h-4 text-pink-500" /> Gift Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bank Name</label>
            <input type="text" value={config.gift_bank_bride || ""} onChange={e => setConfig({...config, gift_bank_bride: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition" placeholder="e.g. BCA"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Account Number</label>
            <input type="text" value={config.gift_account_bride || ""} onChange={e => setConfig({...config, gift_account_bride: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition" placeholder="e.g. 0987654321"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Account Holder Name</label>
            <input type="text" value={config.gift_name_bride || ""} onChange={e => setConfig({...config, gift_name_bride: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition" placeholder="e.g. Jane Smith"/>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" /> System Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">WO Access PIN Code</label>
            <input 
              type="text" 
              placeholder="e.g. 123456"
              value={config.wo_pin || ""} 
              onChange={e => setConfig({...config, wo_pin: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
            />
            <p className="text-xs text-slate-400 mt-2">PIN code used by ushers and receptionists to unlock the /usher check-in portal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
