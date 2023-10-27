let times;
fetch("./times.json")
    .then(timesjson => {
        timesjson.json().then(_times => times = _times);
    })
    .catch(reason => {
        console.log("erro ao carregar os times: " + reason)
    });


function init() {
    carregarPontuacao();
}

function carregarPontuacao(){
    
    times.forEach(genero => {
        let pontuacaoDiv = document.querySelector("div#tabelaPontuacao");
        let titulo = document.createElement("h3");
        titulo.textContent = genero.id;
        pontuacaoDiv.append(titulo);
        
        genero.chaves.forEach(chave => {
            let tabela = document.createElement("table");
            let linha = document.createElement("tr");
            let coluna = document.createElement("th");
            coluna.colSpan = 2;
            coluna.textContent = chave.id;
            linha.appendChild(coluna);
            tabela.appendChild(linha);

            linha = document.createElement("tr");
            coluna = document.createElement("th");
            coluna.textContent = "Equipe";
            linha.appendChild(coluna);

            coluna = document.createElement("th");
            coluna.textContent = "Pontuação";
            linha.appendChild(coluna);

            tabela.appendChild(linha);

            chave.equipes.forEach(equipe => {
                linha = document.createElement("tr");
                coluna = document.createElement("td");
                coluna.textContent = equipe.nome;
                linha.appendChild(coluna);
                coluna = document.createElement("td");
                coluna.textContent = equipe.pontuacao;
                linha.appendChild(coluna);

                tabela.appendChild(linha);
            });

            pontuacaoDiv.append(tabela);
        })
        
    });
        
}