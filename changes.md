<b>P4G4</b>\
Bruno Meixedo (113372)\
Rúben Garrido (107927)

Nota: com a pressa, esquecemo-nos de referir na apresentação que usámos uma API externa para emojis nos gamesDetails.

## Alterações executadas após a apresentação do trabalho
- <b>Pesquisa global (search.html)</b>\
  Permite pesquisar por qualquer palavra-chave, em qualquer campo, de qualquer registo.\
  Foi utilizado um acordeão e várias "list groups". O acordeão agroupa os resultados por categoria (ex: Atletas, Competições, etc.), ao passo que as "list groups" mostram os resultados de cada categoria. Cada item da "list group" é um link para o registo correspondente.\
  A navbar inclui um botão para a pesquisa global, que redireciona para a página search.html.

- <b>Pesquisa a partir de 3 letras</b>\
  De modo a reduzir a carga da API e do browser (na renderização do DOM), a pesquisa só é feita a partir de 3 letras.

- <b>Histórico de pesquisas</b>\
  Em cada campo de pesquisa, é apresentado um histórico de pesquisas (sob a forma de uma list group).\
  O histórico é guardado no local storage do browser, e é carregado em cada página correspondente.\
  São usadas list groups.

- <b>Favoritos</b>\
  Os favoritos são guardados no local storage do browser, e são carregados em cada página correspondente.\
  A navbar inclui um dropdown para a página favorites.html#{athletes | games | countries | modalities | competitions}, que apresenta e agrupa os favoritos por categoria (ex: Atletas, Competições, etc.).\
  Esta página utiliza cards e um select.