async function addPharmacy(name, address, city, state, phone, latitude, longitude) {
    const response = await fetch('http://localhost:8080/pharmacy/', {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, address, city, state, phone, latitude, longitude }),
    });

    if (response.ok) {
        alert('Farmácia Criada!');
        addPharmacyModal.classList.add('hidden');
        await loadPharmacies();
    } else {
        alert('Credenciais inválidas!');
    }
}