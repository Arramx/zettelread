const loadPersistentFile = name => {
    return new Promise(res => {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fs => {
            fs.root.getFile(name, {create: true, exclusive: false}, fileEntry => {
                fileEntry.file(file => {
                    const reader = new FileReader();
                    
                    reader.onloadend = function() {
                        if (this.result) res(this.result);
                        res('');
                    }
                    
                    reader.readAsText(file);
                });
            });
        });
    });
}

const writePersistentFile = (name, content) => {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fs => {
        fs.root.getFile(name, {create: true, exclusive: false}, fileEntry => {
            fileEntry.createWriter(fileWriter => {
                fileWriter.onerror = e => alert(`Error writing to file: ${e.toString()}`);
                fileWriter.write(content);
            });
        });
    });
}

const pickDir = (startPath='') => {
    return new Promise(res => {
        window.OurCodeWorld.Filebrowser.folderPicker.single({
            success(data) {
                if(!data.length) res(null);
                res(data[0]);
            },
            error(err) {
                alert(`An error occured: ${err}`);
            },
            startupPath: startPath.split('/').slice(0, startPath.split('/').length-1).join('/')
        });
    });
}