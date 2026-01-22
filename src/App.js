import React, { useState, useEffect, useRef } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Lock, User, Plus, Minus, ShoppingCart, History, Settings, LogOut, LogIn, CreditCard, Key, Mail, Users, Trophy, Crown, Gift, Wallet, PiggyBank, Cloud, Shield, Edit, AlertTriangle, CheckCircle, XCircle, Clock, Save, Trash2, DollarSign, FolderPlus, Folder, ChevronUp, ChevronDown, Maximize2, UserMinus, FolderMinus, FileText, UserPlus, AlertCircle } from 'lucide-react';

// Initial student data
const initialStudents = Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  name: `Aluno ${i + 1}`,
  nickname: `Aluno ${i + 1}`,
  email: `aluno${i + 1}@instituicao.edu.br`,
  password: `senha${i + 1}`,
  balance: 1000,
  purchases: [],
  pendingRequests: [],
  classId: 'geral'
}));

const initialMenuItems = [
  { id: 1, name: 'Donut da Moe', price: 50, category: 'Bebidas' },
  { id: 2, name: 'Cerveja Duff', price: 120, category: 'Alimentos' },
  { id: 3, name: 'Pizza do Luigi', price: 180, category: 'Alimentos' },
  { id: 4, name: 'Squishee', price: 40, category: 'Bebidas' },
  { id: 5, name: 'Sorvete do Apu', price: 80, category: 'Sobremesas' },
  { id: 6, name: 'Bolo da Marge', price: 60, category: 'Sobremesas' }
];

const initialClasses = [
  { id: 'geral', name: 'Turma Geral', studentCount: 32 }
];

const MICROSOFT_DOMAINS = ['professor.educacao.sp.gov.br', 'portalsesisp.org.br'];
const ALLOWED_DOMAINS = [...MICROSOFT_DOMAINS];

const MrBurnsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16">
    <ellipse cx="50" cy="35" rx="25" ry="20" fill="#f8f8f8" stroke="#000" strokeWidth="2"/>
    <circle cx="40" cy="30" r="5" fill="#000"/>
    <circle cx="60" cy="30" r="5" fill="#000"/>
    <path d="M35 25 Q40 20 45 25" stroke="#000" strokeWidth="2" fill="none"/>
    <path d="M55 25 Q60 20 65 25" stroke="#000" strokeWidth="2" fill="none"/>
    <path d="M40 45 Q50 55 60 45" stroke="#000" strokeWidth="2" fill="none"/>
    <path d="M45 55 L50 70 L55 55 Z" fill="#ff0000" stroke="#000" strokeWidth="1"/>
    <rect x="35" y="55" width="30" height="25" fill="#000080" stroke="#000" strokeWidth="2"/>
    <rect x="30" y="50" width="40" height="10" fill="#ffffff" stroke="#000" strokeWidth="1"/>
  </svg>
);

