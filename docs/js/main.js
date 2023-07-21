const form = document.getElementById("novoItem")
const lista = document.getElementById("lista") //pego a lista de itens pelo id que já estão criados por padrão no html.
const itens = JSON.parse(localStorage.getItem("itens")) || []  //Array que irá armazenar todos os dados de itens e suas quantidades que e criar. 
//Para poder ao recarregar a pagina os itens permacerem na lista sem sumir precisamos primeiro pegar esses itens localStorage.getItem("itens") se essa condição for falsa cria um array vazio.
//A propriedade Json.parse e ultilizada pois ao salva os itens no local storage tivemos que transforma-lo em string ultilizando JSON.stringify , mas por ser strings ele não age como array corretamente. então agora quando a gente recebe esses dados precisamos transformar essa informação para o javaScript atraves do JSON.parse.

itens.forEach( (elemento) => { //Para cada elemento que o array itens(que são os itens que eu criei ficam armazenados) contem.
    criaElemento(elemento) //Eu quero que quando eu recarregar a pagina eu chame a função cria elemento recebendo o objeto elemento, então a ideia e que eu estou pegando os itens armazenados no localStorage e adicionando na tabela assim que recarrego a pagina automaticamente, não importa a quantidade sempre que eu recarregar esses itens já serão adicionados na tabela.
});  


form.addEventListener("submit", (evento) => {
    evento.preventDefault() //interrompe o comportamento padrão do navegardor de enviar os dados para algum lugar, para assim salvar no formulario.

    const nome = evento.target.elements["nome"] //aqui eu estou pegando o alvo do evento e o elemento do campo daquele evento e retornando o valor enviado por aqueles campos, para nome e quantidade. e assim adicionando na função criaElementos para adicionar na tabela.
    const quantidade = evento.target.elements["quantidade"]

    const existe = itens.find(elemento => elemento.nome === nome.value) //toda vez que a gente enviar os dados clicancdo no botão a constante de verificação irá procurar dentro do array de itens se o nome de algum elemento e igual ao valor de nome digitado no campo de input.
//a ideia e fazer com que eu atualize a qauntidade de itens de algo se este algo já estiver na lista ex : na lista tem 2 camisas pretas e eu quero adicionar mais 1 em vez de ficar na lista camisas pretas 2 e abaixo repetidamente camisas pretas 1 eu quero que fique apenas o valor camisas pretas 3.
    
    const itemAtual = {  //Criei um objeto que contem os nome do item e suas quantidades para assim enviar apenas um item para o local store que neles constará dois itens dentro nome e quantidade.
        "nome": nome.value,
        "quantidade": quantidade.value
    }
    
    if (existe) {  //Se eu buscar no array de itens e conter algum elmento com o mesmo nome que foi digitado no campo de input eu apenas atualizo o elemento.
        itemAtual.id = existe.id  //tive que criar um id pois um id e o melhor elemento de controle para fazer um match perfeito uma busca perfeita, então eu adicionei um id a o item atual que o id desse item atual será o id que o existe teá quando a função CriaElemento for executada mais a frente no código.
        
        atualizaElemento(itemAtual)

        itens[itens.find(elemento => elemento.id === existe.id)] = itemAtual // se o item existir eu atualizo esse item e passo essa atualização para o local storage.
    
    } else { //Agora se esse elemento não existe eu preciso criar um elemento e jogar esse elemento criado dentro do array
        
        itemAtual.id = itens[itens.length -1] ? (itens[itens.length -1]).id +1 : 0; //se ele não existe o id atual vai ser o tamanho do meu array. Oque eu vou fazer aqui e um operador ternário eu simplesmente faço uma interrogação, se positivo faça a primeira condição, se negativo faça a outra.
//Se o meu array não existe, se não tem nada, o Id que eu quero dar para o elemento é o Id 0, essa é a minha condição final. Se não existir nada no array o Id vira 0, agora se já tiver alguma coisa no Id eu quero achar no último elemento o Id e aí sim, eu quero adicionar 1 a ele.
        
        criaElemento(itemAtual) //A função criaElementos irá receber o valor do campo nome e o valor do campo quantidade , que e aquele que a gente irá digitar e enviar para assim então ser criado e adicionado na lista.
        
        itens.push(itemAtual) //Vou adicionar o item atual criado e sua quantidade dentro do array que irá armazenar esses dados.
    }

    localStorage.setItem("itens", JSON.stringify(itens)) //Estou armazenando os novos dados da minha lista que foram criados a partir do novo item e sua quantidade , esse armazenamento e feito no local storage e fica salvo permanentemente.
    // mas primeiro precisei transforma o meu objeto em string pois o localstorage só armazena strings. fiz isso atraves do JSON.stringify(itemAtual).
    
    nome.value = ""  //Depois que o input for preechido e os dado forem armazenados na tabela eu quero que limpe aquele campo automaticamente isso para nome e quantidade respectivamente.
    quantidade.value = ""
})

