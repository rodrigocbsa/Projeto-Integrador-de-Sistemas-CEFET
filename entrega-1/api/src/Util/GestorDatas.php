<?php

const DATA_PADRAO = '/^(20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/';
CONST HORA_PADRAO = '/^((1[1-9]):(0\d|[1-5]\d))|20:00$/';

const DIAS_TRADUZIDOS = [
    'monday' => 'segunda',
    'tuesday' => 'terça',
    'wednesday' => 'quarta',
    'thursday' => 'quinta',
    'friday' => 'sexta',
    'saturday' => 'sábado',
    'sunday' => 'domingo',
];
const RESERVA_PERMITIDA = [
    'dias' => ['quinta', 'sexta', 'sábado', 'domingo']
];
const DIA_MSG = "As reservas só podem ser realizadas de quinta a domingo.";
const HORARIO_MSG = "As reservas devem ocorrer das 11h as 20h.";

class GestorDatas{
    public function validaDia($dia,&$problemas){

        if (!preg_match(DATA_PADRAO, $dia)) {
            $problemas []= "Data inválida. O formato correto é 'YYYY-MM-DD'.";
            return;
        }

        // Determina o dia da semana
        $dia_semana = strtolower(date('l', strtotime($dia)));
        $dia_semana_pt = DIAS_TRADUZIDOS[$dia_semana] ?? null;
        if (!$dia_semana_pt) {
            $problemas []= "Erro ao determinar o dia da semana.";
            return;
        }

        // Verifica se o dia de reserva é permitido
        if (!$dia_semana_pt || !in_array($dia_semana_pt, RESERVA_PERMITIDA['dias'])) {
            $problemas []= DIA_MSG;
            return;
        }
    }

    public function validaHora($hora,&$problemas){

        if (!preg_match(HORA_PADRAO, $hora)) {
            $problemas []= "Hora inválida. O formato correto é 'hh:mm'.";
            return;
        }

        // Valida se o horário está dentro do permitido
        $horaNumero = intval(explode(':', $hora)[0]);
        $minutoNumero = intval(explode(':', $hora)[1]);
        if($horaNumero == 20 && $minutoNumero != 0){
            $problemas []= HORARIO_MSG;
        }
        else if($horaNumero < 11){
            $problemas []= HORARIO_MSG;
        }
    }
}