export default function App() {
  const [students, setStudents] = useState(initialStudents);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [classes, setClasses] = useState(initialClasses);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '', category: '' });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userType, setUserType] = useState('student');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentNickname, setNewStudentNickname] = useState('');
  const [resetStudentEmail, setResetStudentEmail] = useState('');
  const [selectedClass, setSelectedClass] = useState('geral');
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [newProfessorEmail, setNewProfessorEmail] = useState('');
  const [newProfessorPassword, setNewProfessorPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [accountSettingsError, setAccountSettingsError] = useState('');
  const [accountSettingsSuccess, setAccountSettingsSuccess] = useState('');
  const [showSavedIcon, setShowSavedIcon] = useState(false);
  const [debitStudentId, setDebitStudentId] = useState('');
  const [debitItemId, setDebitItemId] = useState('');
  const [debitDescription, setDebitDescription] = useState('');
  const [creditStudentId, setCreditStudentId] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditDescription, setCreditDescription] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [studentClassId, setStudentClassId] = useState('geral');
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const studentsListRef = useRef(null);
  const [showScrollControls, setShowScrollControls] = useState(false);
  const [savedData, setSavedData] = useState(null);

  useEffect(() => {
    if (showSavedIcon) {
      const timer = setTimeout(() => setShowSavedIcon(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSavedIcon]);

  useEffect(() => {
    const checkScroll = () => {
      if (studentsListRef.current) {
        const { scrollHeight, clientHeight } = studentsListRef.current;
        setShowScrollControls(scrollHeight > clientHeight);
      }
    };
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [students]);

  const saveData = () => {
    const dataToSave = {
      professor: currentUser?.type === 'professor' ? { email: currentUser.email } : null,
      students,
      menuItems,
      classes,
      lastSaved: new Date().toISOString()
    };

    const dataStr = JSON.stringify(dataToSave, null, 2);
    const dataUri = 'application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'ligra_bank_data.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowSavedIcon(true);
  };

  const loadSavedData = (data) => {
    if (data.students) setStudents(data.students);
    if (data.menuItems) setMenuItems(data.menuItems);
    if (data.classes) setClasses(data.classes);
    setSavedData(data);
  };

  const handleRegisterProfessor = () => {
    const email = registerEmail.trim().toLowerCase();
    const password = registerPassword;
    const confirm = registerConfirmPassword;

    const domain = email.split('@')[1];
    if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
      setRegisterError('E-mail institucional inválido. Use um dos domínios Microsoft permitidos.');
      return;
    }

    if (password.length < 6) {
      setRegisterError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirm) {
      setRegisterError('As senhas não conferem.');
      return;
    }

    const initialData = {
      professor: { email, password },
      students: initialStudents,
      menuItems: initialMenuItems,
      classes: initialClasses
    };

    loadSavedData(initialData);
    setCurrentUser({ email, type: 'professor' });
    setCurrentView('admin');
    setShowRegister(false);
    setRegisterError('');
  };

  const handleLogin = () => {
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword;

    if (!email || !password) {
      setLoginError('Preencha todos os campos.');
      return;
    }

    const domain = email.split('@')[1];
    if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
      if (userType === 'professor') {
        setLoginError('Domínio não autorizado para professores. Use um domínio Microsoft permitido.');
      } else {
        // Alunos podem ter qualquer domínio (professores criam logins para eles)
        const student = students.find(s =>
          s.email.toLowerCase() === email && s.password === password
        );
        if (student) {
          setCurrentUser(student);
          setCurrentView('dashboard');
          setLoginError('');
        } else {
          setLoginError('Email ou senha incorretos');
        }
      }
      return;
    }

    if (userType === 'professor') {
      if (!savedData) {
        setLoginError('Primeiro acesso: use o botão "Cadastrar Professor".');
        return;
      }
      if (savedData.professor.email === email && savedData.professor.password === password) {
        setCurrentUser({ email, type: 'professor' });
        setCurrentView('admin');
        setLoginError('');
        loadSavedData(savedData);
      } else {
        setLoginError('Credenciais inválidas.');
      }
    } else {
      const student = students.find(s =>
        s.email.toLowerCase() === email && s.password === password
      );
      if (student) {
        setCurrentUser(student);
        setCurrentView('dashboard');
        setLoginError('');
      } else {
        setLoginError('Email ou senha incorretos');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    setLoginEmail('');
    setLoginPassword('');
    setUserType('student');
    setShowAccountSettings(false);
    setAccountSettingsError('');
    setAccountSettingsSuccess('');
  };

  const requestCredit = (amount) => {
    if (currentUser && amount > 0) {
      const newRequest = {
        id: Date.now(),
        type: 'credit',
        amount: amount,
        status: 'pending',
        date: new Date().toLocaleString()
      };
      const updatedStudents = students.map(student =>
        student.id === currentUser.id
          ? { ...student, pendingRequests: [...student.pendingRequests, newRequest] }
          : student
      );
      setStudents(updatedStudents);
      setCurrentUser({ ...currentUser, pendingRequests: [...currentUser.pendingRequests, newRequest] });
      saveData();
    }
  };

  const requestPurchase = (itemId) => {
    if (!currentUser || currentUser.type === 'professor') return;
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    const newRequest = {
      id: Date.now(),
      type: 'purchase',
      itemId: item.id,
      itemName: item.name,
      price: item.price,
      status: 'pending',
      date: new Date().toLocaleString()
    };
    const updatedStudents = students.map(student =>
      student.id === currentUser.id
        ? { ...student, pendingRequests: [...student.pendingRequests, newRequest] }
        : student
    );
    setStudents(updatedStudents);
    setCurrentUser({ ...currentUser, pendingRequests: [...currentUser.pendingRequests, newRequest] });
    saveData();
  };

  const approveRequest = (studentId, requestId) => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        const updatedRequests = student.pendingRequests.map(req => 
          req.id === requestId ? { ...req, status: 'approved' } : req
        );
        const approvedRequest = student.pendingRequests.find(req => req.id === requestId);
        let newBalance = student.balance;
        let newPurchases = [...student.purchases];
        if (approvedRequest.type === 'credit') {
          newBalance += approvedRequest.amount;
        } else if (approvedRequest.type === 'purchase') {
          if (newBalance >= approvedRequest.price) {
            newBalance -= approvedRequest.price;
            newPurchases.push({
              id: approvedRequest.id,
              itemId: approvedRequest.itemId,
              itemName: approvedRequest.itemName,
              price: approvedRequest.price,
              date: approvedRequest.date
            });
          }
        }
        return {
          ...student,
          balance: newBalance,
          purchases: newPurchases,
          pendingRequests: updatedRequests
        };
      }
      return student;
    });
    setStudents(updatedStudents);
    if (currentUser && currentUser.id === studentId) {
      const updatedCurrentUser = updatedStudents.find(s => s.id === studentId);
      setCurrentUser(updatedCurrentUser);
    }
    saveData();
  };

  const rejectRequest = (studentId, requestId) => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        const updatedRequests = student.pendingRequests.map(req => 
          req.id === requestId ? { ...req, status: 'rejected' } : req
        );
        return { ...student, pendingRequests: updatedRequests };
      }
      return student;
    });
    setStudents(updatedStudents);
    if (currentUser && currentUser.id === studentId) {
      const updatedCurrentUser = updatedStudents.find(s => s.id === studentId);
      setCurrentUser(updatedCurrentUser);
    }
    saveData();
  };

  const debitStudentItem = () => {
    if (!debitStudentId || !debitItemId || !debitDescription.trim()) {
      alert('Por favor, preencha todos os campos, incluindo a descrição.');
      return;
    }
    const studentIndex = students.findIndex(s => s.id.toString() === debitStudentId);
    const item = menuItems.find(i => i.id.toString() === debitItemId);
    if (studentIndex === -1 || !item) return;
    const student = students[studentIndex];
    if (student.balance < item.price) {
      alert('Saldo insuficiente!');
      return;
    }
    const newPurchase = {
      id: Date.now(),
      itemId: item.id,
      itemName: item.name,
      price: item.price,
      date: new Date().toLocaleString(),
      debitedByProfessor: true,
      description: debitDescription
    };
    const updatedStudents = [...students];
    updatedStudents[studentIndex] = {
      ...student,
      balance: student.balance - item.price,
      purchases: [...student.purchases, newPurchase]
    };
    setStudents(updatedStudents);
    setDebitStudentId('');
    setDebitItemId('');
    setDebitDescription('');
    saveData();
  };

  const creditStudentDirect = () => {
    if (!creditStudentId || !creditAmount || !creditDescription.trim()) {
      alert('Por favor, preencha todos os campos, incluindo a descrição.');
      return;
    }
    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Valor de crédito inválido.');
      return;
    }
    const studentIndex = students.findIndex(s => s.id.toString() === creditStudentId);
    if (studentIndex === -1) return;
    const student = students[studentIndex];
    const newCreditRecord = {
      id: Date.now(),
      type: 'direct_credit',
      amount: amount,
      date: new Date().toLocaleString(),
      creditedByProfessor: true,
      description: creditDescription
    };
    const updatedStudents = [...students];
    updatedStudents[studentIndex] = {
      ...student,
      balance: student.balance + amount,
      purchases: [...student.purchases, newCreditRecord]
    };
    setStudents(updatedStudents);
    setCreditStudentId('');
    setCreditAmount('');
    setCreditDescription('');
    saveData();
  };

  const addMenuItem = () => {
    if (newMenuItem.name && newMenuItem.price && newMenuItem.category) {
      const newItem = {
        id: menuItems.length + 1,
        name: newMenuItem.name,
        price: parseInt(newMenuItem.price),
        category: newMenuItem.category
      };
      setMenuItems([...menuItems, newItem]);
      setNewMenuItem({ name: '', price: '', category: '' });
      saveData();
    }
  };

  const deleteMenuItem = (itemId) => {
    setMenuItems(menuItems.filter(item => item.id !== itemId));
    saveData();
  };

  const addStudentEmail = () => {
    if (newStudentEmail && newStudentEmail.includes('@')) {
      const newStudent = {
        id: students.length + 1,
        name: newStudentNickname || `Aluno ${students.length + 1}`,
        nickname: newStudentNickname || `Aluno ${students.length + 1}`,
        email: newStudentEmail,
        password: 'senha123',
        balance: 1000,
        purchases: [],
        pendingRequests: [],
        classId: studentClassId
      };
      const updatedStudents = [newStudent, ...students];
      setStudents(updatedStudents);
      const updatedClasses = classes.map(cls => 
        cls.id === studentClassId 
          ? { ...cls, studentCount: cls.studentCount + 1 }
          : cls
      );
      setClasses(updatedClasses);
      setNewStudentEmail('');
      setNewStudentNickname('');
      saveData();
    }
  };

  const deleteStudent = (studentId) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.')) {
      const studentToDelete = students.find(s => s.id === studentId);
      if (!studentToDelete) return;
      const updatedStudents = students.filter(s => s.id !== studentId);
      setStudents(updatedStudents);
      const updatedClasses = classes.map(cls => 
        cls.id === studentToDelete.classId 
          ? { ...cls, studentCount: Math.max(0, cls.studentCount - 1) }
          : cls
      );
      setClasses(updatedClasses);
      saveData();
    }
  };

  const resetStudentPassword = () => {
    if (resetStudentEmail) {
      const updatedStudents = students.map(student => {
        if (student.email.toLowerCase() === resetStudentEmail.toLowerCase()) {
          return { ...student, password: 'senha123' };
        }
        return student;
      });
      setStudents(updatedStudents);
      setResetStudentEmail('');
      alert('Senha redefinida para "senha123"');
      saveData();
    }
  };

  const createNewClass = () => {
    if (newClassName.trim()) {
      const newClass = {
        id: `class-${Date.now()}`,
        name: newClassName.trim(),
        studentCount: 0
      };
      setClasses([...classes, newClass]);
      setNewClassName('');
      saveData();
    }
  };

  const deleteClass = (classId) => {
    if (classId === 'geral') {
      alert('Não é possível excluir a turma geral.');
      return;
    }
    const classToDelete = classes.find(c => c.id === classId);
    if (!classToDelete) return;
    if (classToDelete.studentCount > 0) {
      if (!window.confirm(`A turma "${classToDelete.name}" contém ${classToDelete.studentCount} alunos. Deseja realmente excluí-la? Todos os alunos serão movidos para a turma geral.`)) {
        return;
      }
      const updatedStudents = students.map(student => 
        student.classId === classId 
          ? { ...student, classId: 'geral' }
          : student
      );
      setStudents(updatedStudents);
      const updatedClasses = classes
        .filter(c => c.id !== classId)
        .map(cls => 
          cls.id === 'geral' 
            ? { ...cls, studentCount: cls.studentCount + classToDelete.studentCount }
            : cls
        );
      setClasses(updatedClasses);
    } else {
      const updatedClasses = classes.filter(c => c.id !== classId);
      setClasses(updatedClasses);
    }
    if (selectedClass === classId) {
      setSelectedClass('geral');
    }
    saveData();
  };

  const updateProfessorAccount = () => {
    setAccountSettingsError('');
    setAccountSettingsSuccess('');
    if (!savedData || currentPassword !== savedData.professor.password) {
      setAccountSettingsError('Senha atual incorreta');
      return;
    }
    if (!newProfessorEmail || !newProfessorEmail.includes('@')) {
      setAccountSettingsError('Email inválido');
      return;
    }
    const domain = newProfessorEmail.split('@')[1];
    if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
      setAccountSettingsError('Domínio Microsoft não autorizado para professores.');
      return;
    }
    if (newProfessorPassword && newProfessorPassword !== confirmNewPassword) {
      setAccountSettingsError('As novas senhas não correspondem');
      return;
    }
    const updatedData = {
      ...savedData,
      professor: {
        email: newProfessorEmail,
        password: newProfessorPassword || savedData.professor.password
      }
    };
    loadSavedData(updatedData);
    setCurrentUser({ email: newProfessorEmail, type: 'professor' });
    setAccountSettingsSuccess('Credenciais atualizadas com sucesso!');
    saveData();
  };

  const scrollStudentsUp = () => {
    if (studentsListRef.current) {
      studentsListRef.current.scrollBy({ top: -100, behavior: 'smooth' });
    }
  };

  const scrollStudentsDown = () => {
    if (studentsListRef.current) {
      studentsListRef.current.scrollBy({ top: 100, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    if (studentsListRef.current) {
      studentsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (studentsListRef.current) {
      studentsListRef.current.scrollTo({ top: studentsListRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const StyledButton = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
    const baseClasses = "px-3 py-1.5 font-bold rounded border-2 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm";
    const variants = {
      primary: "bg-blue-600 border-blue-800 text-white shadow-lg",
      secondary: "bg-green-600 border-green-800 text-white shadow-lg",
      danger: "bg-red-600 border-red-800 text-white shadow-lg",
      admin: "bg-purple-600 border-purple-800 text-white shadow-lg",
      success: "bg-yellow-500 border-yellow-700 text-black shadow-lg",
      warning: "bg-orange-600 border-orange-800 text-white shadow-lg",
      simpsons: "bg-yellow-400 border-yellow-700 text-black shadow-lg"
    };
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 p-4 flex items-center justify-center relative overflow-hidden" style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}>
        <SpeedInsights />
        <div className="bg-yellow-100 border-4 border-black rounded-lg p-6 max-w-md w-full shadow-2xl relative z-10">
          <div className="text-center mb-4">
            <div className="inline-block bg-red-600 text-white px-3 py-1.5 rounded mb-3 relative">
              <Lock className="inline mr-1" size={20} />
              Ligra Bank - Miltown Sobrosville
            </div>
            <h1 className="text-xl font-bold text-green-800 mb-1">Bem-vindo ao Ligra Bank!</h1>
            <p className="text-black text-sm">Sistema de economia virtual - Escola de Springfield</p>
          </div>
          {showRegister ? (
            <div>
              <h2 className="text-lg font-bold text-purple-800 mb-3 text-center">Cadastrar Professor</h2>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="Seu e-mail Microsoft institucional"
                className="w-full p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 text-sm mb-2"
              />
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Senha (mín. 6 caracteres)"
                className="w-full p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 text-sm mb-2"
              />
              <input
                type="password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                placeholder="Confirme a senha"
                className="w-full p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 text-sm mb-2"
              />
              {registerError && (
                <div className="mb-2 p-1.5 bg-red-200 border-2 border-red-500 text-red-800 rounded text-xs">
                  {registerError}
                </div>
              )}
              <StyledButton onClick={handleRegisterProfessor} className="w-full mb-2">
                Cadastrar
              </StyledButton>
              <button
                onClick={() => setShowRegister(false)}
                className="text-blue-700 underline text-sm block text-center"
              >
                ← Voltar para login
              </button>
            </div>
          ) : (
            <>
              <div className="flex mb-3 bg-yellow-200 rounded p-0.5">
                <button
                  onClick={() => setUserType('student')}
                  className={`flex-1 py-1.5 px-3 rounded text-xs ${userType === 'student' ? 'bg-blue-600 text-white' : 'text-black'}`}
                >
                  Aluno
                </button>
                <button
                  onClick={() => setUserType('professor')}
                  className={`flex-1 py-1.5 px-3 rounded text-xs ${userType === 'professor' ? 'bg-purple-600 text-white' : 'text-black'}`}
                >
                  Professor
                </button>
              </div>
              <div className="mb-3">
                <label className="block text-black mb-1 text-xs" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2 text-gray-600" size={16} />
                  <input
                    id="email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 focus:border-black focus:outline-none text-sm"
                    placeholder={userType === 'student' ? 'aluno@instituicao.edu.br' : 'professor@instituicao.edu.br (Microsoft)'}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-black mb-1 text-xs" htmlFor="password">Senha</label>
                <div className="relative">
                  <Key className="absolute left-2 top-2 text-gray-600" size={16} />
                  <input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 focus:border-black focus:outline-none text-sm"
                    placeholder="Digite sua senha"
                  />
                </div>
              </div>
              {loginError && (
                <div className="mb-3 p-1.5 bg-red-200 border-2 border-red-500 text-red-800 rounded text-xs">
                  {loginError}
                </div>
              )}
              <StyledButton onClick={handleLogin} className="w-full mb-3">
                <LogIn className="inline mr-1" size={16} />
                Entrar
              </StyledButton>
              {userType === 'professor' && (
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-purple-700 font-bold flex items-center gap-1 text-sm justify-center"
                >
                  <UserPlus size={14} />
                  Primeiro acesso? Cadastre-se (Microsoft)
                </button>
              )}
              {userType === 'student' && (
                <div className="text-center text-xs text-blue-800">
                  {"Senha padrão: senha{número do aluno} (ou a definida pelo professor)"}
                </div>
              )}
            </>
          )}
        </div>
        {showSavedIcon && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1.5 rounded border-2 border-green-700 z-50 flex items-center">
            <Save className="mr-1" size={16} />
            Dados salvos!
          </div>
        )}
        <div className="absolute top-8 right-8">
          <MrBurnsIcon />
        </div>
      </div>
    );
  }

  if (currentView === 'dashboard' && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-4 relative overflow-hidden" style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}>
        <SpeedInsights />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-yellow-100 border-4 border-black rounded-lg p-3 mb-4 relative">
            <div className="absolute top-2 right-2">
              <Wallet className="text-yellow-800" size={24} />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg font-bold text-green-800">Ligra Bank - {currentUser.nickname}</h1>
                <p className="text-black text-sm">{currentUser.email}</p>
                <p className="text-purple-700 text-xs">
                  Turma: {classes.find(c => c.id === currentUser.classId)?.name || 'Geral'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-800">L$ {currentUser.balance}</div>
                <div className="text-xs text-gray-600">Saldo disponível</div>
              </div>
              <StyledButton onClick={handleLogout} variant="danger" className="text-xs">
                <LogOut className="inline mr-0.5" size={14} />
                Sair
              </StyledButton>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="bg-yellow-100 border-4 border-green-600 rounded-lg p-3 relative">
                <div className="absolute top-2 right-2">
                  <ShoppingCart className="text-green-800" size={20} />
                </div>
                <div className="flex items-center mb-2">
                  <h2 className="text-base font-bold text-yellow-800">Cardápio de Produtos</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {menuItems.map(item => (
                    <div key={item.id} className="bg-yellow-50 border-2 border-gray-400 rounded p-3 relative">
                      <div className="absolute top-1 right-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-xs">
                        L$ {item.price}
                      </div>
                      <h3 className="font-bold text-black mb-1 text-sm">{item.name}</h3>
                      <p className="text-gray-600 text-xs mb-2">Categoria: {item.category}</p>
                      <StyledButton
                        onClick={() => requestPurchase(item.id)}
                        className="w-full text-xs"
                      >
                        Solicitar Compra
                      </StyledButton>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-100 border-4 border-blue-600 rounded-lg p-3 relative">
                <div className="absolute top-2 right-2">
                  <CreditCard className="text-blue-800" size={20} />
                </div>
                <div className="flex items-center mb-2">
                  <h2 className="text-base font-bold text-blue-800">Solicitar Crédito</h2>
                </div>
                <div className="space-y-2">
                  {[100, 200, 500].map(amount => (
                    <StyledButton
                      key={amount}
                      onClick={() => requestCredit(amount)}
                      variant="secondary"
                      className="w-full text-xs"
                    >
                      + L$ {amount}
                    </StyledButton>
                  ))}
                </div>
                <div className="mt-2 text-xs text-orange-700">
                  <AlertTriangle className="inline mr-0.5" size={12} />
                  Aguardando aprovação do professor
                </div>
              </div>
              <div className="bg-yellow-100 border-4 border-purple-600 rounded-lg p-3 relative">
                <div className="absolute top-2 right-2">
                  <History className="text-purple-800" size={20} />
                </div>
                <div className="flex items-center mb-2">
                  <h2 className="text-base font-bold text-purple-800">Histórico</h2>
                </div>
                <div className="max-h-32 overflow-y-auto mb-2">
                  {currentUser.purchases.length === 0 ? (
                    <p className="text-gray-600 text-center text-xs">Nenhuma compra aprovada</p>
                  ) : (
                    currentUser.purchases.slice(-5).map(purchase => (
                      <div key={purchase.id} className="bg-yellow-50 p-1.5 mb-1.5 rounded border border-gray-300">
                        <div className="font-bold text-black text-xs">{purchase.itemName}</div>
                        <div className="text-red-700 text-xs">- L$ {purchase.price}</div>
                        <div className="text-gray-600 text-xs">{purchase.date}</div>
                        {purchase.description && (
                          <div className="text-gray-500 text-xs italic">"{purchase.description}"</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="font-bold text-yellow-800 text-xs mb-1">Solicitações Pendentes</h3>
                  <div className="max-h-32 overflow-y-auto">
                    {currentUser.pendingRequests.filter(req => req.status === 'pending').length === 0 ? (
                      <p className="text-gray-600 text-center text-xs">Nenhuma solicitação pendente</p>
                    ) : (
                      currentUser.pendingRequests
                        .filter(req => req.status === 'pending')
                        .slice(-5)
                        .map(request => (
                          <div key={request.id} className="bg-orange-100 p-1.5 mb-1.5 rounded border border-orange-400">
                            <div className="text-black text-xs">
                              {request.type === 'credit' ? `+ L$ ${request.amount}` : request.itemName}
                            </div>
                            <div className="text-orange-700 text-xs">{request.date}</div>
                            <div className="text-xs text-blue-700 flex items-center mt-0.5">
                              <Clock className="mr-0.5" size={10} />
                              Aguardando aprovação
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showSavedIcon && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1.5 rounded border-2 border-green-700 z-50 flex items-center">
            <Save className="mr-1" size={16} />
            Dados salvos!
          </div>
        )}
      </div>
    );
  }

  if (currentView === 'admin') {
    const allPendingRequests = students.flatMap(student => 
      student.pendingRequests
        .filter(req => req.status === 'pending')
        .map(req => ({ ...req, studentId: student.id, studentName: student.nickname, studentEmail: student.email }))
    );
    const filteredStudents = selectedClass === 'all' 
      ? students 
      : students.filter(s => s.classId === selectedClass);
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-4 relative overflow-hidden" style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}>
        <SpeedInsights />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-yellow-100 border-4 border-black rounded-lg p-3 mb-4 relative">
            <div className="absolute top-2 right-2">
              <MrBurnsIcon />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg font-bold text-purple-800">Ligra Bank - Painel do Professor</h1>
                <p className="text-black text-sm">Miss. Teacher.</p>
              </div>
              <StyledButton 
                onClick={() => setShowAccountSettings(!showAccountSettings)} 
                variant="admin"
                className="flex items-center text-xs"
              >
                <Shield className="mr-0.5" size={14} />
                Minha Conta
              </StyledButton>
              <StyledButton onClick={handleLogout} variant="danger" className="text-xs">
                <LogOut className="inline mr-0.5" size={14} />
                Sair
              </StyledButton>
            </div>
          </div>
          {showAccountSettings && (
            <div className="bg-yellow-100 border-4 border-cyan-600 rounded-lg p-4 mb-4 relative">
              <div className="flex items-center mb-2">
                <Edit className="mr-1 text-cyan-800" size={20} />
                <h2 className="text-base font-bold text-cyan-800">Configurações da Conta</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-2.5 rounded border border-gray-400">
                  <div className="flex items-center mb-1">
                    <Cloud className="mr-1 text-blue-800" size={16} />
                    <h3 className="font-bold text-black text-sm">Armazenamento em Nuvem</h3>
                  </div>
                  <p className="text-gray-700 text-xs">
                    Dados salvos automaticamente no OneDrive.
                  </p>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-black mb-1 text-xs" htmlFor="newEmail">Novo Email</label>
                    <input
                      id="newEmail"
                      type="email"
                      value={newProfessorEmail}
                      onChange={(e) => setNewProfessorEmail(e.target.value)}
                      className="w-full p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 text-xs"
                      placeholder="Novo email institucional"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1 text-xs" htmlFor="currentPassword">Senha Atual</label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 text-xs"
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1 text-xs" htmlFor="newPassword">Nova Senha</label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newProfessorPassword}
                      onChange={(e) => setNewProfessorPassword(e.target.value)}
                      className="w-full p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 text-xs"
                      placeholder="Deixe em branco para manter"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1 text-xs" htmlFor="confirmPassword">Confirmar Nova Senha</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 text-xs"
                      placeholder="Confirme a nova senha"
                    />
                  </div>
                  {accountSettingsError && (
                    <div className="p-1.5 bg-red-200 border-2 border-red-500 text-red-800 rounded text-xs">
                      {accountSettingsError}
                    </div>
                  )}
                  {accountSettingsSuccess && (
                    <div className="p-1.5 bg-green-200 border-2 border-green-500 text-green-800 rounded text-xs">
                      {accountSettingsSuccess}
                    </div>
                  )}
                  <StyledButton 
                    onClick={updateProfessorAccount} 
                    variant="success" 
                    className="w-full text-xs"
                  >
                    Atualizar Conta
                  </StyledButton>
                </div>
              </div>
            </div>
          )}
          <div className="bg-yellow-100 border-4 border-purple-600 rounded-lg p-3 mb-4">
            <div className="flex items-center mb-2">
              <FolderPlus className="mr-1 text-purple-800" size={20} />
              <h2 className="text-base font-bold text-purple-800">Gerenciar Turmas</h2>
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nome da nova turma"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="flex-1 p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 text-xs"
              />
              <StyledButton onClick={createNewClass} variant="admin" className="text-xs">
                Criar Turma
              </StyledButton>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              <StyledButton
                onClick={() => setSelectedClass('all')}
                variant={selectedClass === 'all' ? 'admin' : 'primary'}
                className="text-xs p-1.5"
              >
                Todas as Turmas
              </StyledButton>
              {classes.map(cls => (
                <div key={cls.id} className="flex items-center space-x-1">
                  <StyledButton
                    onClick={() => setSelectedClass(cls.id)}
                    variant={selectedClass === cls.id ? 'admin' : 'primary'}
                    className="text-xs p-1.5"
                  >
                    {cls.name} ({cls.studentCount})
                  </StyledButton>
                  {cls.id !== 'geral' && (
                    <StyledButton
                      onClick={() => deleteClass(cls.id)}
                      variant="danger"
                      className="p-1 w-6 h-6"
                      title={`Excluir turma ${cls.name}`}
                    >
                      <FolderMinus size={12} />
                    </StyledButton>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-yellow-100 border-4 border-green-600 rounded-lg p-3 mb-4">
            <div className="flex items-center mb-2">
              <DollarSign className="mr-1 text-green-800" size={20} />
              <h2 className="text-base font-bold text-green-800">Adição de Valor Direta</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <select
                value={creditStudentId}
                onChange={(e) => setCreditStudentId(e.target.value)}
                className="p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black text-xs"
              >
                <option value="">Selecione o Aluno</option>
                {filteredStudents.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.nickname} - {classes.find(c => c.id === student.classId)?.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Valor do crédito"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                className="p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black text-xs"
                min="1"
              />
              <input
                type="text"
                placeholder="Descrição do crédito"
                value={creditDescription}
                onChange={(e) => setCreditDescription(e.target.value)}
                className="p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black text-xs"
              />
              <StyledButton
                onClick={creditStudentDirect}
                variant="success"
                disabled={!creditStudentId || !creditAmount || !creditDescription.trim()}
                className="text-xs"
              >
                Adicionar Crédito
              </StyledButton>
            </div>
          </div>
          <div className="bg-yellow-100 border-4 border-red-600 rounded-lg p-3 mb-4">
            <div className="flex items-center mb-2">
              <DollarSign className="mr-1 text-red-800" size={20} />
              <h2 className="text-base font-bold text-red-800">Débito Direto do Professor</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <select
                value={debitStudentId}
                onChange={(e) => setDebitStudentId(e.target.value)}
                className="p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black text-xs"
              >
                <option value="">Selecione o Aluno</option>
                {filteredStudents.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.nickname} - {classes.find(c => c.id === student.classId)?.name}
                  </option>
                ))}
              </select>
              <select
                value={debitItemId}
                onChange={(e) => setDebitItemId(e.target.value)}
                className="p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black text-xs"
              >
                <option value="">Selecione o Item</option>
                {menuItems.map(item => (
                  <option key={item.id} value={item.id}>{item.name} (L$ {item.price})</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Descrição do débito"
                value={debitDescription}
                onChange={(e) => setDebitDescription(e.target.value)}
                className="p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black text-xs"
              />
              <StyledButton
                onClick={debitStudentItem}
                variant="danger"
                disabled={!debitStudentId || !debitItemId || !debitDescription.trim()}
                className="text-xs"
              >
                Debitar Agora
              </StyledButton>
            </div>
          </div>
          {allPendingRequests.length > 0 && (
            <div className="bg-yellow-100 border-4 border-orange-600 rounded-lg p-3 mb-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="mr-1 text-orange-800" size={20} />
                <h2 className="text-base font-bold text-orange-800">Solicitações Pendentes ({allPendingRequests.length})</h2>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {allPendingRequests.map(request => (
                  <div key={request.id} className="bg-orange-100 p-2 mb-2 rounded border border-orange-400">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-black">{request.studentName}</div>
                        <div className="text-purple-700 text-xs">
                          Turma: {classes.find(c => c.id === students.find(s => s.id === request.studentId)?.classId)?.name}
                        </div>
                        <div className="text-orange-700 text-xs">{request.studentEmail}</div>
                        <div className="text-black mt-1 text-sm">
                          {request.type === 'credit' 
                            ? `Solicitação de crédito: +L$ ${request.amount}`
                            : `Solicitação de compra: ${request.itemName} (L$ ${request.price})`
                          }
                        </div>
                        <div className="text-orange-600 text-xs">{request.date}</div>
                      </div>
                      <div className="flex space-x-1">
                        <StyledButton
                          onClick={() => approveRequest(request.studentId, request.id)}
                          variant="success"
                          className="p-1"
                        >
                          <CheckCircle size={14} />
                        </StyledButton>
                        <StyledButton
                          onClick={() => rejectRequest(request.studentId, request.id)}
                          variant="danger"
                          className="p-1"
                        >
                          <XCircle size={14} />
                        </StyledButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="bg-yellow-100 border-4 border-green-600 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <Users className="mr-1 text-green-800" size={20} />
                <h2 className="text-base font-bold text-green-800">Gerenciar Alunos</h2>
              </div>
              <div className="mb-2">
                <h3 className="font-bold text-black mb-1 text-xs">Adicionar Aluno</h3>
                <div className="flex gap-1">
                  <input
                    type="email"
                    placeholder="Email do novo aluno (gerado pelo professor)"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    className="flex-1 p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Nome/Apelido"
                    value={newStudentNickname}
                    onChange={(e) => setNewStudentNickname(e.target.value)}
                    className="p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 text-xs"
                  />
                  <select
                    value={studentClassId}
                    onChange={(e) => setStudentClassId(e.target.value)}
                    className="p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black text-xs"
                  >
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                  <StyledButton onClick={addStudentEmail} variant="success" className="p-1.5">
                    <UserPlus size={14} />
                  </StyledButton>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-black mb-1 text-xs">Redefinir Senha</h3>
                <div className="flex gap-1">
                  <input
                    type="email"
                    placeholder="Email do aluno (gerado pelo professor)"
                    value={resetStudentEmail}
                    onChange={(e) => setResetStudentEmail(e.target.value)}
                    className="flex-1 p-1.5 bg-yellow-50 border-2 border-gray-400 rounded text-black placeholder-gray-600 text-xs"
                  />
                  <StyledButton onClick={resetStudentPassword} variant="danger" className="p-1.5">
                    <Key size={14} />
                  </StyledButton>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  A senha será redefinida para "senha123"
                </p>
              </div>
            </div>
            <div className="bg-yellow-100 border-4 border-blue-600 rounded-lg p-3 relative">
              <div className="flex items-center mb-2">
                <User className="mr-1 text-blue-800" size={20} />
                <h2 className="text-base font-bold text-blue-800">Sala dos Alunos</h2>
              </div>
              <div 
                ref={studentsListRef}
                className="max-h-64 overflow-y-auto relative"
              >
                {filteredStudents.map(student => (
                  <div key={student.id} className="flex justify-between items-center bg-yellow-50 p-1.5 mb-1.5 rounded border border-gray-300">
                    <div>
                      <span className="text-black block text-xs font-bold">{student.nickname}</span>
                      <span className="text-purple-700 text-xs">
                        {classes.find(c => c.id === student.classId)?.name}
                      </span>
                      <span className="text-gray-600 text-xs">{student.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="text-right">
                        <span className="text-blue-800 font-bold text-xs">L$ {student.balance}</span>
                        {student.pendingRequests.filter(r => r.status === 'pending').length > 0 && (
                          <div className="text-orange-700 text-xs">
                            {student.pendingRequests.filter(r => r.status === 'pending').length} pendente(s)
                          </div>
                        )}
                      </div>
                      <StyledButton
                        onClick={() => deleteStudent(student.id)}
                        variant="danger"
                        className="p-1 w-6 h-6"
                        title={`Excluir ${student.nickname}`}
                      >
                        <UserMinus size={12} />
                      </StyledButton>
                    </div>
                  </div>
                ))}
              </div>
              {showScrollControls && (
                <div className="absolute right-1 bottom-1 flex flex-col space-y-1">
                  <StyledButton
                    onClick={scrollToTop}
                    variant="admin"
                    className="p-1 w-6 h-6"
                    title="Ir para o topo"
                  >
                    <ChevronUp size={12} />
                  </StyledButton>
                  <StyledButton
                    onClick={scrollStudentsUp}
                    variant="primary"
                    className="p-1 w-6 h-6"
                    title="Rolar para cima"
                  >
                    <ChevronUp size={12} />
                  </StyledButton>
                  <StyledButton
                    onClick={scrollStudentsDown}
                    variant="primary"
                    className="p-1 w-6 h-6"
                    title="Rolar para baixo"
                  >
                    <ChevronDown size={12} />
                  </StyledButton>
                  <StyledButton
                    onClick={scrollToBottom}
                    variant="admin"
                    className="p-1 w-6 h-6"
                    title="Ir para o final"
                  >
                    <ChevronDown size={12} />
                  </StyledButton>
                </div>
              )}
            </div>
          </div>
          <div className="bg-yellow-100 border-4 border-red-600 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <Settings className="mr-1 text-red-800" size={20} />
              <h2 className="text-base font-bold text-red-800">Cardápio de Produtos</h2>
            </div>
            <div className="mb-2 p-2 bg-yellow-50 rounded">
              <h3 className="font-bold text-black mb-1 text-xs">Adicionar Item</h3>
              <div className="grid grid-cols-3 gap-1">
                <input
                  type="text"
                  placeholder="Nome"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                  className="p-1 bg-yellow-50 border border-gray-400 rounded text-black placeholder-gray-600 text-xs"
                />
                <input
                  type="number"
                  placeholder="Preço"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                  className="p-1 bg-yellow-50 border border-gray-400 rounded text-black placeholder-gray-600 text-xs"
                />
                <input
                  type="text"
                  placeholder="Categoria"
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                  className="p-1 bg-yellow-50 border border-gray-400 rounded text-black placeholder-gray-600 text-xs"
                />
              </div>
              <StyledButton onClick={addMenuItem} variant="success" className="mt-1 w-full text-xs">
                Adicionar Item
              </StyledButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
              {menuItems.map(item => (
                <div key={item.id} className="bg-yellow-50 border-2 border-gray-400 rounded p-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-black text-xs">{item.name}</h3>
                    <span className="bg-red-600 text-white px-1 py-0.5 rounded text-xs">
                      L$ {item.price}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mb-1">Categoria: {item.category}</p>
                  <StyledButton
                    onClick={() => deleteMenuItem(item.id)}
                    variant="danger"
                    className="w-full text-xs"
                  >
                    <Trash2 className="inline mr-0.5" size={12} />
                    Remover
                  </StyledButton>
                </div>
              ))}
            </div>
          </div>
        </div>
        {showSavedIcon && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1.5 rounded border-2 border-green-700 z-50 flex items-center">
            <Save className="mr-1" size={16} />
            Dados salvos!
          </div>
        )}
      </div>
    );
  }

  return null;
}