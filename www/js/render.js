const renderList = list => {
    const ul = document.createElement('ul');
    list = list.filter(el => el.name.slice(el.name.length-3) === '.md');
    list.forEach(el => {
        const li = document.createElement('li');
        const h5 = document.createElement('h5');
        const h6 = document.createElement('h6');
        const p = document.createElement('p');

        h5.innerHTML = el.heading;
        h5.classList.add('heading');
        li.append(h5);

        h6.innerHTML = el.tags.join(' ');
        h6.classList.add('tags');
        li.append(h6);

        p.innerHTML = el.name;
        p.classList.add('plink');
        p.addEventListener('click', () => cordova.plugins.fileOpener2.open(el.link, 'application/md'));
        li.append(p);

        li.classList.add('item');
        ul.append(li);
    });
    document.getElementById('list').innerHTML = '';

    ul.setAttribute('class', 'ul');
    document.getElementById('list').append(ul);
}

const renderTags = (tags, app) => {
    const div = document.createElement('div');
    div.setAttribute('id', 'tagDisplay');
    div.classList.add('tagsDisplay');

    tags.forEach(tag => {
        const p = document.createElement('p');
        p.classList.add('pTag');
        p.innerHTML = tag;
        p.addEventListener('click', () => {
            p.classList.toggle('tagClicked');
            if (p.classList.contains('tagClicked')) {
                app.enabled.push(tag);
            } else {
                app.enabled = app.enabled.filter(e => e !== tag);
            }
        });
        div.append(p);
    });
    document.getElementById('tagsContainer').innerHTML = '';
    document.getElementById('tagsContainer').append(div);
    document.getElementById('tagsButton').addEventListener('click', () => document.getElementById('tagDisplay').classList.add('showTags'));
    document.addEventListener('click', e => {
        const element = document.getElementById('tagDisplay');
        if (!element.contains(e.target) && !(e.target.getAttribute('id') === 'tagsButton') && element.classList.contains('showTags')) {
            document.getElementById('tagDisplay').classList.remove('showTags');
            app.createList(app.ul);
        }
    });
};