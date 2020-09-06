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
                if(!data.length) res('');
                res(data[0].substr(7));
            },
            error(err) {
                alert(`An error occured: ${err}`);
            },
            startupPath: startPath.split('/').slice(0, startPath.split('/').length-1).join('/')
        });
    });
}

const handleFile = entry => {
    return new Promise(res => {
        entry.file(file => {
            const reader = new FileReader();
    
            reader.onloadend = function() {
                const lines = this.result.split('\n');
                res({
                    heading: lines[0].substring(2, lines[0].length-16),
                    tags: lines[1].toLowerCase().split(' '),
                    name: entry.name,
                    link: `file://${entry.nativeURL}`,
                    content: this.result.toLowerCase()
                });
            }
    
            reader.readAsText(file);
        });
    })
}

const handleEntries = entries => {
    return new Promise(res => {
        const ul = [];
        for (entry of entries) {
            handleFile(entry).then(li => {
                ul.push(li)
                if (entries.length === ul.length) {
                    ul.sort((a,b) => {
                        const x = parseInt(`${a.name.substr(0,4)}${a.name.substr(5,2)}${a.name.substr(8,2)}${a.name.substr(8,2)}${a.name.substr(8,2)}`);
                        const y = parseInt(`${b.name.substr(0,4)}${b.name.substr(5,2)}${b.name.substr(8,2)}${b.name.substr(8,2)}${b.name.substr(8,2)}`);
                        if (x-y < 0) return -1;
                        if (y-x < 0) return 1;
                        return 0;
                    });
                    res(ul);
                }
            });

        }
    });
}

const handleDir = path => {
    return new Promise(res => {
        if (!path) res(null);
        window.resolveLocalFileSystemURL(`file://${path}`, dirEntry => {
            const dirReader = dirEntry.createReader();
            dirReader.readEntries(entries => {
               handleEntries(entries).then(ul => res(ul));
            });
        }, e => alert(`Error loading files, code: ${e.code}`));
    });
}