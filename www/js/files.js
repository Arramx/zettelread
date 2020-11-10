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
                if(!data.length) {
                    res('');
                    return;
                }
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
                    tags: entry.name.slice(entry.name.length-3) === '.md' ? lines[1].toLowerCase().split(' ') : [''],
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
        entries = entries.filter(e => e.isFile);

        for (entry of entries) {
            handleFile(entry).then(li => {
                ul.push(li)
                if (entries.length === ul.length) {
                    ul.sort((a,b) => {
                        if (a.name < b.name) return -1;
                        if (b.name < a.name) return 1;
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
        else window.resolveLocalFileSystemURL(`file://${path}`, dirEntry => {
            const dirReader = dirEntry.createReader();
            dirReader.readEntries(entries => {
               handleEntries(entries).then(ul => res(ul));
            });
        }, e => alert(`Error loading files, code: ${e.code}`));
    });
}