    // Configurações do Firebase
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
    import { getFirestore, collection, addDoc, query, where, getDocs, doc, setDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js"; 

    const firebaseConfig = {
        apiKey: "AIzaSyAVI_6eyuDsko8EIoDGnKbFOp41YSEELdA",
        authDomain: "cadastrodecarros.firebaseapp.com",
        projectId: "cadastrodecarros",
        storageBucket: "cadastrodecarros.appspot.com",
        messagingSenderId: "777045635662",
        appId: "1:777045635662:web:4833c9e54770375605491f",
        measurementId: "G-2FGJE8S59F"
    };

    // Inicializa o Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Função para limpar a placa (remover os hífens)
    function limparPlaca(placa) {
        return placa.replace(/-/g, ''); // Remove todos os hífens da placa
    }

    // Função para cadastrar um automóvel
    document.getElementById('carForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        let marca = document.getElementById('marca').value;
        let modelo = document.getElementById('modelo').value;
        let cor = document.getElementById('cor').value;
        let placa = document.getElementById('placa').value;
        let ano = document.getElementById('ano').value;
        let km = document.getElementById('km').value;

        // Limpa a placa antes de enviar
        placa = limparPlaca(placa);

    // Validação do ano de fabricação
    if (ano > 2024) {
        document.getElementById('yearErrorMessage').style.display = 'block';
        return; // Impede o envio do formulário se o ano for inválido
    } else {
        document.getElementById('yearErrorMessage').style.display = 'none';
    }

        // Verifica se já existe um automóvel com a mesma placa
        try {
            //buscaplaca e busca id placa // faz alteração com id
            const docRef = doc(placa, 'placa', placa); // Referência para o documento com a placa como ID
            const docSnap = await setDoc(docRef); // Tenta pegar o documento com a placa

            if (docSnap.exists()) {
                alert('Já existe um automóvel cadastrado com esta placa.');
                return; // Interrompe o processo de cadastro se o documento já existir
            }

            // Se não houver duplicidade, cadastra o novo automóvel com a placa como ID
            await setDoc(docRef, {
                marca,
                modelo,
                cor,
                placa,
                ano,
                km
            });

            document.getElementById('carForm').reset();
            listarAutomoveis(); // Atualiza a lista de automóveis
        } catch (error) {
            console.error("Erro ao cadastrar automóvel: ", error);
            alert("Erro ao cadastrar automóvel. Tente novamente.");
        }
    });

    // Função para listar automóveis
    async function listarAutomoveis() {
        const carList = document.getElementById('carList');
        carList.innerHTML = ''; // Limpa a lista antes de adicionar os itens

        try {
            const snapshot = await getDocs(collection(db, 'automoveis'));
            snapshot.forEach(doc => {
                console.log("ID do documento:", doc.id); // Verifica o ID do documento
                const data = doc.data();
                const li = document.createElement('li');
                li.textContent = `${data.marca} - ${data.modelo} - ${data.cor} - ${data.placa} - ${data.ano} - ${data.km}`;

                // Cria um botão de editar
                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                // Passa o ID (placa) e os dados do automóvel para a função de edição
                editButton.onclick = () => editarAutomovel(doc.id, data);

                // Adiciona o botão ao item da lista
                li.appendChild(editButton);
                carList.appendChild(li);
            });
        } catch (error) {
            console.error("Erro ao listar automóveis: ", error);
            alert("Erro ao carregar lista de automóveis. Tente novamente.");
        }
    }

    // Função para editar um automóvel
    async function editarAutomovel(id, data) {
        console.log("Editando automóvel com ID: ", id); // Log de depuração

        // Preenche os campos do formulário com os dados do automóvel
        document.getElementById('marca').value = data.marca;
        document.getElementById('modelo').value = data.modelo;
        document.getElementById('cor').value = data.cor;
        document.getElementById('placa').value = data.placa;
        document.getElementById('ano').value = data.ano;
        document.getElementById('km').value = data.km;

        // Atualiza o evento de submit para atualizar o automóvel
        document.getElementById('carForm').onsubmit = async (e) => {
            e.preventDefault();

            try {
                // Limpa a placa antes de enviar
                let placa = document.getElementById('placa').value;
                placa = limparPlaca(placa);

                // Atualiza o documento com o ID fornecido (placa)
                await updateDoc(doc(db, 'automoveis', placa), {
                    marca: document.getElementById('marca').value,
                    modelo: document.getElementById('modelo').value,
                    cor: document.getElementById('cor').value,
                    placa: document.getElementById('placa').value,
                    ano: document.getElementById('ano').value,
                    km: document.getElementById('km').value
                });

                document.getElementById('carForm').reset();
                listarAutomoveis(); // Atualiza a lista após a edição
            } catch (error) {
                console.error("Erro ao editar automóvel: ", error);
                alert("Erro ao editar automóvel. Tente novamente.");
            }
        };
    }

    // Chama a função para listar automóveis ao carregar a página
    listarAutomoveis();
