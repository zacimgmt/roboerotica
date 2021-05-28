

(function () {
    new Vue({
        el: '#main',
        data: {
           images: {}
        },
        mounted: function () {
            console.log('on');
            var vueInstance = this;
            axios.get('/images').then(function(resp) {
                console.log('resp: ', resp);
                vueInstance.images = resp.data.rows;
                console.log('resp.data.rows: ', resp.data.rows);
            });
        }
    });
})();
