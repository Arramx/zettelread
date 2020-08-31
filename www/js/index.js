function onDeviceReady() {
    app =  {
        path: '',
        updatePath() {
            document.getElementById('path').innerHTML = this.path.split('/')[this.path.split('/').length-1];
        },
        ul = []
    };
    
    loadPersistentFile('pathfile.txt', 'app', 'path').then(res => {
        app.path = res ? res : app.path;
        app.updatePath();
        handleDir(app.path).then(res => app.ul = res ? res : app.ul);
    });
    
    document.getElementById('selectDir').addEventListener('click', () => {
        pickDir(app.path).then(res => {
            app.path = res ? res.substr(7) : app.path;
            app.updatePath();
            writePersistentFile('pathfile.txt', app.path);
            handleDir(app.path).then(res => app.ul = res ? res : app.ul);
        });
    });
}

document.addEventListener('deviceready', onDeviceReady, false);