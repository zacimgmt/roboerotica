(function () {
    Vue.component("image-component", {
        template: "#template",
        props: ["id"],
        data: function () {
            return {
                url: "",
                username: "",
                title: "",
                description: "",
                created_at: "",
                nextId: "",
                prevId: "",
                comment_username: "",
                comment: "",
                justAdded: {},
            };
        },
        methods: {
            closeInChild() {
                this.$emit("close");
            },
            submitComment() {
                console.log("this in image component: ", this.comment);
                const submit = {
                    comment: this.comment,
                    username: this.comment_username,
                    id: this.id,
                };
                axios.post("/comment", submit).then((data) => {
                    console.log(
                        "data in submitcomment post axios post comment: ",
                        data
                    );
                    this.justAdded = data.data;
                    console.log("this.justAdded: ", this.justAdded);
                });
                const inputs = document.getElementsByClassName("commentInput");
                inputs[0].value = "";
            },
            deleteImg(id) {
                console.log("id: ", id);
                axios.get(`/delete/${this.id}`);
                this.$emit("deleteimg");
            },
        },
        mounted() {
            console.log("this.props: ", this.id);
            axios.get(`/component/${this.id}`).then((data) => {
                if (data.data.failure) {
                    return this.$emit("close");
                } else {
                    console.log("data in mounted image: ", data);
                    const {
                        username,
                        description,
                        title,
                        url,
                        created_at,
                        prevId,
                        nextId,
                    } = data.data;

                    this.username = username;
                    this.description = description;
                    this.title = title;
                    this.url = url;
                    this.prevId = prevId;
                    this.nextId = nextId;
                    this.created_at = new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "long",
                        timeStyle: "short",
                    }).format(new Date(created_at));
                }
            });
        },
        watch: {
            id(newVal, oldVal) {
                console.log("newVal: ", newVal);
                axios.get(`/component/${this.id}`).then((data) => {
                    if (data.data.failure) {
                        return this.$emit("close");
                    } else {
                        console.log("data: ", data);
                        const {
                            username,
                            description,
                            title,
                            url,
                            created_at,
                            prevId,
                            nextId,
                        } = data.data;

                        this.username = username;
                        this.description = description;
                        this.title = title;
                        this.url = url;
                        this.prevId = prevId;
                        this.nextId = nextId;
                        this.created_at = new Intl.DateTimeFormat("en-GB", {
                            dateStyle: "long",
                            timeStyle: "short",
                        }).format(new Date(created_at));
                    }
                });
            },
        },
    });

    Vue.component("comment-component", {
        template: "#comment",
        props: ["id", "justAdded"],
        data: function () {
            return { comments: [] };
        },
        mounted() {
            axios.get(`/comment/${this.id}`).then((data) => {
                console.log("data in axios get comment this id: ", data.data);
                for (var i = 0; i < data.data.length; i++) {
                    data.data[i].created_at = new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "long",
                        timeStyle: "short",
                    }).format(new Date(data.data[i].created_at));
                    this.comments.push(data.data[i]);
                }
                console.log("this.comments: ", this.comments);
            });
        },
        watch: {
            justAdded(newVal, oldVal) {
                this.comments.unshift(newVal);
            },
            id(newVal, oldVal) {
                console.log("change in comment component: ");
                axios.get(`/comment/${this.id}`).then((data) => {
                    console.log(
                        "data in axios get comment this id: ",
                        data.data
                    );
                    this.comments = [];
                    for (var i = 0; i < data.data.length; i++) {
                        this.comments.push(data.data[i]);
                    }
                    console.log("this.comments: ", this.comments);
                });
            },
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
            show: false,
            imageId: location.hash.slice(1),
            upload: 0,
            notifications: 0,
            notifId: 0,
            uploadError: 0,
        },

        mounted() {
            console.log("on");
            var vueInstance = this;
            let img = this.images;
            console.log("this.images ", vueInstance.images);
            axios.get("/images").then(function (resp) {
                console.log("resp: ", resp.data.rows);
                vueInstance.images = resp.data.rows;
                setInterval(() => {
                    scrollPos(vueInstance.images);
                }, 1000);
            });
            console.log("document.location: ", document.location.hash);
            window.addEventListener("hashchange", (e) => {
                console.log("changed");
                this.imageId = location.hash.slice(1);
            });

            setInterval(() => {
                axios
                    .get(`/notifications/${this.images[0].id}`)
                    .then((data) => {
                        console.log("data.data: ", data.data);
                        this.notifications = data.data.notifications;
                        this.notifId = data.data.id;
                    });
            }, 5000);
        },
        updated() {
            console.log("data got updated");
        },
        methods: {
            handleFileChange(e) {
                console.log("e.target: ", e.target.files[0]);
                console.log("change");
                this.image = e.target.files[0];
            },
            handleSubmit(e) {
                console.log("this on click: ", this);
                const data = new FormData();
                data.append("title", this.title);
                data.append("image", this.image);
                data.append("description", this.description);
                data.append("username", this.username);
                axios.post("/upload", data).then((data) => {
                    if (data.data.failure) {
                        this.uploadError = 1;
                    } else {
                        const { url, title, description, username, id } =
                            data.data;

                        this.images.unshift({
                            url,
                            title,
                            id,
                            description,
                            username,
                        });
                        console.log("data in axios: ", data);
                        const inputs = document.getElementsByTagName("input");
                        for (var i = 0; i < inputs.length; i++) {
                            inputs[i].value = "";
                        }
                        this.upload = !this.upload;
                        this.uploadError = 0;
                    }
                });
            },
            handleImageClick(argument) {
                this.clicked = argument;
                console.log("argument: ", argument);
                console.log("this.clicked in hadnelImageclick: ", this.clicked);
            },
            closeInParent(e) {
                this.clicked = null;
                this.imageId = null;
                location.hash = "";
                // this.upload = 0;
            },
            more() {
                console.log("hello");

                const { id } = this.images[this.images.length - 1];

                axios.get(`/more/${id}`).then((data) => {
                    console.log("data", data);

                    for (var i = 0; i < data.data.length; i++) {
                        this.images.push(data.data[i]);
                        if (data.data[i].id == data.data[i].lowestId) {
                            this.show = false;
                        }
                    }
                    console.log("this.images: ", this.images);
                });
            },
            update() {
                const vueInstance = this;
                axios
                    .get(`/newImage/${vueInstance.notifId}`)
                    .then(function (data) {
                        console.log("resp in update: ", data);

                        console.log("this.images: ", this.images);
                        vueInstance.images.unshift(data.data.data);
                    });
            },
            deleteImgParent() {
                console.log("happened");
                const vueInstance = this;
                for (let i = 0; i < vueInstance.images.length; i++) {
                    console.log("vueInstance.images: ", vueInstance.images);

                    if (vueInstance.images[i].id == vueInstance.imageId) {
                        vueInstance.images.splice(i, 1);
                        vueInstance.imageId = 0;
                    }
                }
            },
        },
    });

    function commentsAxios(id) {
        axios.get(`/comment/${id}`).then((data) => {
            console.log("data in axios get comment this id: ", data.data);
            this.comments = [];
            for (var i = 0; i < data.data.length; i++) {
                this.comments.push(data.data[i]);
            }
            console.log("this.comments in commentaixos: ", this.comments);
        });
    }

    function scrollPos(images) {
        // console.log('images: ', images);
        const currentPos =
            document.documentElement.scrollTop +
            document.documentElement.clientHeight;
        const treshold = document.documentElement.scrollHeight - 500;
        setTimeout(() => {
            if (currentPos > treshold) {
                const { id } = images[images.length - 1];

                axios.get(`/more/${id}`).then((data) => {
                    // console.log("data", data);

                    for (var i = 0; i < data.data.length; i++) {
                        images.push(data.data[i]);
                    }
                    // console.log("this.images: ", this.images);
                });
            }
        }, 500);
    }
})();
