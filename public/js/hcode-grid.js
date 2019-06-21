class HCodeGrid {
    constructor(configs) {
        configs.listeners = Object.assign({
            afterUpdateClick: (e) => {
                $('#modal-update').modal('show');
            },
            afterDeleteClick: (e) => {
                window.location.reload();
            },
            afterFormCreate: (e) => {
                window.location.reload();
            },
            afterFormUpdate: (e) => {
                window.location.reload();
            }, 
            onFormCreateCatchError: (e) => {
                alert("Não foi possível enviar o formulário");
            },
            onFormUpdateCatchError: (e) => {
                alert("Não foi possível enviar o formulário");
            }
        }, configs.listeners)

        this._options = Object.assign({}, {
            formCreate: "#modal-create form",
            formUpdate: "#modal-update form",
            btnUpdate: "btn-update",
            btnDelete: "btn-delete",
            onUpdateLoad: (form, name, data) => {
                let input = form.querySelector(`[name=${name}]`); 

                if (input) input.value = data[name];
            }
        }, configs);

        this.rows = [...document.querySelectorAll('table tbody tr')];

        this.initForms();
        this.initButtons();
    }

    initForms() {
        this.formCreate = document.querySelector(this._options.formCreate);
        if (this.formCreate) {
            this.formCreate.save({
                success: () => {
                    this.fireEvents('afterFormCreate');
                },
                failure: () => {
                    this.fireEvents('onFormCreateCatchError');
                }
            });
        }
        
        this.formUpdate = document.querySelector(this._options.formUpdate);
        if (this.formUpdate) {
            this.formUpdate.save({
                success: () => {
                    this.fireEvents('afterFormUpdate');
                },
                failure: () => {
                    this.fireEvents('onFormUpdateCatchError');
                }
            });
        }
    }

    fireEvents(name, args) {
        if(typeof this._options.listeners[name] === 'function') {
            this._options.listeners[name].apply(this, args);
        }
    }

    getTrData(e) {
        let tr = e.path.find(el => {
            return (el.tagName.toUpperCase() === 'TR');
        });
        return JSON.parse(tr.dataset.row);
    }

    btnUpdateClick(e) {
        this.fireEvents('beforeUpdateClick', [e]);

        let data = this.getTrData(e);
        for(let name in data) {
            this._options.onUpdateLoad(this.formUpdate, name, data);
        }
        this.fireEvents('afterUpdateClick', [e]);
    }

    btnDeleteClick(e) {
        this.fireEvents('beforeDeleteClick', [e]);

        let data = this.getTrData(e);
        if(confirm(eval('`' + this._options.deleteMessage + '`'))){
            fetch(eval('`' + this._options.deleteUrl + '`'), {
            method: 'delete'
            }).then(response => response.json())
            .then(json => {
                this.fireEvents('afterDeleteClick')
            });
        }
    }

    initButtons() {
        this.rows.forEach(row => {
            [...row.querySelectorAll('.btn')].forEach(btn => {
                btn.addEventListener('click', e => {
                    if(e.target.classList.contains(this._options.btnUpdate)){
                        this.btnUpdateClick(e);
                    } else if (e.target.classList.contains(this._options.btnDelete)) {
                        this.btnDeleteClick(e);
                    } else {
                        this.fireEvents('buttonClick', [e.target, this.getTrData(e), e]);
                    }
                });
            });
        });
    }
}