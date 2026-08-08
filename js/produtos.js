const prodContainer = document.getElementById('produto')
const relContainer = document.getElementById('relacionados')

const params = new URLSearchParams(location.search)
const id = Number(params.get("id"))
console.log(id)
    // Carregar Produto
async function carregaProd() {
    const response = await fetch('data/produtos.json')
    const produtos = await response.json()
    const produto = produtos.find(p => p.id === id)
    if (!produto) {
        prodContainer.innerHTML = '<h3>Produto não encontrado!</h3>'
        return
    }
    mostraProduto(produto)
    mostraRelacionados(produtos, produto)
}

function mostraProduto(produto) {
    document.title = produto.nome
    prodContainer.innerHTML = `
        <section class="prodDetalhe">
            <div class="prodFoto">
                <img src="produtos/${produto.imagem}" alt="${produto.nome}">
            </div>
            <div class="prodInfo">
                <h1>${produto.nome}</h1>
                <p class="marca">${produto.marca}</p>
                <p class="desc">${produto.descricao}</p>
                <div class="preco">
                    R$ ${produto.preco.toFixed(2)}
                </div>

            </div>
        </section>
    `
}

function mostraRelacionados(produtos, prodAtual) {
    const relacionados = produtos.filter(produto => {
        return (produto.id !== prodAtual.id && produto.marca === prodAtual.marca)
    }).slice(0, 4)
    if (relacionados.length === 0) {
        relContainer.innerHTML = "<p>Não temos produtos relacionados.</p>"
        return
    }
    relacionados.forEach(produto => {
        relContainer.innerHTML += `
            <div class="cardRel">
                <a href="detalhe.html?id=${produto.id}">
                    <div class="relFoto">
                        <img src="produtos/${produto.imagem}" alt="${produto.nome}">
                    </div>
                    <div class="relInfo">
                        <h3>${produto.nome}</h3>
                        <p>${produto.marca}</p>
                    </div>
                </a>
            </div>
        `
    })
}
carregaProd()