export class Movimentacao{
    
    id: number;
    dia: string;
    hora: string;
    quantidade: number;
    motivo: string;
    tipo: string;



    constructor(id: number, dia: string, hora: string, quantidade: number, motivo: string, tipo: string) {

        this.id = id;
        this.dia = dia;
        this.hora = hora;
        this.quantidade = quantidade;
        this.motivo = motivo;
        this.tipo = tipo;

    }
}