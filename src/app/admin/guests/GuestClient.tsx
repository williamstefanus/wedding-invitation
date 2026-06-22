"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Edit2, Trash2, Search, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { createGuest, updateGuest, deleteGuest } from "@/lib/actions/guests";
import type { Guest, GuestOwner, GuestCategory } from "@/types";

interface GuestClientProps {
  initialGuests: Guest[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentSearch: string;
  currentOwner: string;
  currentCategory: string;
}

export function GuestClient({
  initialGuests,
  total,
  totalPages,
  currentPage,
  currentSearch,
  currentOwner,
  currentCategory
}: GuestClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    owner: "William" as GuestOwner,
    category: "Friends" as GuestCategory,
    notes: ""
  });

  // URL Updates (Search, Filter, Pagination)
  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Reset to page 1 if searching or filtering (but not if just changing page)
    if (updates.search !== undefined || updates.owner !== undefined || updates.category !== undefined) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUrl({ search: e.target.value });
  };

  const handleOwnerFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrl({ owner: e.target.value });
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrl({ category: e.target.value });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Actions
  const openAddModal = () => {
    setSelectedGuest(null);
    setFormData({
      name: "",
      phone: "",
      owner: "William",
      category: "Friends",
      notes: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (guest: Guest) => {
    setSelectedGuest(guest);
    setFormData({
      name: guest.name,
      phone: guest.phone || "",
      owner: guest.owner || "William",
      category: guest.category || "Friends",
      notes: guest.notes || ""
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsDeleteOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGuest) {
      await updateGuest(selectedGuest.id, formData);
    } else {
      await createGuest(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedGuest) {
      await deleteGuest(selectedGuest.id);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Guest Management</h1>
          <p className="text-slate-500 mt-1">Total {total} guests found.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Add Guest
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            defaultValue={currentSearch}
            onChange={(e) => {
              // Debounce could be added here, but for MVP simple onChange is fine
              handleSearch(e);
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={currentOwner} 
            onChange={handleOwnerFilter}
            className="flex-1 md:w-40 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="All">All Owners</option>
            <option value="William">William</option>
            <option value="Aziel">Aziel</option>
          </select>
          <select 
            value={currentCategory} 
            onChange={handleCategoryFilter}
            className="flex-1 md:w-40 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="All">All Categories</option>
            <option value="Relatives">Relatives</option>
            <option value="Friends">Friends</option>
            <option value="Church">Church</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Created Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No guests found matching your criteria.
                  </td>
                </tr>
              ) : (
                initialGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{guest.name}</td>
                    <td className="px-6 py-4 text-slate-600">{guest.phone || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${guest.owner === 'William' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                        {guest.owner}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{guest.category}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(guest.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(guest)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => openDeleteModal(guest)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <span className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1 || isPending}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                disabled={currentPage === totalPages || isPending}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">{selectedGuest ? 'Edit Guest' : 'Add Guest'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number (Optional)</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                  <select 
                    value={formData.owner}
                    onChange={e => setFormData({...formData, owner: e.target.value as GuestOwner})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="William">William</option>
                    <option value="Aziel">Aziel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as GuestCategory})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="Relatives">Relatives</option>
                    <option value="Friends">Friends</option>
                    <option value="Church">Church</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 min-h-[80px]"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition">Save Guest</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Guest?</h2>
            <p className="text-slate-500 mb-6">Are you sure you want to delete {selectedGuest?.name}? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 flex-1 text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
