function onDeviceReady() {
    app =  {
        path: '',
        ul: [],
        updatePath() {
            document.getElementById('path').innerHTML = this.path.split('/')[this.path.split('/').length-1];
        },
        updateFiles(res) {
            this.path = res ? res : this.path;
            document.getElementById('path').innerHTML = this.path.split('/')[this.path.split('/').length-1];
            handleDir(this.path).then(function(ul) {this.ul = ul ? ul : this.ul;});
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