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
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Birth Order</label>
            <select 
              value={config.groom_birth_order || "1"} 
              onChange={e => setConfig({...config, groom_birth_order: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            >
              <option value="1">First (1st)</option>
              <option value="2">Second (2nd)</option>
              <option value="3">Third (3rd)</option>
              <option value="4">Fourth (4th)</option>
              <option value="5">Fifth (5th)</option>
              <option value="youngest">Youngest</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
            <select 
              value={config.groom_gender || "son"} 
              onChange={e => setConfig({...config, groom_gender: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            >
              <option value="son">Son (Putra)</option>
              <option value="daughter">Daughter (Putri)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Father's Name (Without Mr/Bapak)</label>
            <input 
              type="text" 
              value={config.groom_father_name || ""} 
              onChange={e => setConfig({...config, groom_father_name: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              placeholder="e.g. Robert Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mother's Name (Without Mrs/Ibu)</label>
            <input 
              type="text" 
              value={config.groom_mother_name || ""} 
              onChange={e => setConfig({...config, groom_mother_name: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              placeholder="e.g. Alice Doe"
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
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Birth Order</label>
            <select 
              value={config.bride_birth_order || "2"} 
              onChange={e => setConfig({...config, bride_birth_order: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
            >
              <option value="1">First (1st)</option>
              <option value="2">Second (2nd)</option>
              <option value="3">Third (3rd)</option>
              <option value="4">Fourth (4th)</option>
              <option value="5">Fifth (5th)</option>
              <option value="youngest">Youngest</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
            <select 
              value={config.bride_gender || "daughter"} 
              onChange={e => setConfig({...config, bride_gender: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
            >
              <option value="son">Son (Putra)</option>
              <option value="daughter">Daughter (Putri)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Father's Name (Without Mr/Bapak)</label>
            <input 
              type="text" 
              value={config.bride_father_name || ""} 
              onChange={e => setConfig({...config, bride_father_name: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
              placeholder="e.g. Michael Smith"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mother's Name (Without Mrs/Ibu)</label>
            <input 
              type="text" 
              value={config.bride_mother_name || ""} 
              onChange={e => setConfig({...config, bride_mother_name: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
              placeholder="e.g. Sarah Smith"
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
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3 inline mr-1" /> Access PIN Code
            </label>
            <input 
              type="text" 
              value={config.wo_pin_code || "123456"} 
              onChange={e => setConfig({...config, wo_pin_code: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono tracking-widest focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
              placeholder="e.g. 123456"
            />
            <p className="text-[10px] text-slate-400 mt-1.5">
              PIN code used by Wedding Organizers and Ushers to access the reception check-in portal.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
