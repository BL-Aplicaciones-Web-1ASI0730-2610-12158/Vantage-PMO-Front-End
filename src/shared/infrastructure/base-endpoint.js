import baseApi from './base-api.js';

/**
 * Base Endpoint class.
 * Provides generic CRUD methods for any resource.
 * Extend this class in each bounded context service.
 */
export class BaseEndpoint {
    /**
     * @param {string} resourcePath - The endpoint path from import.meta.env (e.g. "/users")
     */
    constructor(resourcePath) {
        this.resourcePath = resourcePath;
        this.api = baseApi;
    }

    getAll() {
        return this.api.get(this.resourcePath).then(res => res.data);
    }

    getById(id) {
        return this.api.get(`${this.resourcePath}/${id}`).then(res => res.data);
    }

    getByQuery(params) {
        return this.api.get(this.resourcePath, { params }).then(res => res.data);
    }

    create(data) {
        return this.api.post(this.resourcePath, data).then(res => res.data);
    }

    update(id, data) {
        return this.api.put(`${this.resourcePath}/${id}`, data).then(res => res.data);
    }

    delete(id) {
        return this.api.delete(`${this.resourcePath}/${id}`).then(res => res.data);
    }
}
