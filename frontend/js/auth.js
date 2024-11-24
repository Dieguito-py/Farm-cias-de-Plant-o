async function login(cnpj, password) {
    const response = await fetch('http://localhost:8080/admin/auth', {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnpj, password }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('jwtToken', data.accessToken);
        localStorage.setItem('adminId', data.adminId);
        alert('Login bem-sucedido!');
        window.location.href = 'http://localhost/frontend/';
    } else {
        alert('Credenciais inválidas!');
    }
}

async function signup(name, cnpj, email, password) {
    const response = await fetch('http://localhost:8080/admin/', {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, cnpj, email, password }),
    });

    if (response.ok) {
        alert('conta criada!');
        await login(cnpj, password);
    } else {
        alert('Credenciais inválidas!');
    }
}

// async function validateAuth() {
//     const token = localStorage.getItem('jwtToken');
//     if (!token) {
//         alert('Você não está autenticado!');
//         window.location.href = '/index.html';
//         return;
//     }

//     const response = await fetch('http://localhost:8080/api/validateToken', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });

//     if (!response.ok) {
//         alert('Sessão inválida ou expirada!');
//         localStorage.removeItem('jwtToken');
//         window.location.href = '/index.html';
//     }
// }
