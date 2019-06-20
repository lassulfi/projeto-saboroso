class HCodeGrid {
    constructor(configs) {
        this._options = Object.assign({}, {
            formCreate: "#modal-create form",
            formUpdate: "#modal-update form",
            btnUpdate: ".btn-update",
            btnDelete: ".btn-delete"
        }, configs);

        this.initForms();
        this.initButtons();
    }

    initForms() {
        this.formCreate = document.querySelector(this._options.formCreate);
        this.formCreate.save().then(json => {
            window.location.reload();
        }).catch(err => {
            console.error(err);
        });
        
        this.formUpdate = document.querySelector(this._options.formUpdate);
        this.formUpdate.save().then(json => {
            window.location.reload();
        }).catch(err => {
            console.error(err);
        });
    }

    initButtons() {

        [...document.querySelectorAll(this._options.btnUpdate)].forEach(btn => {
            btn.addEventListener('click', e => {
            let tr = e.path.find(el => {
                return (el.tagName.toUpperCase() === 'TR');
            });
            let data = JSON.parse(tr.dataset.row);
            for(let name in data) {
                let input = this.formUpdate.querySelector(`[name=${name}]`);
                switch (name) {
                case "date":
                    if (input) input.value = moment(data[name]).format('YYYY-MM-DD')
                    break;
                default:
                    if(input) input.value = data[name];
                    break;
                }
            }
            $('#modal-update').modal('show');
            });
        });

        [...document.querySelectorAll(this._options.btnDelete)].forEach(btn => {
            btn.addEventListener('click', e => {
            let tr = e.path.find(el => {
                return (el.tagName.toUpperCase() === 'TR');
            });
            let data = JSON.parse(tr.dataset.row);
            if(confirm(eval('`' + this._options.deleteMessage + '`'))){
                fetch(eval('`' + this._options.deleteUrl + '`'), {
                method: 'delete'
                }).then(response => response.json())
                .then(json => window.location.reload());
            }
            });
        });
    }
}