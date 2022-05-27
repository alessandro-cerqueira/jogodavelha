import React from "react";
import ReactDOM from "react-dom";
import "./style/style.css";

//function Casa(props) {
//  return (
//    <button className="square" onClick={props.onClick}>
//      {props.value}
//    </button>
//  );
//}

class Casa extends React.Component {
  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

class Tabuleiro extends React.Component {
  renderizarCasa(i) {
    return (
      <Casa
        value={this.props.casas[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="game-board">
        <div>
          <div className="board-row">
            {this.renderizarCasa(0)}
            {this.renderizarCasa(1)}
            {this.renderizarCasa(2)}
          </div>
          <div className="board-row">
            {this.renderizarCasa(3)}
            {this.renderizarCasa(4)}
            {this.renderizarCasa(5)}
          </div>
          <div className="board-row">
            {this.renderizarCasa(6)}
            {this.renderizarCasa(7)}
            {this.renderizarCasa(8)}
          </div>
        </div>
      </div>
    );
  }
}


class Historia extends React.Component {
  render() {
    return (
      <div className="game-info">
        <div>{this.props.status}</div>
        <ol>{this.props.movimentos}</ol>
      </div>
    );
  }
}


class JogoDaVelha extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jogadas: [
        {
          casas: Array(9).fill(null),
        },
      ],
      numeroDaJogada: 0,
      xJogando: true,
    };
  }
  
  handleClick(i) {
    // Tiro uma cópia do array de jogadas
    const anteriores = this.state.jogadas.slice(0, this.state.numeroDaJogada + 1);
    // Da cópia feita, pego a última jogada efetuada para servir de base para a nova jogada
    const jogadaAtual = anteriores[anteriores.length - 1];
    // Tiro uma cópia do estado das casas da última jogada que havia sido feita
    const casas = jogadaAtual.casas.slice();
    // Se o jogo teve vencedor ou se a casa já foi utilizada, saio do método
    if (this.verificarVencedor(casas) || casas[i]) {
      return;
    }
    // Marco a jogada na casa clicada
    casas[i] = this.state.xJogando ? "X" : "O";
    // Atualizado o state adicionando a nova jogada com a casa marcada
    this.setState({
      jogadas: anteriores.concat([
        {
          casas: casas,
        },
      ]),
      numeroDaJogada: anteriores.length,
      xJogando: !this.state.xJogando,
    });
  }

  vaPara(step) {
    this.setState({
      numeroDaJogada: step,
      xJogando: step % 2 === 0,
    });
  }

  verificarVencedor(casas) {
    const linhas = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < linhas.length; i++) {
      const [a, b, c] = linhas[i];
      if (
        casas[a] &&
        casas[a] === casas[b] &&
        casas[a] === casas[c]
      ) {
        return casas[a];
      }
    }
    return null;
  }

  render() {
    // Recupero o array de todas as jogadas presentes no state
    const anteriores = this.state.jogadas;
    // Recupero a última jogada
    const jogadaAtual = anteriores[this.state.numeroDaJogada];
    // Verificar se já houve vencedor
    const vencedor = this.verificarVencedor(jogadaAtual.casas);

    const moves = anteriores.map((step, numJogada) => {
      const descricao = numJogada
        ? "Vá para a jogada #" + numJogada
        : "Vá para o início do jogo";
      return (
        <li key={numJogada}>
          <button onClick={() => this.vaPara(numJogada)}>{descricao}</button>
        </li>
      );
    });

    let status;
    if (vencedor) {
      status = "Vencedor: " + vencedor;
    } else {
      status = "Próximo Jogador: " + (this.state.xJogando ? "X" : "O");
    }

    return (
      <div className="game">
         <Tabuleiro
           casas={jogadaAtual.casas}
           onClick={(i) => this.handleClick(i)}
         />
         <Historia
           status={status}
           movimentos={moves}
         />
      </div>
    );
  }
}


// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<JogoDaVelha />);
