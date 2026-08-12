// ==============================================
// AUTH GUARD - MYJOURNEY
// Melindungi halaman agar hanya user login
// yang dapat membukanya
// ==============================================

(async function () {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Gagal mengecek session:",
                error
            );

            window.location.replace(
                "index.html"
            );

            return;
        }


        // ======================================
        // BELUM LOGIN
        // ======================================

        if (!data.session) {

            window.location.replace(
                "index.html"
            );

            return;
        }


        // ======================================
        // SUDAH LOGIN
        // ======================================

        document.documentElement.style.visibility =
            "visible";


    } catch (error) {

        console.error(
            "Auth Guard Error:",
            error
        );

        window.location.replace(
            "index.html"
        );

    }

})();
