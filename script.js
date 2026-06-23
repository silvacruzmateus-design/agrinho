/// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    const btnCalcular = document.getElementById('btnCalcular');
    let impactChart = null;

    // Inicializa a simulação no primeiro carregamento
    calcularImpacto();

    btnCalcular.addEventListener('click', calcularImpacto);

    function calcularImpacto() {
        // Obter valores das entradas
        const area = parseFloat(document.getElementById('area').value) || 0;
        const manejo = document.getElementById('manejo').value;
        const energia = document.getElementById('energia').value;

        // Lógica do tipo de manejo
        let fatorCarbono = 0; 
        if (manejo === 'convencional') {
            fatorCarbono += 1.5; 
        } else if (manejo === 'direto') {
            fatorCarbono -= 0.8; 
        } else if (manejo === 'sustentavel') {
            fatorCarbono -= 2.2; 
        }

        // Lógica da fonte de energia
        if (energia === 'rede') {
            fatorCarbono += 0.3;
        } else if (energia === 'solar') {
            fatorCarbono -= 0.4;
        }

        // Cálculos Finais
        const totalCarbono = area * fatorCarbono;
        let creditoFinanceiro = 0;
        if (totalCarbono < 0) {
            creditoFinanceiro = Math.abs(totalCarbono) * 50;
        }

        // Atualizar os componentes visuais na tela (DOM)
        const txtCarbono = document.getElementById('valCarbono');
        const txtCredito = document.getElementById('valCredito');
        const cardCarbono = document.getElementById('cardCarbono');

        if (totalCarbono > 0) {
            txtCarbono.textContent = `+${totalCarbono.toFixed(1)} tCO₂eq`;
            txtCarbono.style.color = '#d32f2f';
            cardCarbono.style.borderTopColor = '#d32f2f';
            txtCredito.textContent = "R$ 0,00";
        } else {
            txtCarbono.textContent = `${totalCarbono.toFixed(1)} tCO₂eq`;
            txtCarbono.style.color = '#2e7d32';
            cardCarbono.style.borderTopColor = '#2e7d32';
            txtCredito.textContent = `R$ ${creditoFinanceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        // Atualizar Recomendações Dinâmicas
        atualizarInsights(manejo, energia);

        // Renderizar ou atualizar o Gráfico
        atualizarGrafico(totalCarbono);
    }

    function atualizarInsights(manejo, energia) {
        const list = document.getElementById('insightsList');
        list.innerHTML = ''; 

        const conselhos = [];

        if (manejo === 'convencional') {
            conselhos.push("<strong>Solo exposto:</strong> Mudar para o Plantio Direto pode reduzir seus custos com maquinário e evitar a erosão do solo.");
            conselhos.push("<strong>Emissões altas:</strong> Reduza a gradagem pesada para reter mais matéria orgânica na terra.");
        } else if (manejo === 'direto') {
            conselhos.push("<strong>Bom trabalho!</strong> O plantio direto está protegendo seu solo. Próximo passo: integrar árvores ou pecuária (ILPF) para dobrar os lucros com carbono.");
        } else {
            conselhos.push("<strong>Produtor do Futuro!</strong> Seu manejo integrado serve de modelo de sustentabilidade. Você está pronto para aplicar para certificações internacionais.");
        }

        if (energia === 'rede') {
            conselhos.push("<strong>Energia Limpa:</strong> Instalar painéis solares na fazenda se paga em poucos anos e corta a dependência de geradores a diesel.");
        } else {
            conselhos.push("<strong>Autossuficiente:</strong> O uso de energia renovável blinda sua propriedade contra os aumentos nas tarifas elétricas.");
        }

        conselhos.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item;
            list.appendChild(li);
        });
    }

    function atualizarGrafico(totalCarbono) {
        // CORREÇÃO: Passamos apenas a ID do elemento em vez do context '2d' direto, evitando o travamento do Chart.js
        const canvasElement = document.getElementById('impactChart');
        
        if (impactChart) {
            impactChart.destroy();
        }

        // Alvos de cor dinâmicos baseados no resultado
        const corBarra = totalCarbono > 0 ? '#d32f2f' : '#4caf50';

        impactChart = new Chart(canvasElement, {
            type: 'bar',
            data: {
                labels: ['Sua Fazenda', 'Meta Recomendada'],
                datasets: [{
                    label: 'Balanço de Carbono (Menor é melhor)',
                    data: [totalCarbono, -150],
                    backgroundColor: [corBarra, '#1b5e20'],
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'tCO₂eq / ano'
                        }
                    }
                }
            }
        });
    }
});
