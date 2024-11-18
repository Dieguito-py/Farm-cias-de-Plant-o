export async function fetchPharmacies() {
    try {
        const response = await fetch('http://localhost:8080/pharmacy/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar farmácias');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
