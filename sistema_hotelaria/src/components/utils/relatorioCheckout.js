import * as XLSX from 'xlsx';

export function gerarRelatorioCheckout({ hospede, quarto, hospedagem, pedidosAlimentacao }) {
  const wb = XLSX.utils.book_new();

  // --- Aba 1: Resumo da Hospedagem ---
  const resumoData = [
    ['RELATÓRIO DE CHECKOUT'],
    [],
    ['Hóspede', hospede.nome],
    ['CPF', hospede.cpf || ''],
    ['Email', hospede.email || ''],
    ['Telefone', hospede.telefone || ''],
    [],
    ['Quarto', `${quarto.numero} - ${quarto.tipo}`],
    ['Preço da Diária', parseFloat(quarto.preco) || 0],
    ['Data de Entrada', hospedagem.dataEntrada ? new Date(hospedagem.dataEntrada).toLocaleDateString('pt-BR') : ''],
    ['Data de Saída', hospedagem.dataSaida ? new Date(hospedagem.dataSaida).toLocaleDateString('pt-BR') : ''],
    ['Diárias', hospedagem.diarias || 0],
    ['Valor Hospedagem', parseFloat(hospedagem.valorTotal) || 0],
  ];

  const valorAlimentacao = pedidosAlimentacao.reduce(
    (acc, p) => acc + ((parseFloat(p.preco) || 0) * (parseInt(p.quantidade) || 0)), 0
  );
  const valorHospedagem = parseFloat(hospedagem.valorTotal) || 0;

  resumoData.push(
    [],
    ['GASTOS COM ALIMENTAÇÃO', valorAlimentacao],
    [],
    ['TOTAL GERAL', valorHospedagem + valorAlimentacao],
  );

  const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);

  // Ajustar largura das colunas
  wsResumo['!cols'] = [{ wch: 25 }, { wch: 35 }];

  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

  // --- Aba 2: Detalhamento de Alimentação ---
  if (pedidosAlimentacao.length > 0) {
    const alimentacaoHeader = ['ID', 'Prato', 'Quantidade', 'Preço Unit.', 'Total', 'Status'];
    const alimentacaoRows = pedidosAlimentacao.map(p => [
      p.id_alimentacao,
      p.prato,
      parseInt(p.quantidade) || 0,
      parseFloat(p.preco) || 0,
      (parseFloat(p.preco) || 0) * (parseInt(p.quantidade) || 0),
      p.status === 'finalizado' ? 'Finalizado' : 'Aberto',
    ]);

    const alimentacaoData = [alimentacaoHeader, ...alimentacaoRows];
    const wsAlimentacao = XLSX.utils.aoa_to_sheet(alimentacaoData);
    wsAlimentacao['!cols'] = [
      { wch: 8 }, { wch: 25 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 12 },
    ];

    XLSX.utils.book_append_sheet(wb, wsAlimentacao, 'Alimentação');
  }

  // --- Gerar e baixar ---
  const nomeArquivo = `checkout_quarto${quarto.numero}_${hospede.nome.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, nomeArquivo);
}
