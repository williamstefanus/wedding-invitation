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
              value={config.groomFirstName || ""} 
              onChange={e => setConfig({...config, groomFirstName: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              placeholder="e.g. John"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
            <input 
              type="text" 
              value={config.groomLastName || ""} 
              onChange={e => setConfig({...config, groomLastName: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              placeholder="e.g. Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title / Gelar</label>
            <input 
              type="text" 
              value={config.groomTitle || ""} 
              onChange={e => setConfig({...config, groomTitle: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              placeholder="e.g. S.Kom"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Birth Order</label>
            <select 
              value={config.groomBirthOrder || "1"} 
              onChange={e => setConfig({...config, groomBirthOrder: e.target.value})}
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
              value={config.groomGender || "son"} 
              onChange={e => setConfig({...config, groomGender: e.target.value})}
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
              value={config.groomFatherName || ""} 
              onChange={e => setConfig({...config, groomFatherName: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              placeholder="e.g. Robert Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mother's Name (Without Mrs/Ibu)</label>
            <input 
              type="text" 
              value={config.groomMotherName || ""} 
              onChange={e => setConfig({...config, groomMotherName: e.target.value})}
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
              value={config.phoneGroom || ""} 
              onChange={e => setConfig({...config, phoneGroom: e.target.value})}
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
            <input type="text" value={config.giftBankGroom || ""} onChange={e => setConfig({...config, giftBankGroom: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" placeholder="e.g. BCA"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Account Number</label>
            <input type="text" value={config.giftAccountGroom || ""} onChange={e => setConfig({...config, giftAccountGroom: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" placeholder="e.g. 1234567890"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Account Holder Name</label>
            <input type="text" value={config.giftNameGroom || ""} onChange={e => setConfig({...config, giftNameGroom: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" placeholder="e.g. John Doe"/>
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
              value={config.brideFirstName || ""} 
              onChange={e => setConfig({...config, brideFirstName: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
              placeholder="e.g. Jane"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
            <input 
              type="text" 
              value={config.brideLastName || ""} 
              onChange={e => setConfig({...config, brideLastName: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
              placeholder="e.g. Smith"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title / Gelar</label>
            <input 
              type="text" 
              value={config.brideTitle || ""} 
              onChange={e => setConfig({...config, brideTitle: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
              placeholder="e.g. B.A"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Birth Order</label>
            <select 
              value={config.brideBirthOrder || "2"} 
              onChange={e => setConfig({...config, brideBirthOrder: e.target.value})}
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
              value={config.brideGender || "daughter"} 
              onChange={e => setConfig({...config, brideGender: e.target.value})}
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
              value={config.brideFatherName || ""} 
              onChange={e => setConfig({...config, brideFatherName: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
              placeholder="e.g. Michael Smith"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mother's Name (Without Mrs/Ibu)</label>
            <input 
              type="text" 
              value={config.brideMotherName || ""} 
              onChange={e => setConfig({...config, brideMotherName: e.target.value})}
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
              value={config.phoneBride || ""} 
              onChange={e => setConfig({...config, phoneBride: e.target.value})}
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
            <input type="text" value={config.giftBankBride || ""} onChange={e => setConfig({...config, giftBankBride: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition" placeholder="e.g. BCA"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Account Number</label>
            <input type="text" value={config.giftAccountBride || ""} onChange={e => setConfig({...config, giftAccountBride: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition" placeholder="e.g. 0987654321"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Account Holder Name</label>
            <input type="text" value={config.giftNameBride || ""} onChange={e => setConfig({...config, giftNameBride: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition" placeholder="e.g. Jane Smith"/>
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
              value={config.woPin || "123456"} 
              onChange={e => setConfig({...config, woPin: e.target.value})}
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
