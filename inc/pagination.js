let connection = require('./db');

class Pagination {
    constructor(query, params = [], itemsPerPage = 10) {
        this.query = query;
        this.params = params;
        this.currentPage = 1;
        this.itemsPerPage = itemsPerPage;
    }

    getPage(page) {
        this.currentPage = page - 1;
        this.params.push(this.currentPage * this.itemsPerPage, this.itemsPerPage);

        return new Promise((resolve, reject) => {
            connection.query([this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";"), this.params, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    this.data = results[0];
                    this.total = results[1][0].FOUND_ROWS;
                    this.totalPages = Math.ceil(this.total / this.itemsPerPage);
                    this.currentPage++;
                    
                    resolve(this.data);
                }
            });
        });
    }

    getTotal() {
        return this.total;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getTotalPages() {
        return this.totalPages;
    }

    getNavigation(params) {
        let limitPagesNav = 5;
        let links = [];
        let nrstart = 0;
        let nrend = 0;

        if (this.getTotalPages() < limitPagesNav) {
            limitPagesNav = this.getTotalPages();
        }

        //Is the user on the first pages?
        if ((this.getCurrentPage() - parseInt(limitPagesNav / 2)) < 1) {
            nrstart = 1;
            nrend = limitPagesNav;
        } else if ((this.getCurrentPage() + parseInt(limitPagesNav / 2)) > this.getTotalPages()) {
            //The user is getting closer to the last pages
            nrstart = this.getTotalPages() - limitPagesNav;
            nrend = this.getTotalPages();
        } else {
            nrstart = this.getCurrentPage() - parseInt(limitPagesNav / 2);
            nrend = this.getCurrentPage() + parseInt(limitPagesNav / 2);
        }

        if(this.getCurrentPage() > 1) {
            links.push({
                text: "<<",
                href: `?${this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage() - 1}))}`
            })
        }

        for(let i = nrstart; i < nrend; i++){
            links.push({
                text: i,
                href: `?${this.getQueryString(Object.assign({}, params, {page: i}))}`,
                active: (i === this.getCurrentPage())
            });
        }

        if(this.getCurrentPage() < this.getTotalPages()) {
            links.push({
                text: ">>",
                href: `?${this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage() + 1}))}`
            });
        }

        return links;
    }

    getQueryString(params) {
        let queryString = [];
        for (let name in params) {
            queryString.push(`${name}=${params[name]}`);
        }

        return queryString.join("&");
    }
}

module.exports = Pagination;