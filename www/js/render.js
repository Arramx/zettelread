const handleFile = entry => {
    return new Promise(res => {
        entry.file(file => {
            const reader = new FileReader();
    
            reader.onloadend = function() {
                const lines = this.result.split('\n');
                res({
                    heading: lines[0].substr(2),
                    tags: lines[1].split(' '),
                    name: entry.name,
                    link: entry.nativeURL
                });
            }
    
            reader.readAsText(file);
        });
    })
}

const handleDir = path => {
    return new Promise(res => {
        if (!path) res(null);

        window.resolveLocalFileSystemURL(`file://${path}`, dirEntry => {
            const dirReader = dirEntry.createReader();
            
            dirReader.readEntries(entries => {
                const ul = [];
                for (entry of entries.filter(entry => entry.name.substr(entry.name.length-3, 3) === '.md' && entry.isFile)) {
                    handleFile(entry).then(li => ul.push(li));
                }
                res(ul);
            });
        }, e => alert(`Error loading files, code: ${e.code}`));
    });
    
}