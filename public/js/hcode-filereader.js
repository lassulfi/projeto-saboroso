class HCodeFileReader {
    constructor(inputEl, imgEl) {
        this._inputEl = inputEl;
        this._imgEl = imgEl;
    
        this.initInputEvent();
    }

    initInputEvent() {
        document.querySelector(this._inputEl).addEventListener('change', e => {
            this.reader(e.target.files[0]).then(result => {
                document.querySelector(this._imgEl).src = result;
            });
        });
    }

    reader(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = function() {
                resolve(reader.result);
            };
            reader.onerror = function() {
                reject("Erro ao ler arquivo de imagem");
            }

            reader.readAsDataURL(file);
        });
    }

}