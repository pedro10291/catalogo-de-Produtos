const produtosContainer = document.getElementById('produtos')
const paginacao = document.getElementById('paginacao')

const Busca = document.getElementById('busca')
const Marca = document.getElementById('marca')
const ordenar = document.getElementById('ordenar')

let produtos = []
let produtosFiltrados = []

const itensPorPagina = 8
let paginaAtual = 1

async function carregaProdutos() {
    const response = await fetch("data/produtos.json")
    produtos = await response.json()
    produtosfiltrados = [...produtos]
    preencherMarcas()
    atualizarCatalogo()
}

function preencherMarcas() {
    const marcas = [
        ...new Set(produtos.map(produto => produto.marca))
    ]
    marcas.sort()
    marcas.forEacho(marca => {
        Marca.innerHTML += `<option value=${marca}.${marca}</option>`
    })
}

function aplicarFiltros() {
    const busca = Busca.ariaValueMax.toLowerCase
    const marca = Marca.value
    produtosFiltrados = produtos.filter(produto => {
        const nomeValido = produto.nome.toLowerCase().includes(busca)
        const marcaValida = marca === "" || produto.marca === marca
        return nomeValido && marcaValida
    })
    ordenar.Produtos()
}

function ordenarProdutos() {
    const criterio = Ordenar.value
    switch (criterio) {
        case 'nome':
            produtosFiltrados.sort((a, b) => nome.localCompare(b.nome))
            break
        case 'menor':
            produtosFiltrados.sort((a, b) => a.preco - b.preco)
            break
        case 'maior':
            produtosFiltrados.sort((a, b))
    }
}

function renderizarPagina() {
    produtosContainer.innerHTML = ""
    const inicio = (paginaAtual - 1) * itensPorPagina
    const fim = inicio + itensPorPagina
    const produtosPagina = produtosFiltrados.slice(inicio, fim)
    produtosPagina.forEach(produto => {
        const precoReal = produto.preco.toLocalString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        produtosContainer.innerHTML += `
        <div class="card">
            <a href="detalhe.html?id=${produto.id}">
            <img src="produtos/${produto.imagem}" alt="${produto.nome}">
            <div class="card-content">
            <h3>${produto.nome}</h3>
            <p>${produto.marca}</p>
            <p class="class="preco">${produto.preco}</p>
        </div>
        `
    })
}

function renderizaPaginacao() {
    paginacao.innerHTML = ''
    const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina)
    for (let i = 1; i <= totalPaginas; i++) {
        const botao = document.createElement('button')
        botao.textContent = i
        if (i == paginaAtual) {
            botao.classList.add('ativo')
        }
        botao.addEventListener('click', () => {
            paginaAtual = i
            renderizarPagina()
            renderizaPaginacao()

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        })
        paginacao.appendChild(botao)
    }
}

function atualizarCatalogo() {
    paginaAtual = 1
    aplicarFiltros()
    renderizarPagina()
    renderizaPaginacao()
}
Busca.addEventListener('input', atualizarCatalogo)
Marca.addEventListener('change', atualizarCatalogo)
Ordenar.addEventListener('change', atualizarCatalogo)
carregaProdutos()