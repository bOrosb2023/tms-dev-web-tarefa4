/* Requisito 1 – arquivo script.js externo, linkado no index.html */

// Aguarda o HTML ser carregado antes de acessar os elementos do DOM
document.addEventListener("DOMContentLoaded", function () {
  // Requisito 2 – referências aos elementos do formulário e aos campos Nome, E-mail e CPF
  const formulario = document.getElementById("formulario");
  const campoNome = document.getElementById("nome");
  const campoEmail = document.getElementById("email");
  const campoCpf = document.getElementById("cpf");

  // Requisito 3 – <span> de erro de cada campo
  const erroNome = document.getElementById("erro-nome");
  const erroEmail = document.getElementById("erro-email");
  const erroCpf = document.getElementById("erro-cpf");

  // Requisito 3 – <div> de sucesso sobreposto ao formulário
  const divSucesso = document.getElementById("sucesso");
  const textoSucesso = document.getElementById("texto-sucesso");
  const botaoFechar = document.getElementById("botao-fechar");

  // Requisito 3 – expressões regulares usadas na validação
  const regexNome = /^[A-Za-zÀ-ÿ\s]+$/; // apenas letras e espaços
  const regexEmail = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/; // texto@dominio.extensão
  const regexFormatoCpf = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/; // 000.000.000-00 ou só números

  /* Requisito 3 – exibe o erro: borda vermelha no input e mensagem no <span> */
  function mostrarErro(input, span, mensagem) {
    input.classList.add("erro");
    span.textContent = mensagem;
  }

  /* Requisito 3 – remove a borda vermelha e apaga a mensagem do <span> */
  function limparErro(input, span) {
    input.classList.remove("erro");
    span.textContent = "";
  }

  /* Requisito 3 – validação do nome; retorna a mensagem de erro ou "" se estiver correto */
  function validarNome(valor) {
    if (valor === "") {
      return "Preencha o nome.";
    }
    if (!regexNome.test(valor)) {
      return "O nome deve ter apenas letras e espaços.";
    }
    return "";
  }

  /* Requisito 3 – validação do e-mail */
  function validarEmail(valor) {
    if (valor === "") {
      return "Preencha o e-mail.";
    }
    if (!regexEmail.test(valor)) {
      return "E-mail inválido. Use o formato nome@dominio.com.";
    }
    return "";
  }

  /* Requisito 3 – validação do CPF: formato e dígitos verificadores */
  function validarCpf(valor) {
    if (valor === "") {
      return "Preencha o CPF.";
    }
    if (!regexFormatoCpf.test(valor)) {
      return "CPF inválido. Use o formato 000.000.000-00.";
    }

    // Deixa somente os 11 números
    const numeros = valor.replace(/\D/g, "");

    // Rejeita sequências como 111.111.111-11
    if (/^(\d)\1{10}$/.test(numeros)) {
      return "CPF inválido. Todos os dígitos são iguais.";
    }

    // Calcula um dígito verificador a partir dos primeiros "quantidade" números
    function calcularDigito(quantidade) {
      let soma = 0;
      for (let i = 0; i < quantidade; i++) {
        soma += Number(numeros[i]) * (quantidade + 1 - i);
      }
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    }

    if (calcularDigito(9) !== Number(numeros[9]) || calcularDigito(10) !== Number(numeros[10])) {
      return "CPF inválido. Confira os números digitados.";
    }
    return "";
  }

  /* Requisito 3 – valida um campo e mostra ou limpa o erro; retorna true se o campo está correto */
  function validarCampo(input, span, funcaoValidacao) {
    const mensagem = funcaoValidacao(input.value.trim());
    if (mensagem !== "") {
      mostrarErro(input, span, mensagem);
      return false;
    }
    limparErro(input, span);
    return true;
  }

  /* Requisito 3 – intercepta o envio: preventDefault impede o comportamento padrão do form */
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    // Valida todos os campos (sem parar no primeiro erro) para mostrar todas as mensagens de uma vez
    const nomeOk = validarCampo(campoNome, erroNome, validarNome);
    const emailOk = validarCampo(campoEmail, erroEmail, validarEmail);
    const cpfOk = validarCampo(campoCpf, erroCpf, validarCpf);

    if (nomeOk && emailOk && cpfOk) {
      // Requisito 3 – formulário correto: mostra o <div> de sucesso sobreposto ao formulário
      const primeiroNome = campoNome.value.trim().split(/\s+/)[0];
      textoSucesso.textContent = "Obrigado, " + primeiroNome + "! Seus dados foram enviados com sucesso.";
      divSucesso.classList.remove("oculto");
    }
  });

  /* Requisito 3 – ao digitar, o erro daquele campo some */
  campoNome.addEventListener("input", function () {
    limparErro(campoNome, erroNome);
  });
  campoEmail.addEventListener("input", function () {
    limparErro(campoEmail, erroEmail);
  });
  campoCpf.addEventListener("input", function () {
    limparErro(campoCpf, erroCpf);
  });

  /* Requisito 3 – botão do <div> de sucesso: esconde o div e limpa o formulário para um novo cadastro */
  botaoFechar.addEventListener("click", function () {
    divSucesso.classList.add("oculto");
    formulario.reset();
    campoNome.focus();
  });
});