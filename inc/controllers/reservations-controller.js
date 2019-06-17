module.exports = {
    validateFields(fields){
        if(!fields.name) {
            return "Informe um nome";
        }
        if(!fields.email) {
            return "Informe um email";
        }
        if(!fields.people){
            return "Informe o numero de pessoas";
        }
        if(!fields.date){
            return "Informe uma data";
        } else {
            let currentDate = new Date();
            let date = fields.date.split('/').map(value => {
                return parseInt(value);
            });
            if(date[2] < currentDate.getFullYear()){
                return "Data da reserva deve ser posterior a data atual";
            } else {
                if(date[1] < (currentDate.getMonth() + 1)){
                    return "Data da reserva deve ser posterior a data atual";
                } else {
                    if(date[0] < currentDate.getDate()){
                        return "Data da reserva deve ser posterior a data atual";
                    } else {
                        let time = fields.time.split(':').map(value => {
                            return parseInt(value);
                        });
                        if(!fields.time){
                            return "Informe um horário";
                        } else if(time[0] < currentDate.getTime()){
                            return "Horário inváido da reserva";
                        } else {
                            if(time[1] < currentDate.getMinutes()){
                                return "Horário inváido da reserva";
                            }
                        }
                    }
                }
            }
        }
    }
}