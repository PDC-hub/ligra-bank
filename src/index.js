import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  LogIn,
  ShieldCheck,
  AlertCircle,
  Save,
  FolderOpen,
  Mail,
  CheckCircle,
  UserPlus,
} from 'lucide-react';

// --- Domínios aceitos ---
const GOOGLE_DOMAINS = ['prof.educacao.sp.gov.br', 'gmail.com'];
const MICROSOFT_DOMAINS = ['professor.educacao.sp.gov.br', 'portalsesisp.org.br'];
const ALLOWED_DOMAINS = [...GOOGLE_DOMAINS, ...MICROSOFT_DOMAINS];

// --- Tipos (em JS, usamos objetos) ---
// AppData: { professor, pinHash, alunos, transacoes, ultimaAtualizacao }

// --- Serviço Google (mantido) ---
const GOOGLE_CLIENT_ID = '1039987341180-a3pc0l6qj9r25fb2b7vrivic5fl4esr5.apps.googleusercontent.com';

const GoogleDriveService = {
  async init() {
    if (window.gapi) return;
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', () => {
          window.gapi.client.init({
            clientId: GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/drive.appdata',
          });
        });
        resolve(true);
      };
      document.head.appendChild(script);
    });
  },

  async saveData(data) {
    await this.init();
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (!auth2.isSignedIn.get()) await auth2.signIn();

    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const metadata = { name: 'ligra_bank_data.json', parents: ['appDataFolder'] };
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const token = auth2.currentUser.get().getAuthResponse().access_token;
    await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  },

  async loadData() {
    await this.init();
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (!auth2.isSignedIn.get()) await auth2.signIn();

    const token = auth2.currentUser.get().getAuthResponse().access_token;
    const files = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='ligra_bank_data.json'&spaces=appDataFolder&fields=files(id)`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(r => r.json());

    if (files.files.length === 0) return null;

    const fileId = files.files[0].id;
    const file = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(r => r.json());

    return file;
  },
};

// --- Salvamento local (OneDrive / Google Drive local) ---
const LocalFileService = {
  async save(data) {
    if (!window.showSaveFilePicker) {
      alert('⚠️ Use Chrome, Edge ou Opera para salvar diretamente no OneDrive.');
      return;
    }
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: 'ligra_bank_data.json',
        types: [{ description: 'Ligra Bank', accept: { 'application/json': ['.json'] } }],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      alert('✅ Dados salvos!\n\nSalve na pasta do OneDrive para manter na nuvem.');
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    }
  },

  async load() {
    if (!window.showOpenFilePicker) {
      alert('⚠️ Use Chrome, Edge ou Opera para carregar arquivos.');
      return null;
    }
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{ description: 'Ligra Bank', accept: { 'application/json': ['.json'] } }],
      });
      const file = await fileHandle.getFile();
      const text = await file.text();
      return JSON.parse(text);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
      return null;
    }
  },
};

// --- Componente: Tela de boas-vindas ---
function WelcomeScreen({ onLoadData }) {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  const handleGoogleLogin = async () => {
    if (!GOOGLE_DOMAINS.some(d => email.toLowerCase().endsWith(d))) {
      setError('Use @prof.educacao.sp.gov.br ou @gmail.com para login automático.');
      return;
    }
    setError('');
    try {
      const data = await GoogleDriveService.loadData();
      onLoadData(data, 'google');
    } catch (err) {
      alert('Erro no Google Drive: ' + (err.message || 'Tente novamente.'));
    }
  };

  const handleLocalMicrosoft = () => {
    if (!MICROSOFT_DOMAINS.some(d => email.toLowerCase().endsWith(d))) {
      setError('Use @professor.educacao.sp.gov.br ou @portalsesisp.org.br para salvar no OneDrive.');
      return;
    }
    setError('');
    LocalFileService.load().then(data => {
      onLoadData(data, 'local');
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFDF5] p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <ShieldCheck className="text-[#89C2F5] mx-auto mb-3" size={48} />
          <h1 className="text-2xl font-bold text-gray-800">Ligra Bank</h1>
          <p className="text-gray-600">Informe seu e-mail institucional</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu.email@instituicao.edu.br"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-[#89C2F5] focus:outline-none mb-6"
        />

        <button
          onClick={handleGoogleLogin}
          disabled={!email}
          className="w-full py-3 mb-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Mail size={18} /> Continuar com Google
        </button>

        <button
          onClick={handleLocalMicrosoft}
          disabled={!email}
          className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FolderOpen size={18} /> Carregar do OneDrive
        </button>

        <p className="mt-6 text-center text-xs text-gray-500">
          • Google: @prof.educacao.sp.gov.br ou @gmail.com<br />
          • OneDrive: @professor.educacao.sp.gov.br ou @portalsesisp.org.br
        </p>
      </div>
    </div>
  );
}

// --- Componente: Configuração inicial ---
function SetupScreen({ onComplete }) {
  const [pin, setPin] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = () => {
    if (pin.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (pin !== confirm) {
      setError('As senhas não conferem.');
      return;
    }
    setError('');
    onComplete(pin);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFDF5] p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <UserPlus className="text-[#89C2F5] mx-auto mb-3" size={48} />
          <h2 className="text-xl font-bold text-gray-800">Configuração Inicial</h2>
          <p className="text-gray-600">Crie sua senha de acesso</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Senha (mín. 6 caracteres)"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-[#89C2F5] focus:outline-none mb-4"
        />

        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirme a senha"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-[#89C2F5] focus:outline-none mb-6"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-bold text-white bg-[#89C2F5] hover:bg-[#5B8FB3]"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}

// --- App principal ---
function App() {
  const [data, setData] = React.useState(null);
  const [isSettingUp, setIsSettingUp] = React.useState(false);
  const [source, setSource] = React.useState(null);

  const handleLoadData = (loadedData, src) => {
    setSource(src);
    if (loadedData) {
      setData(loadedData);
    } else {
      setIsSettingUp(true);
    }
  };

  const handleSetupComplete = (pin) => {
    const newData = {
      professor: 'carregado_na_proxima',
      pinHash: pin, // em produção, use hash!
      alunos: [],
      transacoes: [],
      ultimaAtualizacao: new Date().toISOString(),
    };
    setData(newData);
    setIsSettingUp(false);
  };

  const handleSave = async () => {
    if (!data) return;
    if (source === 'google') {
      await GoogleDriveService.saveData(data);
      alert('✅ Salvo no Google Drive!');
    } else if (source === 'local') {
      await LocalFileService.save(data);
    }
  };

  if (isSettingUp) {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  if (!data) {
    return <WelcomeScreen onLoadData={handleLoadData} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Ligra Bank</h1>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Save size={18} /> Salvar
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <p className="text-blue-800">
              💾 Dados salvos na{' '}
              <strong>{source === 'google' ? 'nuvem Google' : 'pasta do OneDrive'}</strong>
            </p>
          </div>

          {/* Aqui vai seu dashboard real */}
          <div className="text-center py-12">
            <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
            <h2 className="text-xl font-bold">Sistema carregado!</h2>
            <p className="text-gray-600 mt-2">Adicione seus alunos, turmas e transações.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Inicialização ---
const root = createRoot(document.getElementById('root'));
root.render(<App />);