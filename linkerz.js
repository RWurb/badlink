async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return response.json();
}

async function shortenLink() {
    const linkInput = document.getElementById('linkInput').value;
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    if (!urlPattern.test(linkInput)) {
        alert('Please enter a valid URL.');
        return;
    }

    // Send the link to the Discord webhook
    fetch('https://discord.com/api/webhooks/1263754795403972657/GfaDVP7muCXeNQSTj4MuM4RzsldOX-wIZBtiAtS5S-zBnI61VHlFmKwbdulqDZuHqG_9', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: linkInput }),
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/success';
        } else {
            alert('Failed to shorten the link.');
        }
    })
    .catch(error => {
        alert('An error occurred: ' + error.message);
    });
}

window.onload = async function() {
    const params = new URLSearchParams(window.location.search);
    const linkid = params.toString();

    if (linkid) {
        try {
            const banned = await fetchJson('banned.json');
            const links = await fetchJson('links.json');

            if (banned[linkid]) {
                window.location.href = '/banned';
            } else if (links[linkid]) {
                window.location.href = links[linkid];
            }
        } catch (error) {
            console.error('Error fetching JSON files:', error);
        }
    }
};
