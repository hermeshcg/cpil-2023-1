const fs = require('fs');

const blanks = [' ', '\t', '\n', '\r'];

const regexAlpha = /[A-Za-z]/;
const regexAlphaNum = /[A-Za-z0-9]/;
const regexDigits = /[0-9]/;

/* ABRE O ARQUIVO QUE SERÁ ANALISADO */
const openFile = () => {
  // Pega o TERCEIRO parâmetro da linha de comando
  const filename = process.argv[2];

  // Se houver o terceiro parâmetro
  if (filename) {
    try {
      const fileContent = fs.readFileSync(filename, 'utf-8');
      return fileContent;
    } catch (error) {
      console.error(error);
      process.exit(-1);
    }
  } else {
    console.log('Usage: node lexer.js <filename>');
    console.log('No filename provided.');
    process.exit(-1); // Termina o script com erro
  }
};

const analyze = (source) => {
  let state = 0; // Estado do autômato
  let lexeme = ''; // Lexema sendo lido
  let char = ''; // Caractere sendo lido
  let pos; // Posição sendo processada
  let row = 1; // Primeira linha
  let col = 1; // Primeira coluna
  const symbolsTable = []; // Tabela de símbolos

  // Acrescenta uma quebra de linha ao final do código-fonte
  // para possibilitar o processamento do último lexema
  source += '\n';

  // Função que guarda o caractere atual no lexema
  // e avança para o próximo estado
  const advanceTo = (nextState) => {
    lexeme += char;
    state = nextState;
  };

  // Acaba de ler um lexema em um estado terminal
  const terminate = (finalState) => {
    // Só acrescenta o caractere ao lexema se não for um branco
    if (!blanks.includes(char)) lexeme += char;
    state = finalState;

    // Insere o lexema na tabela de símbolos,
    // de acordo com o estado atual
    switch (state) {
      case 6.1: // plus
        symbolsTable.push({ lexeme, token: 'plus' });
        break;

      case 6.2: // minus
        symbolsTable.push({ lexeme, token: 'minus' });
        break;

      case 6.3: // times
        symbolsTable.push({ lexeme, token: 'times' });
        break;

      case 6.4: // div
        symbolsTable.push({ lexeme, token: 'div' });
        break;

      case 6.5: // lparen
        symbolsTable.push({ lexeme, token: 'lparen' });
        break;

      case 6.6: // rparen
        symbolsTable.push({ lexeme, token: 'rparen' });
        break;

      case 6.7: // keyword read e write
        symbolsTable.push({ lexeme, token: 'keyword', value: lexeme });
        break;

      case 6.8: // identifier
        symbolsTable.push({ lexeme, token: 'identifier', value: lexeme });
        break;

      case 6.9: // number
        symbolsTable.push({ lexeme, token: 'number', value: lexeme });
        break;

      case 6.11: // assign
        symbolsTable.push({ lexeme, token: 'assign' });
        break;
    }

    // Reseta estado e lexema
    state = 0;
    lexeme = '';
  };

  const displayError = () => {
    console.error(
      `ERROR [${row}:${col}]: unexpected char "${char}" (state ${state}).`
    );
    // Quando houver erro, termina o programa
    process.exit(-1);
  };

  // Percorre todo o código-fonte, caractere a caractere
  for (pos = 0; pos < source.length; pos++) {
    // Lê um caractere do código-fonte
    char = source.charAt(pos);

    if (char == '\n') {
      row++;
      col = 0;
    }

    switch (state) {
      case 0:
        if (char === 'r') advanceTo(1);
        else if (char === 'w') advanceTo(7);
        else if (char.match(regexDigits)) advanceTo(13);
        else if (char === '.') advanceTo(14);
        else if (char === ':') advanceTo(17);
        // Qualquer letra, exceto "r" e "w", já processadas acima
        else if (char.match(regexAlpha)) advanceTo(5);
        else if (char === '+') terminate(6.1);
        else if (char === '-') terminate(6.2);
        else if (char === '*') terminate(6.3);
        else if (char === '/') terminate(6.4);
        else if (char === '(') terminate(6.5);
        else if (char === ')') terminate(6.6);
        // Ignora caracteres em branco
        else if (blanks.includes(char)) continue;
        else displayError();

        break;

      case 1:
        if (char === 'e') advanceTo(2);
        else if (char.match(regexAlphaNum)) advanceTo(5);
        else displayError();
        break;

      case 2:
        if (char === 'a') advanceTo(3);
        else if (char.match(regexAlphaNum)) advanceTo(5);
        else displayError();
        break;

      case 3:
        if (char === 'd') advanceTo(4);
        else if (char.match(regexAlphaNum)) advanceTo(5);
        else displayError();
        break;

      case 4:
        if (char.match(regexAlphaNum)) advanceTo(5);
        else if (blanks.includes(char)) terminate(6.7);
        else displayError();
        break;

      case 5:
        if (char.match(regexAlphaNum)) advanceTo(5);
        else if (blanks.includes(char)) terminate(6.8);
        else displayError();
        break;

      case 7:
        if (char === 'r') advanceTo(8);
        else if (char.match(regexAlphaNum)) advanceTo(5);
        else if (blanks.includes(char)) terminate(6.8);
        else displayError();
        break;

      case 8:
        if (char === 'i') advanceTo(9);
        else if (char.match(regexAlphaNum)) advanceTo(5);
        else if (blanks.includes(char)) terminate(6.8);
        else displayError();
        break;

      case 9:
        if (char === 't') advanceTo(10);
        else if (char.match(regexAlphaNum)) advanceTo(5);
        else if (blanks.includes(char)) terminate(6.8);
        else displayError();
        break;

      case 10:
        if (char === 'e') advanceTo(11);
        else if (char.match(regexAlphaNum)) advanceTo(5);
        else if (blanks.includes(char)) terminate(6.8);
        else displayError();
        break;

      case 11:
        if (char.match(regexAlphaNum)) advanceTo(5);
        else if (blanks.includes(char)) terminate(6.7);
        else displayError();
        break;

      case 13:
        if (char.match(regexDigits)) advanceTo(13);
        else if (char === '.') advanceTo(14);
        else if (blanks.includes(char)) terminate(6.9);
        else displayError();
        break;

      case 14:
        if (char.match(regexDigits)) advanceTo(14);
        else if (blanks.includes(char)) terminate(6.9);
        else displayError();
        break;

      case 17:
        if (char === '=') terminate(6.11);
        else displayError();
        break;
    }

    // Incrementa o número da coluna se o caractere não for retorno de carro (\r)
    if (char !== '\r') col++;
  }

  // Exibe a tabela de símbolos
  console.log('---------------TABELA DE SÍMBOLOS---------------');
  console.log(symbolsTable);
};

const source = openFile();
analyze(source);
