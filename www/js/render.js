const handleFile = entry => {
    return new Promise(res => {
        entry.file(file => {
            const reader = new FileReader();
    
            reader.onloadend = function() {
                const lines = this.result.split('\n');
                res({
                    heading: lines[0].substring(2, lines[0].length-16),
                    tags: lines[1].split(' '),
                    name: entry.name,
                    link: `file://${entry.nativeURL}`
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

const renderList = list => {
    const ul = document.createElement('ul');
    list.forEach(el => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const h5 = document.createElement('h5');
        const h6 = document.createElement('h6');
        const p = document.createElement('p');

        h5.innerHTML = el.heading;
        a.append(h5);

        h6.innerHTML = el.tags.join(' ');
        a.append(h6);

        p.innerHTML = el.name;
        a.append(p);

        a.setAttribute('href', el.link)
        li.append(a);
        ul.append(li);
    });
    document.getElementById('list').append(ul);
}