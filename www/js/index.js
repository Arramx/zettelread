function onDeviceReady() {
    app =  {
        path: '',
        ul = [],
        updatePath() {
            document.getElementById('path').innerHTML = this.path.split('/')[this.path.split('/').length-1];
        },
        updateFiles(res) {
            this.path = res ? res : this.path;
            this.updatePath();
            handleDir(this.path).then(res => this.ul = res ? res : this.ul);
        }
    };
    
    loadPersistentFile('pathfile.txt', 'app', 'path').then(app.updateFiles);
    
    document.getElementById('selectDir').addEventListener('click', () => {
        pickDir(app.path).then(res => {
            app.updateFiles(res);
            writePersistentFile('pathfile.txt', app.path);
        });
    });
}

document.addEventListener('deviceready', onDeviceReady, false);