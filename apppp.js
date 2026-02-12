// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Configuração Firebase (substitua pelas suas chaves)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT.firebaseapp.com",
  projectId: "SEU_PROJECT",
  storageBucket: "SEU_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

//mock para git page
const moradoresMock = [];

function salvarMoradorMock(morador) {
  moradoresMock.push(morador);
  console.log("Morador salvo:", morador);
}

function listarMoradoresMock() {
  return moradoresMock;
}

// Cadastro de morador
const form = document.getElementById("moradorForm");
if (form) {
  form.addEventListener("submit", async (e) => {
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

    await addDoc(collection(db, "moradores"), {
      nome, apartamento, bloco, pets, carros, createdAt: new Date()
    });
    alert("Morador cadastrado com sucesso!");
    form.reset();
  });
}

// Login admin
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      window.location.href = "admin.html";
    } catch (error) {
      alert("Erro no login: " + error.message);
    }
  });
}

// Painel admin
const moradoresList = document.getElementById("moradoresList");
if (moradoresList) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const querySnapshot = await getDocs(collection(db, "moradores"));
      moradoresList.innerHTML = "";
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        moradoresList.innerHTML += `
          <div>
            <h3>${data.nome} - Apto ${data.apartamento} Bloco ${data.bloco}</h3>
            <p>Pets: ${JSON.stringify(data.pets)}</p>
            <p>Carros: ${JSON.stringify(data.carros)}</p>
          </div>
        `;
      });
    } else {
      window.location.href = "login.html";
    }
  });

  // Exportar PDF
  document.getElementById("exportPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(moradoresList.innerText, 10, 10);
    doc.save("moradores.pdf");
  });

  // Exportar Excel
  document.getElementById("exportExcel").addEventListener("click", () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(moradoresList);
    XLSX.utils.book_append_sheet(wb, ws, "Moradores");
    XLSX.writeFile(wb, "moradores.xlsx");
  });
}