import fs from 'fs';

function renderPage(page, includeNavbarAndFooter, config={}) {
    let navbar = '';
    let footer = '';
    
    if (includeNavbarAndFooter) {
        navbar = fs.readFileSync('../CLIENT/public/components/navbar/navbar.html').toString()
                    .replace('$TAB_TITLE', config.tabTitle || "Company name");
        footer = fs.readFileSync('../CLIENT/public/components/footer/footer.html').toString();
    }
    return navbar + page + footer;
}

function readPage(pagePath) {
    return fs.readFileSync(pagePath).toString();
}

export default {
    renderPage,
    readPage,
};
