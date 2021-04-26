export default {
    RequestError: function(status) {
        this.name = 'RequestError';
        this.message = 'Request not ok';
        this.status = status;
    },

    ApiError: function(code, msg) {
        this.name = 'ApiError';
        this.message = msg;
        this.code = code;
    }
}