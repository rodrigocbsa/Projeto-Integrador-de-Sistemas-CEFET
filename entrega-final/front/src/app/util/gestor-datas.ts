export class GestorDatas {

    private hoje: Date;
    private static readonly REGEX_DATA = /^(20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    private static readonly REGEX_HORA = /^((1[1-9]):(0\d|[1-5]\d))|20:00$/;

    constructor(){
        this.hoje = new Date();
        this.hoje.setSeconds(0);
    }

    validarData(data: string): Array<string> {
        const problemas = [];

        // Valida data com padrão regex YYYY-MM-DD.
        if(!GestorDatas.REGEX_DATA.test(data)){
            problemas.push("Data inválida.");
        } else {
      
            // Converter a data para um objeto tipo Date
            //const data = new Date(`${data}T00:00:00`); (EVITA PROBLEMA DE TIMEZONE)
            const date = new Date(
              Number(data.split('-')[0]), // Ano
              Number(data.split('-')[1]) - 1, // Mês (0 a 11)
              Number(data.split('-')[2]), // Dia
            ); // Converte a data para um objeto Date(ano,mes-1,dia) (EVITA PROBLEMA DE TIMEZONE)
      
            // Impedir reservas fora de quinta a domingo.
            const diaSemana = date.getDay(); // Obtém o número do dia da semana (0 a 6)
      
            // Verifica se o dia NÃO está entre quinta (4) e domingo (0)
            if (diaSemana < 4 && diaSemana !== 0) { 
              problemas.push('Reservas só podem ser realizadas entre quinta e domingo.');
            }
        }

        return problemas;
    }

    validarHora(horario: string, data: string): Array<string> {
        const problemas = [];

        // Valida hora com padrão regex.
        if(!GestorDatas.REGEX_HORA.test(horario)){
            problemas.push("Hora inválida. Horários permitidos: 11:00 as 20:00.");
        } else{
            if(this.ehHoje(new Date(
                Number(data.split('-')[0]), // Ano
                Number(data.split('-')[1]) - 1, // Mês (0 a 11)
                Number(data.split('-')[2]), // Dia
              ))){
                // Pega as datas em segundos para comparação
                const horasReserva = Number(horario.split(':')[0]);
                const horasAgora = this.hoje.getHours();

                // Impedir seleção de horas anteriores à hora atual.
                // (Necessário apenas no caso de o dia ser HOJE)
                if (horasReserva < horasAgora) {
                    problemas.push('Favor selecionar uma hora futura.');
                }
            } 
        }

        return problemas;
    }

    reservaEmAndamento(dataReserva: Date): boolean {
        let dataEhAgora = false;
        if(this.ehHoje(dataReserva)){
            // "agora" deve estar ENTRE o tempo inicial e final da reserva;
            const agora = this.hoje.getTime();
            const tempoInicial = dataReserva.getTime();
            const tempoFinal = tempoInicial + 7200000; // duas horas tem 7.200.000 ms

            dataEhAgora = (agora > tempoInicial && agora < tempoFinal);
        }

        return dataEhAgora;
    }

    ehHoje(data: Date): boolean {
        return data.getDate() === this.hoje.getDate() && 
             data.getMonth() === this.hoje.getMonth() && 
             data.getFullYear() === this.hoje.getFullYear();
    }
  
    validarDatasRelatorio(dataInicioInput: string, dataFinalInput: string): Array<string> {
        const problemas = [];

        if(dataInicioInput == '' || dataFinalInput == ''){
            problemas.push("É necessário preencher o período de datas para gerar o relatório. Campos não podem ser vazios.");
        } else{
            const dataInicioObj = new Date(dataInicioInput);
            const dataFinalObj = new Date(dataFinalInput);
            if(dataInicioObj > dataFinalObj){
                problemas.push("Data inicial deve ser menor ou igual à data final.");
            }
        }

        return problemas;
    }



}
