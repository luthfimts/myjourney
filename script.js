// ======================================================
// LOGIN SUPABASE - MYJOURNEY
// ======================================================


const loginForm =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");


// ======================================================
// PROSES LOGIN
// ======================================================

loginForm.addEventListener(
    "submit",

    async function(event) {

        event.preventDefault();


        // Ambil email
        const email =
            document
                .getElementById("email")
                .value
                .trim();


        // Ambil password
        const password =
            document
                .getElementById("password")
                .value;


        // Validasi
        if (
            email === ""
            ||
            password === ""
        ) {

            message.style.color =
                "red";

            message.innerText =
                "Email dan password harus diisi.";

            return;
        }


        // Pesan proses login
        message.style.color =
            "#666";

        message.innerText =
            "Sedang login...";


        // ==================================================
        // LOGIN KE SUPABASE
        // ==================================================

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email: email,

                    password: password

                });


        // ==================================================
        // JIKA LOGIN GAGAL
        // ==================================================

        if (error) {

            console.error(
                "Login error:",
                error
            );

            message.style.color =
                "red";

            message.innerText =
                "Email atau password salah.";

            return;
        }


        // ==================================================
        // JIKA LOGIN BERHASIL
        // ==================================================

        if (data.user) {

            message.style.color =
                "green";

            message.innerText =
                "Login berhasil!";


            setTimeout(
                function() {

                    window.location.href =
                        "dashboard.html";

                },

                500
            );

        }

    }
);

document
    .getElementById("loginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("message");

        if (
            username === usernameBenar &&
            password === passwordBenar
        ) {

            // Menandai bahwa user sudah login
            sessionStorage.setItem("isLoggedIn", "true");

            // Menyimpan username
            sessionStorage.setItem("username", username);

            window.location.href = "dashboard.html";

        } else {

            message.style.color = "red";

            message.innerText =
                "Username atau password salah!";
        }

    });