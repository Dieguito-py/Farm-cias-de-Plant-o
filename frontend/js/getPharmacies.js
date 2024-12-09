export async function fetchPharmaciesOnDuty(date) {
    try {
        const response = await fetch(`http://localhost:8080/pharmacy/on-duty?date=${date}`);
        if (!response.ok) throw new Error('Erro ao buscar farmácias de plantão.');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}
