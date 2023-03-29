/*
  Este é o parser para a seguinte gramática, vista na parte teórica da
  disciplina ($ aqui significa a palavra vazia):
  E -> TE'
  E' -> +E | $
  T -> FT'
  T' -> *T | $
  F -> (E) | id
*/

/*
  Especificando os tokens (lembrando que isso deveria ser feito previamente
  por um lexer)
*/
const tokens = {
  PLUS: '+',
  TIMES: '*',
  LPAREN: '(',
  RPAREN: ')',
  ID: 'id',
};

/*
  Esta é a expressão que será analisada. Como não dispomos de um lexer
  completo, é importante DEIXAR UM ESPAÇO entre os tokens
*/
const expression = 'id + id * ( id + id';

/*
  Nossa entrada será uma "tabela de símbolos" simplificada, gerada a partir
  da expressão separando-se os tokens por espaços
*/
const input = expression.split(' ');

// Variáveis de controle de entrada
let tokenPos = -1,
  currToken,
  hasError = false;

// Função que retorna o próximo token
const nextToken = () => {
  tokenPos++;
  currToken = input[tokenPos];
};

// Função que confere se o token da posição é do tipo esperado
const match = (exp) => {
  // Se o token da posição estiver OK, avança a entrada para
  // o próximo token
  if (currToken === exp) nextToken();
  // Erro, caso o token não seja o esperado
  else {
    console.error(`ERROR: token ${exp} expected at position ${tokenPos}.`);
    hasError = true;
  }
};

// Função que representa a regra E -> TE'
function E() {
  console.log(
    `Parsing rule E, current token: ${currToken}, position: ${tokenPos}`
  );
  T();
  E_();
}

// Função que representa a regra E' -> +E | $
function E_() {
  console.log(
    `Parsing rule E', current token: ${currToken}, position: ${tokenPos}`
  );
  if (currToken === tokens.PLUS) {
    match(tokens.PLUS);
    E();
  }
  // else match($)
}

// Função que representa a regra T -> FT'
function T() {
  console.log(
    `Parsing rule T, current token: ${currToken}, position: ${tokenPos}`
  );
  F();
  T_();
}

// Função que representa a regra T' -> *T | $
function T_() {
  console.log(
    `Parsing rule T', current token: ${currToken}, position: ${tokenPos}`
  );
  if (currToken === tokens.TIMES) {
    match(tokens.TIMES);
    T();
  }
  // else match($)
}

// Função que representa a regra F -> (E) | id
function F() {
  console.log(
    `Parsing rule F, current token: ${currToken}, position: ${tokenPos}`
  );
  if (currToken === tokens.LPAREN) {
    match(tokens.LPAREN);
    E();
    match(tokens.RPAREN);
  } else match(tokens.ID);
}

// Função que inicializa o parser
const parse = () => {
  console.log('EXPRESSION BEING ANALYZED:', expression);
  console.log('Tokens:', input);

  // Captura o primeiro token
  nextToken();

  // Chama a regra (símbolo) inicial
  E();

  // currToken será undefined quando acabarem todos os tokens do input
  if (currToken === undefined && !hasError)
    console.log('*** EXPRESSION ACCEPTED ***');
  else console.error('!!! Expression rejected !!!');
};

// Chama a função do parser
parse();
