import times from './times.json' with { type: 'json'}
import jogos from './jogos.json' with { type: 'json'}

document.body.onload = function() {
    processarJogos();
    carregarJogos();
    carregarPontuacao();
}

function processarJogos(){
    let hoje = new Date();
    jogos.filter(jogo => {
        let dataJogo = dataToDate(jogo.data);

        return hoje >= dataJogo;
    }).forEach(dia => {
        dia.jogos.filter(jogo => {
            let horarioJogo = dataToDate(dia.data);
            let horaInfo = jogo.horario.split(':');
            horarioJogo.setHours(Number(horaInfo[0])+1, Number(horaInfo[1]))
            return horarioJogo < hoje
        }).forEach(jogo => processarJogo(jogo))
    })

    
}

function processarJogo(jogo){
    let timeA = getTime(jogo.categoria, jogo.chave, jogo.equipeA);
    let timeB = getTime(jogo.categoria, jogo.chave, jogo.equipeB);

    if(timeA == null || timeB == null) return;

    // equipe A ganhou
    if(jogo.golsA > jogo.golsB) 
        timeA.pontuacao += (jogo.golsA - jogo.golsB >= 10) ? 3 : 2;
    // equipe B ganhou
    else if(jogo.golsB > jogo.golsA)
        timeB.pontuacao += (jogo.golsB - jogo.golsA >= 10) ? 3 : 2;
    // deu empate
    else if(jogo.golsA == jogo.golsB) {
        timeA.pontuacao += 1;
        timeB.pontuacao += 1;
    }
    
}

function dataToDate(data) {
    let dataInfos = data.split('/')
    let newDate = new Date();
    newDate.setFullYear(dataInfos[2], dataInfos[1]-1, dataInfos[0])
    return newDate
}

function carregarPontuacao(){
    
    times.forEach(genero => {
        let pontuacaoDiv = document.querySelector("div#tabelaPontuacao");
        let titulo = document.createElement("h3");
        titulo.textContent = genero.id;
        pontuacaoDiv.append(titulo);
        
        genero.chaves.filter(chave => chave.id.length < 2 ).forEach(chave => {
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

            chave.equipes.sort((a, b) => b.pontuacao - a.pontuacao).forEach(equipe => {
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

function carregarJogos(){
    let jogosDiv = document.querySelector("div#tabelaJogos");
    let tabela = document.createElement("table");
    let nJogo = 1;
    
    jogos.forEach(dia => {
        
        let linha = document.createElement("tr");
        let coluna = document.createElement("th");
        coluna.colSpan = 9
        coluna.textContent = dia.data
        linha.appendChild(coluna);
        tabela.appendChild(linha);

        linha = document.createElement("tr");
        coluna = document.createElement("th");
        coluna.textContent = "JOGO";
        linha.appendChild(coluna);
        
        coluna = document.createElement("th");
        coluna.textContent = "HORÁRIO";
        linha.appendChild(coluna);
        
        coluna = document.createElement("th");
        coluna.textContent = "PLACAR";
        coluna.colSpan = 5;
        linha.appendChild(coluna);
        
        coluna = document.createElement("th");
        coluna.textContent = "CHAVE";
        linha.appendChild(coluna);
        
        coluna = document.createElement("th");
        coluna.textContent = "CATEGORIA";
        linha.appendChild(coluna);

        tabela.appendChild(linha);

        dia.jogos.forEach(jogo => {
            linha = document.createElement("tr");
            coluna = document.createElement("td");
            coluna.textContent = nJogo++;
            linha.appendChild(coluna);

            coluna = document.createElement("td");
            coluna.textContent = jogo.horario;
            linha.appendChild(coluna);

            coluna = document.createElement("td");
            coluna.textContent = getTimeName(jogo.categoria, jogo.chave, jogo.equipeA);
            linha.appendChild(coluna);

            coluna = document.createElement("td");
            coluna.textContent = jogo.golsA > -1? jogo.golsA : " ";
            linha.appendChild(coluna);

            coluna = document.createElement("td");
            coluna.textContent = "X";
            linha.appendChild(coluna);

            coluna = document.createElement("td");
            coluna.textContent = jogo.golsB > -1? jogo.golsB : " ";
            linha.appendChild(coluna);

            coluna = document.createElement("td");
            coluna.textContent = getTimeName(jogo.categoria, jogo.chave, jogo.equipeB);
            linha.appendChild(coluna);

            coluna = document.createElement("td");
            coluna.textContent = jogo.chave;
            linha.appendChild(coluna);

            coluna = document.createElement("td");
            coluna.textContent = jogo.categoria;
            linha.appendChild(coluna);


            tabela.appendChild(linha);
        });
    });
    jogosDiv.append(tabela);
}

function getTime(_categoria, _chave, index){
    let timesEncontrados = times.filter(categoria => categoria.id == _categoria)

    if(timesEncontrados.length > 0){
        let chaveEncontrados = timesEncontrados[0].chaves.filter(chave => chave.id == _chave)

        if(chaveEncontrados.length > 0 && index < chaveEncontrados[0].equipes.length){
            return chaveEncontrados[0].equipes[index];
        }
    }
    return null;
}

function getTimeName(_categoria, _chave, index){
    
    let time = getTime(_categoria, _chave, index);

    return time == null ? "time não encontrado" : time.nome;
}