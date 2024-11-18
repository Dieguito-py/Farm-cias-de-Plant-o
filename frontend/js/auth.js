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
        localStorage.setItem('jwtToken', data.token);
        alert('Login bem-sucedido!');
        window.location.href = 'http://localhost/frontend/';
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

function logout() {
    localStorage.removeItem('jwtToken');
    window.location.href = '/index.html';
}
