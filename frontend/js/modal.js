const openModalButton = document.querySelector('.openModal');
const closeModalButton = document.getElementById('closeModal');
const saveChangesButton = document.getElementById('saveChanges');
const modal = document.getElementById('modal');
const body = document.body;

const userData = {
  name: "João Silva",
  cnpj: "12.345.678/0001-90",
  email: "joao.silva@example.com",
  password: "123456"
};

openModalButton.addEventListener('click', () => {
  modal.classList.remove('hidden');
  body.classList.add('blurred');
  loadUserData();
});

document.getElementById('closeModal').addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

saveChangesButton.addEventListener('click', () => {
  const updatedData = getUserFormData();
  console.log("Dados atualizados:", updatedData);
  closeModal();
});

document.querySelectorAll('.edit-icon').forEach(icon => {
  icon.addEventListener('click', (event) => {
    const field = event.target.getAttribute('data-field');
    const input = document.getElementById(field);

    input.removeAttribute('readonly');
    input.classList.add('editable');
    input.focus();

    input.addEventListener('blur', () => {
      if (!input.value.trim()) {
        input.value = userData[field];
      }
      input.classList.remove('editable');
      input.setAttribute('readonly', true);
    }, { once: true });
  });
});

function loadUserData() {
  document.getElementById('name').value = userData.name;
  document.getElementById('cnpj').value = userData.cnpj;
  document.getElementById('email').value = userData.email;
  document.getElementById('password').value = userData.password;
}

function getUserFormData() {
  return {
    name: document.getElementById('name').value,
    cnpj: document.getElementById('cnpj').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };
}

function closeModal() {
  modal.classList.add('hidden');
  body.classList.remove('blurred');
}
