document.querySelectorAll('.cnpj').forEach((input) => {
    input.addEventListener('input', (event) => {
        let value = event.target.value;

        value = value.replace(/\D/g, '');

        if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        }
        if (value.length > 6) {
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        }
        if (value.length > 10) {
            value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
        }
        if (value.length > 15) {
            value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
        }

        event.target.value = value;
    });
});
