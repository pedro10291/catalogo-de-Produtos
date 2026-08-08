const produtosContainer = document.getElementById('produtos')
const paginacao = document.getElementById('paginacao')

const Busca = document.getElementById('busca')
const Marca = document.getElementById('marca')
const Ordenar = document.getElementById('ordenar')

let produtos = []
let produtosFiltrados = []

const itensPorPagina = 8
let paginaAtual = 1

async function carregaProdutos() {
    const response = await fetch("data/produtos.json")
    produtos = await response.json()
    produtosFiltrados = [...produtos]
    preencherMarcas()
    atualizarCatalogo()
}

function preencherMarcas() {
    const marcas = [
        ...new Set(produtos.map(produto => produto.marca))
    ]
    marcas.sort()
    marcas.forEach(marca => {
        Marca.innerHTML += `<option value="${marca}">${marca}</option>`
    })
}

function aplicarFiltros() {
    const busca = Busca.value.toLowerCase()
    const marca = Marca.value
    produtosFiltrados = produtos.filter(produto => {
        const nomeValido = produto.nome.toLowerCase().includes(busca)
        const marcaValida = marca === "" || produto.marca === marca
        return nomeValido && marcaValida
    })
    ordenarProdutos()
}

function ordenarProdutos() {
    const criterio = Ordenar.value
    switch (criterio) {
        case 'nome':
            produtosFiltrados.sort((a, b) => nome.localeCompare(b.nome))
            break
        case 'menor':
            produtosFiltrados.sort((a, b) => a.preco - b.preco)
            break
        case 'maior':
            produtosFiltrados.sort((a, b) => b.preco - a.preco)
            break
    }
}

function renderizarPagina() {
    produtosContainer.innerHTML = ""
    const inicio = (paginaAtual - 1) * itensPorPagina
    const fim = inicio + itensPorPagina
    const produtosPagina = produtosFiltrados.slice(inicio, fim)
    produtosPagina.forEach(produto => {
        const precoReal = produto.preco.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        produtosContainer.innerHTML += `
        <div class="card">
        <a href="detalhe.html?id=${produto.id}">
        <div class="foto">
        <img src="produtos/${produto.imagem}" alt="${produto.nome}">
    </div>
        <div class="card-content">
            <h3>${produto.nome}</h3>
            <p>${produto.marca}</p>
            <p class="preco">${precoReal}</p>
        </div>
    </a>
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
        if (i === paginaAtual) {
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