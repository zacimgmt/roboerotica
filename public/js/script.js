(function () {
    Vue.component("image-component", {
        template: "#template",
        props: ["id"],
        data: function () {
            return { url: "", username: "", title: "", description: "" };
        },
        methods: {
            closeInChild() {
                this.$emit("close");
            },
        },
        mounted() {
            console.log("this.props: ", this.id);
            axios.get(`/component/${this.id}`).then((data) => {
                console.log("data: ", data);
                const { username, description, title, url } = data.data;
                this.username = username;
                this.description = description;
                this.title = title;
                this.url = url;
            });
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            username: "",
            description: "",
            image: null,
            clicked: 0,
        },

        mounted() {
            console.log("on");
            var vueInstance = this;
            console.log("this.images ", vueInstance.images);
            axios.get("/images").then(function (resp) {
                console.log("resp: ", resp.data.rows);
                vueInstance.images = resp.data.rows;
                console.log("this images", vueInstance.images);
            });
        },
        methods: {
            handleFileChange(e) {
                console.log("e.target: ", e.target.files[0]);
                console.log("change");
                this.image = e.target.files[0];
            },
            handleSubmit(e) {
                console.log("click");
                console.log("this on click: ", this);
                const data = new FormData();
                data.append("title", this.title);
                data.append("image", this.image);
                data.append("description", this.description);
                data.append("username", this.username);
                axios.post("/upload", data).then((data) => {
                    const { url, title } = data.data;
                    this.images.unshift({
                        url,
                        title,
                    });
                    console.log("data in axios: ", data);
                });
                const inputs = document.getElementsByTagName("input");
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].value = '';
                }
            },
            handleImageClick(argument) {
                this.clicked = argument;
                console.log("this.clicked: ", this.clicked);
            },
            closeInParent(e) {
                this.clicked = null;
            },
        },
    });
})();
