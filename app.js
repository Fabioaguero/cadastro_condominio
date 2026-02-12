// Simulação de banco de dados em memória
const moradores = [];

// Função para atualizar lista no painel admin
function atualizarLista() {
  const moradoresList = document.getElementById("moradoresList");
  if (moradoresList) {
    moradoresList.innerHTML = "";
    moradores.forEach((m, i) => {
      moradoresList.innerHTML += `
        <div class="morador">
          <h3>${m.nome} - Apto ${m.apartamento} Bloco ${m.bloco}</h3>
          <p><strong>Pets:</strong> ${m.pets.length ? m.pets.map(p => `${p.tipo} (${p.raca}) x${p.quantidade}`).join(", ") : "Nenhum"}</p>
          <p><strong>Carros:</strong> ${m.carros.length ? m.carros.map(c => `${c.marca} ${c.modelo} - Placa ${c.placa} (${c.cor})`).join(", ") : "Nenhum"}</p>
        </div>
      `;
    });
  }
}

// -----------------------------
// 📌 Cadastro de Morador (index.html)
// -----------------------------
const form = document.getElementById("moradorForm");
if (form) {
  const petsContainer = document.getElementById("petsContainer");
  const carrosContainer = document.getElementById("carrosContainer");

  document.getElementById("addPet").addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("pet");
    div.innerHTML = `
      <label>Tipo: <input type="text" class="tipo"></label>
      <label>Raça: <input type="text" class="raca"></label>
      <label>Quantidade: <input type="number" class="quantidade"></label>
    `;
    petsContainer.appendChild(div);
  });

  document.getElementById("addCarro").addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("carro");
    div.innerHTML = `
      <label>Marca: <input type="text" class="marca"></label>
      <label>Modelo: <input type="text" class="modelo"></label>
      <label>Placa: <input type="text" class="placa"></label>
      <label>Cor: <input type="text" class="cor"></label>
    `;
    carrosContainer.appendChild(div);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const apartamento = document.getElementById("apartamento").value;
    const bloco = document.getElementById("bloco").value;

    const pets = [];
    document.querySelectorAll(".pet").forEach(p => {
      pets.push({
        tipo: p.querySelector(".tipo").value,
        raca: p.querySelector(".raca").value,
        quantidade: p.querySelector(".quantidade").value
      });
    });

    const carros = [];
    document.querySelectorAll(".carro").forEach(c => {
      carros.push({
        marca: c.querySelector(".marca").value,
        modelo: c.querySelector(".modelo").value,
        placa: c.querySelector(".placa").value,
        cor: c.querySelector(".cor").value
      });
    });

    moradores.push({ nome, apartamento, bloco, pets, carros });
    alert("Morador cadastrado (simulado)!");
    form.reset();
    petsContainer.innerHTML = "";
    carrosContainer.innerHTML = "";
  });
}

// -----------------------------
// 🔐 Login Admin (login.html)
// -----------------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Mock: aceita apenas admin@condominio.com / 123456
    if (email === "admin@condominio.com" && senha === "123456") {
      window.location.href = "admin.html";
    } else {
      alert("Login inválido (simulado). Use admin@condominio.com / 123456");
    }
  });
}

// -----------------------------
// 🛠️ Painel Admin (admin.html)
// -----------------------------
const moradoresList = document.getElementById("moradoresList");
if (moradoresList) {
  atualizarLista();

  // Exportar PDF
  document.getElementById("exportPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    moradores.forEach((m) => {
      doc.text(`${m.nome} - Apto ${m.apartamento} Bloco ${m.bloco}`, 10, y);
      y += 10;
    });
    doc.save("moradores.pdf");
  });

  // Exportar Excel
  document.getElementById("exportExcel").addEventListener("click", () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(moradores);
    XLSX.utils.book_append_sheet(wb, ws, "Moradores");
    XLSX.writeFile(wb, "moradores.xlsx");
  });
}