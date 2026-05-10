import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Filter, 
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  LogIn,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { db, auth, loginWithGoogle, logout } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { useNavigate } from 'react-router-dom';

interface Complaint {
  id: string;
  tripleName: string;
  fullName?: string;
  phone: string;
  category: string;
  tribe?: string;
  complaint: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: any;
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Complaint[];
      setComplaints(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'complaints');
    });

    return () => unsubscribe();
  }, [user]);

  const updateStatus = async (id: string, newStatus: 'pending' | 'reviewed' | 'resolved') => {
    try {
      const docRef = doc(db, 'complaints', id);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `complaints/${id}`);
    }
  };

  const filteredComplaints = complaints.filter(c => 
    c.tripleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle size={14} />;
      case 'reviewed': return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Maamulka Himilo</h2>
          <p className="text-slate-500 mb-10">Fadlan gal si aad u gasho qaybta maamulka ee cabashooyinka.</p>
          
          <button 
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl transition-all shadow-sm active:scale-95"
          >
            <LogIn size={20} />
            Ku Gal Google
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="mt-6 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium text-sm mx-auto"
          >
            <ChevronLeft size={16} />
            Ku Noqo Bogga Hore
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold">HQ</span>
            </div>
            <h1 className="font-bold text-lg">Maamulka</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-xl text-sm font-bold">
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition-all">
            <Users size={18} />
            Cabashooyinka
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <img src={user.photoURL || ''} alt="avatar" className="w-10 h-10 rounded-full border border-slate-700" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.displayName}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-bold transition-all"
          >
            <LogOut size={18} />
            Ka Bax
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-bold text-slate-900">Guud ahaan Cabashooyinka</h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Raadi magac ama tel..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-blue-600 rounded-xl text-sm w-64 outline-none transition-all"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="flex-1 overflow-y-auto p-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Wadarta', count: complaints.length, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Cusub', count: complaints.filter(c => c.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'La Xaliyey', count: complaints.filter(c => c.status === 'resolved').length, color: 'text-green-600', bg: 'bg-green-50' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`${stat.bg} p-6 rounded-2xl border border-slate-100`}
              >
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                <p className={`text-4xl font-black ${stat.color} mt-2`}>{stat.count}</p>
              </motion.div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dhibanaha</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Qeybta</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Taariikhda</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Bedel Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{complaint.tripleName}</p>
                        <p className="text-xs text-slate-500">{complaint.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {complaint.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {complaint.createdAt?.toDate?.() ? complaint.createdAt.toDate().toLocaleDateString() : '...ing'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          {complaint.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={complaint.status}
                          onChange={(e) => updateStatus(complaint.id, e.target.value as any)}
                          className="text-xs border border-slate-200 rounded-lg p-1.5 outline-none focus:border-blue-600 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredComplaints.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-slate-500 font-medium">Wax natiijo ah lama helin.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
