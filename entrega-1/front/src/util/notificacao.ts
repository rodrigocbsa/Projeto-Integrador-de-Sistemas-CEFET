import 'simple-notify/dist/simple-notify.css'

export type TIPOS = "success" | "error" | "warning" | "info";

export class Notificacao{
    static async exibirNotificacao(mensagens: Array<string>, tipo: TIPOS){
        const { default: Notify } = await import('simple-notify');
        for(const m of mensagens){
            new Notify({
                status: tipo,
                text: m,
                effect: 'fade',
                speed: 1200,
                showIcon: true,
                showCloseButton: false,
                autoclose: true,
                autotimeout: 10000,
                type: 'outline',
                position: 'right top'
            });
        }
    }
}