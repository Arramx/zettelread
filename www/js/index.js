function onDeviceReady() {

    const app =  {
        path: '',
        ul: [],
        tags: [],
        enabled: [],
        updatePath() {
            document.getElementById('path').innerHTML = this.path.split('/')[this.path.split('/').length-1];
        },
        createList(ul) {
            if (this.enabled.length) {
                renderList(ul.filter(e => new Set([...e.tags, ...this.enabled]).size < [...e.tags, ...this.enabled].length))
            } else {
                renderList(ul);
            }
        },
        updateFiles(res) {
            this.path = res ? res : this.path;
            this.updatePath();
            handleDir(this.path).then(ul => {
                this.ul = ul ? ul : this.ul;
                this.createList(this.ul);
                this.tags = [...new Set(this.ul.map(e => e.tags).flat())].sort((a,b) => {
                    if (a < b) return -1;
                    if (a > b) return 1;
                    return 0;
                });
                renderTags(this.tags, this);
            });
        }
    };
    
    loadPersistentFile('pathfile.txt', 'app', 'path').then(res => app.updateFiles(res));
    
    document.getElementById('selectDir').addEventListener('click', () => {
        pickDir(app.path).then(res => {
            app.updateFiles(res);
            writePersistentFile('pathfile.txt', app.path);
        });
    });

    document.getElementById('searchButton').addEventListener('click', () => {
        const search = document.getElementById('searchInput').value.toLowerCase();
        app.createList(app.ul.filter(el => el.content.includes(search)));
    });
    
}

document.addEventListener('deviceready', onDeviceReady, false);