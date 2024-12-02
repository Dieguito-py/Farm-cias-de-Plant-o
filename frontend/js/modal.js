const openModalButtonn = document.querySelector('.openModal');
const closeModalButton = document.getElementById('closeModal');
const saveChangesButton = document.getElementById('saveChanges');
const modal = document.getElementById('modal');
const body = document.body;

const token = localStorage.getItem('jwtToken');
const userId = localStorage.getItem('adminId');

openModalButtonn.addEventListener('click', async () => {
  modal.classList.remove('hidden');
  body.classList.add('blurred');
  await loadUserData();
});

closeModalButton.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
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

saveChangesButton.addEventListener('click', async () => {
  const updatedData = getUserFormData();

  try {
    const userResponse = await fetch('http://localhost:8080/admin/', {
    mode: 'cors',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'adminId': `${userId}`
    },
      body: JSON.stringify({
        name: updatedData.name,
        cnpj: updatedData.cnpj,
        email: updatedData.email,
      }),
    });

    if (userResponse.ok) {
      console.log("Dados do usuário atualizados com sucesso!");
    } else {
      console.error("Erro ao atualizar os dados do usuário:", await userResponse.json());
    }

    if (updatedData.password) {
      const passwordResponse = await fetch('http://localhost:8080/admin/change-password', {
        mode: 'cors',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'adminId': `${userId}`
        },
        body: JSON.stringify({
          newPassword: updatedData.password,
        }),
      });

      if (passwordResponse.ok) {
        console.log("Senha alterada com sucesso!");
      } else {
        console.error("Erro ao alterar a senha:", await passwordResponse.json());
      }
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }

  closeModal();
});

async function loadUserData() {
  try {
    const response = await fetch('http://localhost:8080/admin/me', {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'adminId': `${userId}`  
      }
    });

    if (!response.ok) throw new Error("Erro ao buscar os dados do usuário.");

    const userData = await response.json();
    document.getElementById('name').value = userData.name || "";
    document.getElementById('cnpj').value = userData.cnpj || "";
    document.getElementById('email').value = userData.email || "";
  } catch (error) {
    console.error("Erro ao carregar os dados:", error.message);
    alert("Não foi possível carregar os dados do usuário.");
  }
}

function getUserFormData() {
  const data = {
    name: document.getElementById('name').value,
    cnpj: document.getElementById('cnpj').value,
    email: document.getElementById('email').value,
  };

  const password = document.getElementById('password').value;
  if (password.trim()) {
    data.password = password;
  }

  return data;
}

function closeModal() {
  modal.classList.add('hidden');
  body.classList.remove('blurred');
}
