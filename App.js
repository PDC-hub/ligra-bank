import React, { useState } from 'react';

// Ajuste: incluir 'professor' nas opções de perfil/role
const ROLE_OPTIONS = [
	{ value: 'student', label: 'Aluno' },
	{ value: 'admin', label: 'Administrador' },
	{ value: 'teacher', label: 'Professor' } // ADDED
];

// Ajuste: remover obrigatoriedade de contas em nuvem
// antes: const REQUIRE_CLOUD_ACCOUNT = true;
const REQUIRE_CLOUD_ACCOUNT = false; // ADDED: não exigir contas em nuvem

function RegistrationForm(props) {
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		role: 'student' // valor padrão
	});

	function handleChange(e) {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	}

	// Remover referências visuais/inputs para contas em nuvem quando REQUIRE_CLOUD_ACCOUNT=false
	return (
		<form onSubmit={e => { e.preventDefault(); props.onSubmit(form); }}>
			<input
				type="text"
				name="name"
				value={form.name}
				onChange={handleChange}
				placeholder="Nome"
				required
			/>
			<input
				type="email"
				name="email"
				value={form.email}
				onChange={handleChange}
				placeholder="Email"
				required
			/>
			<input
				type="password"
				name="password"
				value={form.password}
				onChange={handleChange}
				placeholder="Senha"
				required
			/>
			<select
				name="role"
				value={form.role}
				onChange={handleChange}
			>
				{ROLE_OPTIONS.map(r => (
					<option key={r.value} value={r.value}>{r.label}</option>
				))}
			</select>
			<button type="submit">Cadastrar</button>
		</form>
	);
}

// ...existing code...
function validateRegistration(form) {
	// ...existing validation...
	// Remover/ignorar validação de campos de nuvem quando não obrigatórios
	if (REQUIRE_CLOUD_ACCOUNT) {
		// ...existing cloud validation...
	} else {
		// não exigir campos de provider
	}
	// ...existing validation...
	return true; // manter retorno compatível
}

// ...existing code...
async function handleRegister(form) {
	// ...existing code...
	// permitir cadastro local para professor
	const payload = {
		name: form.name,
		email: form.email,
		password: form.password,
		role: form.role // agora pode ser 'teacher'
		// ...existing code...
	};

	// se havia fluxo que redirecionava para provedores em nuvem, pule-o
	// e use o endpoint local de criação de usuário
	try {
		// ...existing code...
		// Exemplo de chamada ao backend local de criação de usuário
		const res = await fetch('/api/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		if (!res.ok) throw new Error('Registro falhou');
		// ...existing success handling...
	} catch (err) {
		// ...existing error handling...
	}
}

// ...existing code...