function criaElemento(item) { //função que vai criar um elemento dentro do meu formulario assim que eu adicionar os valores de nome do item e sua quantidade. 

    //<li class="item"><strong>7</strong>Camisas</li>  OBS: para adicionar o item na tabela preciso criar uma li exatamente igual as que já tem com todos os dados do mesmo jeito.
    const novoItem = document.createElement("li") //primeiramente criou uma constant com x nome e nela irá conter uma criada.
    novoItem.classList.add("item") //Depois pego esse nome da const que ta a li e adiono uma class a ela.
    
    const numeroItem = document.createElement("strong") //Cria a tag strong
    numeroItem.innerHTML = item.quantidade //Essa e a quantidade de itens que iremos pegar do campo quantidades e cria na li.
    
    numeroItem.dataset.id = item.id //Aqui eu adicionei um id ao elemento strong, para que o existe possua um id ao elemento que será o mesmo do id item atual para assim verificar se possue um item com o nome igual ao que eu quero adidionar na lista e atualizar.

    novoItem.appendChild(numeroItem) //agora para adionar a tag strong com a quantidade de itens dentro da li com a class item que criamos acima devemos dizer que numeroItem e filho de novoItem acima adionando numeroItem dentro da nossa nova lista criada.
    novoItem.innerHTML += item.nome //Agora atribuimos o novoItem + o nome do item e adionamos na tabela ex: 3 camisas brancas.
    
    //Os elementos criados via javaScript são objetos e eles precisam ser manipulados como objetos atraves do appendChild.
    
    novoItem.appendChild(botaoDeleta(item.id)) //o elemento será criado juntamente do botão X para que seja apagado se necessario.

    lista.appendChild(novoItem) //Agora adiciono uma lista nova com cada nome + quantidade de itens que eu adionar e isso tudo do mesmo jeito que consta na lista já criada.
}

function atualizaElemento(item) {  //função responsavel por atualizar os itens que tiverem o nomes iguais assim atualizando apenas a quantidade.
    document.querySelector("[data-id='"+item.id+"']").innerHTML = item.quantidade //aqui pegamos o data id que criamos na tag strong , para atualizamos pegamos o innerHTML que recebe nosso item.quantidade que e oque queremos atualizar.
}

function botaoDeleta(id) {  //Função responsavel por deletar itens da lista.
    const elementoBotao = document.createElement("button") //Cria um botão.
    elementoBotao.innerHTML = "X" //Muda o innerHtml dele para um X clicavel.

    elementoBotao.addEventListener("click", function(){

        deletaElemento(this.parentNode , id) //chamo a função deletaElemento e passo o algo this + parentNode pois a lista e pai do botão e a lista que queremos excluir não o botao.
    })

    return elementoBotao //e retorna essa função
}

function deletaElemento (tag, id) {  //Função responsavel por deletar o elemento que teve o botao X clicado
    tag.remove()

    itens.splice(itens.findIndex(elemento => elemento.id === id), 1) //Vou procurar o elemento dentro do meu array , e quero que o id do elemento seja igual ao id que eu recebi. eu tenho um elemento eu procuro esse elemento e pego o elemento que tenha o id igual a aquele que eu acabei de clicar pra remover e deleto ele.
    localStorage.setItem("itens", JSON.stringify(itens))
}